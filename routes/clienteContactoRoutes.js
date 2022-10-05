import express from "express";
import { crearClienteContacto, obtenerContactosPorEmpresa, obtenerContactoEspecifico, actualizarContactoEmpresa, eliminarContactoEmpresa, contactoInfo } from "../controllers/clienteContactoController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// crea un nuevo contacto para una empresa
router.post('/contacto/:idEmpresa',auth , crearClienteContacto);

// obtener todos los contactos por empresa
router.get('/contacto/:idEmpresa',auth , obtenerContactosPorEmpresa);

// obtener todos los contactos por empresa
router.get('/contacto/editar/:idEmpresa/:id',auth , obtenerContactoEspecifico);

// actualizar contacto de una empresa
router.put('/contacto/:idEmpresa',auth , actualizarContactoEmpresa);

// eliminar contacto de una empresa
router.delete('/contacto/:idEmpresa/:id',auth , eliminarContactoEmpresa);

// obtiene 1 contacto por su id
router.get('/contacto/info/:id',auth , contactoInfo);

export default router;