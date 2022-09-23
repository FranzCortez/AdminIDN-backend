import express from "express";
import { nuevoClienteEmpresa, todosClienteEmpresa, encontrarClienteEmpresa, actualizarClienteEmpresa, eliminarClienteEmpresa, buscarPorNombre, todosNombres } from "../controllers/clienteEmpresaController.js";

const router = express.Router();

// crea un cliente empreas
router.post('/empresa', nuevoClienteEmpresa);

// obtener todos los clientes empresa
router.get('/empresa/:pag', todosClienteEmpresa);

// obtener empresa por id
router.get('/empresa/editar/:id', encontrarClienteEmpresa);

// actualizar datos de empresa
router.put('/empresa/:id', actualizarClienteEmpresa);

// elimina cliente empresa por id
router.delete('/empresa/:id', eliminarClienteEmpresa);

// busca empresa por nombre
router.get('/empresaBuscar/:nombre', buscarPorNombre);

router.get('/empresaNombre', todosNombres);

export default router;