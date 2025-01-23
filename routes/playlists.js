const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { username, password, name, description, trackIds } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Nah" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: WRONG" });
    }
    const validTracks = await prisma.track.findMany({
      where: {
        id: { in: trackIds },
      },
    });
    if (validTracks.length !== trackIds.length) {
      return res.status(400).json({
        error: "One or more track IDs are invalid",
      });
    }
    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        description,
        owner: { connect: { id: user.id } },
        tracks: { connect: trackIds.map((id) => ({ id })) },
      },
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/:id', async (req, res) => {
    const playlistId = parseInt(req.params.id);
  
    try {
      const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: { tracks: true, owner: true }, 
      });
  
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
  
      res.json(playlist);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;
