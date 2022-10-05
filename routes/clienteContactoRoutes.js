import express from "express";
import { crearClienteContacto, obtenerContactosPorEmpresa, obtenerContactoEspecifico, actualizarContactoEmpresa, eliminarContactoEmpresa, contactoInfo } from "../controllers/clienteContactoController.js";

const router = express.Router();

// crea un nuevo contacto para una empresa
router.post('/contacto/:idEmpresa', crearClienteContacto);

// obtener todos los contactos por empresa
router.get('/contacto/:idEmpresa', obtenerContactosPorEmpresa);

// obtener todos los contactos por empresa
router.get('/contacto/editar/:idEmpresa/:id', obtenerContactoEspecifico);

// actualizar contacto de una empresa
router.put('/contacto/:idEmpresa', actualizarContactoEmpresa);

// eliminar contacto de una empresa
router.delete('/contacto/:idEmpresa/:id', eliminarContactoEmpresa);

// obtiene 1 contacto por su id
router.get('/contacto/info/:id', contactoInfo);

export default router;