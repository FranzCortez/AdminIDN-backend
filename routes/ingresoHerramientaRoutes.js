import express from "express";
import { nuevoIngresoHerramienta, ingresosFiltroTodos, ingresoInfo, editarInfo, subirArchivo } from "../controllers/ingresoHerramientaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// se ingresa un nuevo ingreso
router.post('/ingreso',auth , nuevoIngresoHerramienta);

// se obtiene los ingresos segun los filtros
router.post('/ingreso/obtener',auth , ingresosFiltroTodos);

// se obtiene 1 ingreso
router.get('/ingreso/:id',auth , ingresoInfo);

// se actualiza 1 ingreso
router.put('/ingreso/:id',auth , editarInfo);

// subir archivo
router.post('/ingreso/pdf' , subirArchivo);

export default router;