// models/AdasComponent.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const AdasComponent = sequelize.define(
  'AdasComponent',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'models', // Nom de la table dans la base de données
        key: 'id',       // Clé primaire dans la table des modèles
      },
    },
  },
  {
    tableName: 'adas_components', // Nom de la table des composants ADAS
    timestamps: false,   // Si vous ne voulez pas utiliser les timestamps
  }
);

export default AdasComponent;
