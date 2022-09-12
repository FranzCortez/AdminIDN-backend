import express from "express";
import { crearClienteContacto } from "../controllers/clienteContactoController.js";

const router = express.Router();

// crea un nuevo contacto para una empresa
router.post('/contacto/:idEmpresa', crearClienteContacto);

export default router;