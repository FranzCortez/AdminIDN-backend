import express from "express";
import { crearClienteContacto, obtenerContactosPorEmpresa } from "../controllers/clienteContactoController.js";

const router = express.Router();

// crea un nuevo contacto para una empresa
router.post('/contacto/:idEmpresa', crearClienteContacto);

// obtener todos los contactos por empresa
router.get('/contacto/:idEmpresa', obtenerContactosPorEmpresa);

export default router;