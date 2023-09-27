import express from "express";
import { nuevoEquipo,
    editarEquipo,
    obtenerNombreTodosEquipo, 
    obtenerInfo,
    obtenerInformacionTipo,
    eliminarEquipo,
    buscarPorNombre
} from "../../controllers/comercializadoraController/EquipoControllerCom.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// agrega una nueva categoria de herramienta
router.post('/',auth , nuevoEquipo);

// obtiene todos los nombres de los tipos de equipo
router.get('/',auth , obtenerNombreTodosEquipo);

// obiene todo la info de todos los tipos de equipos
router.get('/categoria',auth, obtenerInfo);

// obtiene toda la informacion de 1 tipo de herramineta
router.get('/categoria/:id',auth , obtenerInformacionTipo);

// actualiza la informacion de 1 equipo por id
router.put('/categoria/:id',auth , editarEquipo);

// elimina la equipo por id
router.delete('/categoria/:id',auth , eliminarEquipo);

export default router;