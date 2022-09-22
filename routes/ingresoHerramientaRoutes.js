import express from "express";
import { nuevoIngresoHerramienta, ingresosFiltroTodos, ingresoInfo, editarInfo } from "../controllers/ingresoHerramientaController.js";

const router = express.Router();

router.post('/ingreso', nuevoIngresoHerramienta);

router.post('/ingreso/obtener', ingresosFiltroTodos);

router.get('/ingreso/:id', ingresoInfo);

router.put('/ingreso/:id', editarInfo);

export default router;