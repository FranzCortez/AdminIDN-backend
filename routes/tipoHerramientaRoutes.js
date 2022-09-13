import express from "express";
import { nuevoTipoHerramienta } from "../controllers/tipoHerramientaController.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/categoria/herramienta', nuevoTipoHerramienta);

export default router;