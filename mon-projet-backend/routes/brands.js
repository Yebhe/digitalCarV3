import express from 'express';
import Brand from '../models/Brand.js';

const router = express.Router();

// Ajouter une nouvelle marque
router.post('/brands', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le champ "name" est requis.' });
  }

  try {
    const newBrand = await Brand.create({ name });
    res.status(201).json(newBrand);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la marque :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour une marque
router.put('/brands/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le champ "name" est requis.' });
  }

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: "Marque non trouvée." });
    }

    brand.name = name;
    await brand.save();

    res.status(200).json({ message: "Marque mise à jour avec succès.", brand });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la marque :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Supprimer une marque
router.delete('/brands/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: "Marque non trouvée." });
    }

    await brand.destroy();
    res.status(200).json({ message: "Marque supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la marque :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Récupérer toutes les marques
router.get('/brands', async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.status(200).json(brands);
  } catch (error) {
    console.error("Erreur lors de la récupération des marques :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Récupérer une marque spécifique par ID
router.get('/brands/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: "Marque non trouvée." });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error("Erreur lors de la récupération de la marque :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

export default router;
