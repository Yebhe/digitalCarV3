// routes/adasComponentRoutes.js
import express from 'express';
import AdasComponent from '../models/AdasComponent.js';
import Model from '../models/Model.js'; // Assurez-vous que le modèle `Model` est importé correctement
import Brand from '../models/Brand.js'; // Assurez-vous que le modèle `Brand` est importé correctement
import { Op } from 'sequelize';

const router = express.Router();

router.get('/adas-components/by-model/:modelId', async (req, res) => {
  const { modelId } = req.params;

  try {
    // Vérifie que le modelId est valide
    if (!modelId) {
      return res.status(400).json({ message: 'Un modelId est requis.' });
    }

    // Requête pour récupérer les composants ADAS associés au modèle
    const adasComponents = await AdasComponent.findAll({
      where: { model_id: modelId }, // Filtrer par `model_id`
      include: [
        {
          model: Model,
          as: 'model', // Alias défini dans la relation
        },
      ],
    });

    // Vérifie si des composants ADAS ont été trouvés
    if (!adasComponents || adasComponents.length === 0) {
      return res.status(404).json({ message: 'Aucun composant ADAS trouvé pour ce modèle.' });
    }

    res.json(adasComponents);
  } catch (error) {
    console.error('Erreur lors de la récupération des composants ADAS:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des composants ADAS.' });
  }
});


// Création d'un composant ADAS
router.post('/adas-components', async (req, res) => {
  const { name, modelId } = req.body;

  if (!name || !modelId) {
    return res.status(400).json({ error: 'Le nom et l\'ID du modèle sont requis.' });
  }

  try {
    // Vérification de l'existence du modèle
    const model = await Model.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ error: 'Modèle non trouvé.' });
    }

    // Création du composant ADAS
    const newAdasComponent = await AdasComponent.create({ name, model_id: modelId });
    res.status(201).json(newAdasComponent);
  } catch (error) {
    console.error('Erreur lors de la création du composant ADAS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du composant ADAS.' });
  }
});

// Récupérer tous les composants ADAS par modèle
router.get('/adas-components/by-model/:modelId', async (req, res) => {
  const { modelId } = req.params;

  if (!modelId) {
    return res.status(400).json({ error: 'L\'ID du modèle est requis.' });
  }

  try {
    // Vérification de l'existence du modèle
    const model = await Model.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ error: 'Modèle non trouvé.' });
    }

    // Récupération des composants ADAS associés au modèle
    const adasComponents = await AdasComponent.findAll({
      where: { model_id: modelId },
      include: [{
        model: Model,
        as: 'model',
        attributes: ['name'], // Récupérer uniquement le nom du modèle
      }],
    });

    if (!adasComponents || adasComponents.length === 0) {
      return res.status(404).json({ error: 'Aucun composant ADAS trouvé pour ce modèle.' });
    }

    res.json(adasComponents);
  } catch (error) {
    console.error('Erreur lors de la récupération des composants ADAS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des composants ADAS.' });
  }
});

// Récupérer un composant ADAS par ID
router.get('/adas-components/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Recherche du composant ADAS par son ID
    const adasComponent = await AdasComponent.findByPk(id, {
      include: [{
        model: Model,
        as: 'model',
        attributes: ['name'],
      }],
    });

    if (!adasComponent) {
      return res.status(404).json({ error: 'Composant ADAS non trouvé.' });
    }

    res.json(adasComponent);
  } catch (error) {
    console.error('Erreur lors de la récupération du composant ADAS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du composant ADAS.' });
  }
});

// Mise à jour d'un composant ADAS
router.put('/adas-components/:id', async (req, res) => {
  const { id } = req.params;
  const { name, modelId } = req.body;

  if (!name || !modelId) {
    return res.status(400).json({ error: 'Le nom et l\'ID du modèle sont requis.' });
  }

  try {
    const adasComponent = await AdasComponent.findByPk(id);
    if (!adasComponent) {
      return res.status(404).json({ error: 'Composant ADAS non trouvé.' });
    }

    const model = await Model.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ error: 'Modèle non trouvé.' });
    }

    // Mise à jour des données du composant ADAS
    adasComponent.name = name;
    adasComponent.model_id = modelId;

    await adasComponent.save();

    res.json(adasComponent);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du composant ADAS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du composant ADAS.' });
  }
});


// Suppression d'un composant ADAS
router.delete('/adas-components/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Recherche du composant ADAS
    const adasComponent = await AdasComponent.findByPk(id);
    if (!adasComponent) {
      return res.status(404).json({ error: 'Composant ADAS non trouvé.' });
    }

    // Suppression du composant ADAS
    await adasComponent.destroy();
    res.json({ message: 'Composant ADAS supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du composant ADAS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du composant ADAS.' });
  }
});

export default router;
