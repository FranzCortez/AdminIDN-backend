import express from "express";
import { nuevoTipoHerramienta,obtenerInfo, obtenerNombreTodosTipo, obtenerInformacionTipo, actualizarTipoHerramienta, eliminarTipoHerramienta, buscarPorNombre, fallaTipoHerramienta, actulizarFalla, actulizarRecomendacion, actulizarConclusion } from "../controllers/tipoHerramientaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/categoria/herramienta',auth , nuevoTipoHerramienta);

// obtiene todos los nombres de los tipos de herramienta
router.get('/categoria/herramienta',auth , obtenerNombreTodosTipo);

// obiene todo la info de todos los tipos de herramientas
router.get('/categoria/herramientas',auth, obtenerInfo);

// obtiene toda la informacion de 1 tipo de herramineta
router.get('/categoria/herramienta/:id',auth , obtenerInformacionTipo);

// actualiza la informacion de 1 herramienta por id
router.put('/categoria/herramienta/:id',auth , actualizarTipoHerramienta);

// elimina la herramienta por id
router.delete('/categoria/herramienta/:id',auth , eliminarTipoHerramienta);

router.get('/categoria/:nombre', auth, buscarPorNombre);

router.get('/falla/:id', auth, fallaTipoHerramienta);

// actualiza falla
router.put('/falla/:id', auth, actulizarFalla);

// actualiza recomendacion
router.put('/recomendacion/:id', auth, actulizarRecomendacion);

// actualiza conclusion
router.put('/conclusion/:id', auth, actulizarConclusion);

export default router;