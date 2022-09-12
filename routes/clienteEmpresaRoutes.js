import express from "express";
import { nuevoClienteEmpresa, todosClienteEmpresa } from "../controllers/clienteEmpresaController.js";

const router = express.Router();

// crea un cliente empreas
router.post('/empresa', nuevoClienteEmpresa);

// obtener todos los clientes empresa
router.get('/empresa', todosClienteEmpresa);

export default router;