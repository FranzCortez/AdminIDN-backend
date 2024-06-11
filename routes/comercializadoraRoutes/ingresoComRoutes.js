import express from "express";
import { 
    obtenerOvin,
    nuevoIngresoCom,
    getOvines,
    pruebas,
    obtenerInformacionOvin,
    editarIngresoOvin
 } from "../../controllers/comercializadoraController/ingresoControllerCom.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();

// obtener ovin
router.get('/ovin',auth , obtenerOvin);

// nuevo ingreso ovin
router.post('/',auth , nuevoIngresoCom);

// obtiene todas las ovines
router.get('/ovin/:rol/:usuarioId/:offset',auth , getOvines);

router.get('/:id', auth, obtenerInformacionOvin);

router.get('/prueba/:id', pruebas);

router.put('/ovin/:id', auth, editarIngresoOvin);

export default router;