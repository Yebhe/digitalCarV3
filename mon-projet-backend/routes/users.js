import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.findAll();  

    // Vérification si des utilisateurs ont été récupérés
    if (!users || users.length === 0) {
      console.log("Aucun utilisateur trouvé.");
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }

    // Afficher les utilisateurs dans la console pour vérifier
    console.log("Utilisateurs récupérés:", users);

    // Retourner les utilisateurs en format JSON
    res.json(users);  
  } catch (error) {
    // Afficher l'erreur complète dans la console
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

export default router;
