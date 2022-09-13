import express from "express";
import { nuevoTipoHerramienta, obtenerNombreTodosTipo } from "../controllers/tipoHerramientaController.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/categoria/herramienta', nuevoTipoHerramienta);

// obtiene todos los nombres de los tipos de herramienta
router.get('/categoria/herramienta', obtenerNombreTodosTipo);

export default router;