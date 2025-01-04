import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Brand = sequelize.define(
  'Brand',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'brands', // Assurez-vous que le nom de la table est correct
    timestamps: false,   // Vous pouvez activer ou désactiver les timestamps
  }
);

export default Brand;
