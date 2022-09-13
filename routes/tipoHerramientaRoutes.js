import express from "express";
import { nuevoTipoHerramienta, obtenerNombreTodosTipo, obtenerInformacionTipo, actualizarTipoHerramienta, eliminarTipoHerramienta } from "../controllers/tipoHerramientaController.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/categoria/herramienta', nuevoTipoHerramienta);

// obtiene todos los nombres de los tipos de herramienta
router.get('/categoria/herramienta', obtenerNombreTodosTipo);

// obtiene toda la informacion de 1 tipo de herramineta
router.get('/categoria/herramienta/:id', obtenerInformacionTipo);

// actualiza la informacion de 1 herramienta por id
router.put('/categoria/herramienta/:id', actualizarTipoHerramienta);

// elimina la herramienta por id
router.delete('/categoria/herramienta/:id', eliminarTipoHerramienta);

export default router;