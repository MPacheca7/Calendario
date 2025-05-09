import express from 'express';
import jwt from 'jsonwebtoken';
import { Routine } from '../models/routine.js';

const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

router.get('/', authMiddleware, async (req, res) => {
  const routines = await Routine.findAll({ where: { UserId: req.user.userId } });
  res.json(routines);
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, day, time } = req.body;
  const routine = await Routine.create({ title, day, time, UserId: req.user.userId });
  res.status(201).json(routine);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, day, time } = req.body;

  const routine = await Routine.findOne({ where: { id, UserId: req.user.userId } });
  if (!routine) return res.status(404).json({ error: 'Rutina no encontrada' });

  routine.title = title;
  routine.day = day;
  routine.time = time;
  await routine.save();

  res.json({ message: 'Rutina actualizada', routine });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const routine = await Routine.findOne({ where: { id, UserId: req.user.userId } });
  if (!routine) return res.status(404).json({ error: 'Rutina no encontrada' });

  await routine.destroy();
  res.json({ message: 'Rutina eliminada' });
});

export default router;

