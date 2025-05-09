import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import { User } from './models/user.js';
import { Routine } from './models/routine.js';

import authRoutes from './routes/auth.js';
import routineRoutes from './routes/routines.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('MySQL sincronizado');
  app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
});

