const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const router = express.Router();




router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword },
      });
      res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      res.json({ message: 'Logged in successfully!' });
    } catch (error) {
      next(error);
    }
  });
module.exports= router;