// models/associations.js
import Brand from './Brand.js';
import Model from './Model.js';
import AdasComponent from './AdasComponent.js';

const initAssociations = () => {
  // Relation entre Brand et Model (une marque peut avoir plusieurs modèles)
  Brand.hasMany(Model, {
    foreignKey: 'brand_id', // clé étrangère dans la table 'models'
    as: 'models',           // alias pour accéder aux modèles d'une marque
  });

  Model.belongsTo(Brand, {
    foreignKey: 'brand_id', // clé étrangère dans la table 'models'
    as: 'brand',            // alias pour accéder à la marque d'un modèle
  });

  // Relation entre Model et AdasComponent (un modèle peut avoir plusieurs composants ADAS)
  Model.hasMany(AdasComponent, {
    foreignKey: 'model_id', // clé étrangère dans la table 'adas_components'
    as: 'adasComponents',   // alias pour accéder aux composants ADAS d'un modèle
  });

  AdasComponent.belongsTo(Model, {
    foreignKey: 'model_id', // clé étrangère dans la table 'adas_components'
    as: 'model',            // alias pour accéder au modèle d'un composant ADAS
  });
};

export default initAssociations;
