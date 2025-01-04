import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import multer from "multer"; 
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from "./config/sequelize.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/users.js"; 
import { isAuthenticated } from "./middleware/authMiddleware.js";
import brandRoutes from './routes/brands.js'; 
import modelRoutes from './routes/models.js'; 
import adasComponent from './routes/adasComponent.js'; 
import Brand from './models/Brand.js';
import index from './models/index.js';

// mon ajout
import './models/AdasComponent.js';
import './models/Model.js';
import './models/Brand.js';

// Configurer les relations
index();
// fin mon ajout
dotenv.config();

const app = express();

// Middleware pour CORS et session
app.use(
  cors({
    origin: "http://localhost:5173", // URL de votre frontend Vue
    credentials: true,
  })
);

app.use(express.json()); // Middleware pour analyser les requêtes JSON

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // false si en développement
      httpOnly: true,
      maxAge: 3600000, // 1 heure
    },
  })
);

// Obtient le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filename = fileURLToPath(import.meta.url);
const dirnamePdf = dirname(filename);

// Ensuite, utilisez __dirname comme vous le faisiez avant
const pdfsDir = path.join(dirnamePdf, 'pdfs');
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true }); // Crée le dossier 'pdfs' si nécessaire
}

const storagePdf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfsDir); // Destination vers le dossier 'pdfs'
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.originalname}`;
    cb(null, uniqueName); // Génère un nom unique pour le fichier
  },
});

const uploadPdf = multer({ storage: storagePdf });

// Route pour récupérer un fichier téléchargé
app.get('/api/procedure-pdf/:brandId/:modelId/:componentId', (req, res) => {
  const { brandId, modelId, componentId } = req.params;
  const fileName = `procedure_${brandId}_${modelId}_${componentId}.pdf`;
  const filePath = path.join(__dirname, 'pdfs', fileName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      error: true,
      message: "Le fichier PDF demandé n'existe pas."
    });
  }
});


// Route POST pour l'upload de fichier
app.post("/api/upload-pdf", uploadPdf.single("file"), (req, res) => {
  console.log("File uploaded:", req.file);  // Ajout d'un log pour vérifier le fichier
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier n'a été envoyé." });
  }

  res.status(200).json({
    message: "Fichier uploadé avec succès !",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Routes existantes
app.use("/api/auth", authRoutes);
app.use("/api", usersRoutes);
app.use("/api", brandRoutes);
app.use("/api", modelRoutes);
app.use("/api", adasComponent);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie");
    app.listen(3000, () => {
      console.log("Serveur démarré sur http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données :", err);
  });

app.get("/api/protected", isAuthenticated, (req, res) => {
  res.json({ message: "Route protégée accessible." });
});
