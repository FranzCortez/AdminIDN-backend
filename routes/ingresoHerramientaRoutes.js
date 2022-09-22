import express from "express";
import { nuevoIngresoHerramienta, ingresosFiltroTodos } from "../controllers/ingresoHerramientaController.js";

const router = express.Router();

router.post('/ingreso', nuevoIngresoHerramienta);

router.post('/ingreso/obtener', ingresosFiltroTodos);

export default router;