import express from "express";
import { crearClienteContacto, obtenerContactosPorEmpresa, actualizarContactoEmpresa, eliminarContactoEmpresa } from "../controllers/clienteContactoController.js";

const router = express.Router();

// crea un nuevo contacto para una empresa
router.post('/contacto/:idEmpresa', crearClienteContacto);

// obtener todos los contactos por empresa
router.get('/contacto/:idEmpresa', obtenerContactosPorEmpresa);

// actualizar contacto de una empresa
router.put('/contacto/:idEmpresa', actualizarContactoEmpresa);

// eliminar contacto de una empresa
router.delete('/contacto/:idEmpresa', eliminarContactoEmpresa);


export default router;