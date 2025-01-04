// models/Model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Model = sequelize.define(
  'Model',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brands', // Nom de la table dans la base de données
        key: 'id',       // Clé primaire dans la table des marques
      },
    },
  },
  {
    tableName: 'models', // Nom de la table des modèles
    timestamps: false,   // Si vous ne voulez pas utiliser les timestamps
  }
);

export default Model;
