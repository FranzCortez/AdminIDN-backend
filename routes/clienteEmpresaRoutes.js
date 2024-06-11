import express from "express";
import { nuevoClienteEmpresa, todosClienteEmpresa, encontrarClienteEmpresa, actualizarClienteEmpresa, eliminarClienteEmpresa, buscarPorNombre, todosNombres, nombreEmpresaSelect } from "../controllers/clienteEmpresaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// crea un cliente empreas
router.post('/empresa',auth , nuevoClienteEmpresa);

// obtener todos los clientes empresa
router.get('/empresa/:pag',auth , todosClienteEmpresa);

// obtener empresa por id
router.get('/empresa/editar/:id',auth , encontrarClienteEmpresa);

// actualizar datos de empresa
router.put('/empresa/:id',auth , actualizarClienteEmpresa);

// elimina cliente empresa por id
router.delete('/empresa/:id',auth , eliminarClienteEmpresa);

// busca empresa por nombre
router.get('/empresaBuscar/:nombre',auth , buscarPorNombre);

router.get('/empresaNombre',auth , todosNombres);

router.get('/empresaNombre/select', auth, nombreEmpresaSelect);

export default router;