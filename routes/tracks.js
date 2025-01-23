const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const router = express.Router();
const prisma = new PrismaClient();

const validateUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
router.get("/", async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      include: {
        playlists: true,
      },
    });

    res.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", validateUser, async (req, res) => {
  const trackId = parseInt(req.params.id);
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: { playlists: true },
    });

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    if (req.user) {
      const userPlaylists = track.playlists.filter(
        (playlist) => playlist.ownerId === req.user.id
      );
      res.json({ track, userPlaylists });
    } else {
      res.json(track);
    }
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
