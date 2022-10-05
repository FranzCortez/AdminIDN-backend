import express from "express";
import { nuevoTipoHerramienta, obtenerNombreTodosTipo, obtenerInformacionTipo, actualizarTipoHerramienta, eliminarTipoHerramienta } from "../controllers/tipoHerramientaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/categoria/herramienta',auth , nuevoTipoHerramienta);

// obtiene todos los nombres de los tipos de herramienta
router.get('/categoria/herramienta',auth , obtenerNombreTodosTipo);

// obtiene toda la informacion de 1 tipo de herramineta
router.get('/categoria/herramienta/:id',auth , obtenerInformacionTipo);

// actualiza la informacion de 1 herramienta por id
router.put('/categoria/herramienta/:id',auth , actualizarTipoHerramienta);

// elimina la herramienta por id
router.delete('/categoria/herramienta/:id',auth , eliminarTipoHerramienta);

export default router;