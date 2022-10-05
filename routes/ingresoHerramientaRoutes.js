import express from "express";
import { nuevoIngresoHerramienta, ingresosFiltroTodos, ingresoInfo, editarInfo } from "../controllers/ingresoHerramientaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post('/ingreso',auth , nuevoIngresoHerramienta);

router.post('/ingreso/obtener',auth , ingresosFiltroTodos);

router.get('/ingreso/:id',auth , ingresoInfo);

router.put('/ingreso/:id',auth , editarInfo);

export default router;