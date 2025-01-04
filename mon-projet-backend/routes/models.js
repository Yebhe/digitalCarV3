import express from 'express';
import Model from '../models/Model.js';
import Brand from '../models/Brand.js';

const router = express.Router();

// Route pour récupérer les modèles associés à une marque spécifique
router.get('/models/brands/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    // Récupérer les modèles associés à la marque
    const models = await Model.findAll({
      where: { brand_id: brandId },
      include: {
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name'],
      },
    });

    if (!models || models.length === 0) {
      return res.status(404).json({ message: 'Aucun modèle trouvé pour cette marque' });
    }

    res.json(models);
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des modèles' });
  }
});

// Ajouter un modèle
router.post("/models", async (req, res) => {
  const { name, brandId } = req.body;

  if (!name || !brandId) {
    return res.status(400).json({ message: "Le nom du modèle et l'ID de la marque sont requis." });
  }

  try {
    // Vérifier si la marque existe
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      return res.status(404).json({ message: "La marque spécifiée n'existe pas." });
    }

    // Créer le modèle
    const newModel = await Model.create({ name, brand_id: brandId });

    res.status(201).json(newModel);
  } catch (error) {
    console.error("Erreur lors de l'ajout du modèle:", error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'ajout du modèle." });
  }
});

// Mettre à jour un modèle
router.put('/models/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Le nom du modèle est requis." });
  }

  try {
    // Trouver le modèle
    const model = await Model.findByPk(id);
    if (!model) {
      return res.status(404).json({ message: "Le modèle spécifié n'existe pas." });
    }

    // Mettre à jour le modèle
    model.name = name;
    await model.save();

    res.json(model);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du modèle:", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour du modèle." });
  }
});

// Supprimer un modèle
router.delete('/models/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver le modèle
    const model = await Model.findByPk(id);
    if (!model) {
      return res.status(404).json({ message: "Le modèle spécifié n'existe pas." });
    }

    // Supprimer le modèle
    await model.destroy();

    res.json({ message: "Modèle supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du modèle:", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la suppression du modèle." });
  }
});

export default router;
