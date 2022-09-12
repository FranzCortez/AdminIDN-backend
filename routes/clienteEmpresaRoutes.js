import express from "express";
import { nuevoClienteEmpresa, todosClienteEmpresa, encontrarClienteEmpresa } from "../controllers/clienteEmpresaController.js";

const router = express.Router();

// crea un cliente empreas
router.post('/empresa', nuevoClienteEmpresa);

// obtener todos los clientes empresa
router.get('/empresa', todosClienteEmpresa);

// obtener empresa por id
router.get('/emrpesa/:id', encontrarClienteEmpresa);

export default router;