import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import { User } from './user.js';

export const Routine = sequelize.define('Routine', {
  title: DataTypes.STRING,
  day: DataTypes.STRING,
  time: DataTypes.STRING
});

User.hasMany(Routine);
Routine.belongsTo(User);

