import express from "express";
import { nuevoEquipo,
    editarEquipo,
    obtenerNombreTodosEquipo, 
    obtenerInfo,
    obtenerInformacionTipo,
    eliminarEquipo,
    obtenerUnEquipo,
    buscarPorNombre,
    actualizarEquipoPadre,
    nuevoEquipoPadre,
    obtenerEquiposPadres,
    obtenerEquipoPadre,
    obtenerNombrePadre
} from "../../controllers/comercializadoraController/equipoControllerCom.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// agrega una nueva categoria de equipo
router.post('/',auth , nuevoEquipo);

// obtiene todos los nombres de los tipos de equipo
router.get('/',auth , obtenerNombreTodosEquipo);

// obiene todo la info de todos los tipos de equipos
router.get('/categoria',auth, obtenerInfo);

// obtiene toda la informacion de 1 tipo de equipo
router.get('/categoria/:id/:offset',auth , obtenerInformacionTipo);

router.get('/categoria/:id', auth, obtenerUnEquipo);

// actualiza la informacion de 1 equipo por id
router.put('/categoria/:id',auth , editarEquipo);

// elimina la equipo por id
router.delete('/categoria/:id',auth , eliminarEquipo);

// agregar un nuevo equipo padre
router.post('/padre', auth, nuevoEquipoPadre);

// obtiene todos  los tipos de equipo padre
router.get('/padre/:pag', auth , obtenerEquiposPadres);

// actualiza la informacion de 1 equipo padre por id
router.put('/padre/:id', auth , actualizarEquipoPadre);

// obtiene un equipo padre
router.get('/padre/obtener/:id', auth , obtenerEquipoPadre);

// obtiene el nombre del padre por id
router.get('/padre/obtener/nombre/:id', auth , obtenerNombrePadre);

export default router;