import express from "express";
import { nuevoClienteEmpresa, todosClienteEmpresa, encontrarClienteEmpresa, actualizarClienteEmpresa } from "../controllers/clienteEmpresaController.js";

const router = express.Router();

// crea un cliente empreas
router.post('/empresa', nuevoClienteEmpresa);

// obtener todos los clientes empresa
router.get('/empresa', todosClienteEmpresa);

// obtener empresa por id
router.get('/empresa/:id', encontrarClienteEmpresa);

// actualizar datos de empresa
router.put('/empresa/:id', actualizarClienteEmpresa);

export default router;