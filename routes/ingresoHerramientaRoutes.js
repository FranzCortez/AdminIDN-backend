import express from "express";
import { nuevoIngresoHerramienta } from "../controllers/ingresoHerramientaController.js";

const router = express.Router();

router.post('/ingreso', nuevoIngresoHerramienta);

export default router;