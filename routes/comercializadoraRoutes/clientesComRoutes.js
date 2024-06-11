import express from "express";

import {
    nuevoClienteEmpresaCom,
    buscarEmpresaExiste,
    todosClienteEmpresaCom,
    encontrarClienteEmpresaCom,
    actualizarClienteEmpresaCom,
    eliminarClienteEmpresaCom,
    buscarPorNombreCom,
    todosNombresCom,
    buscarContactoExiste,
    crearClienteContactoCom,
    obtenerContactosPorEmpresaCom,
    obtenerContactoEspecificoCom,
    actualizarContactoEmpresaCom,
    eliminarContactoEmpresaCom,
    contactoInfoCom,
    getClientesSelect,
    getClienteContactosSelect
} from "../../controllers/comercializadoraController/clientesControllerCom.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// autocompleta si existe la empresa
router.post('/', auth, buscarEmpresaExiste);

// crea un cliente empreas
router.post('/empresacom',auth , nuevoClienteEmpresaCom);

// obtener todos los clientes empresa
router.get('/empresacom/:pag',auth , todosClienteEmpresaCom);

// obtener empresa por id
router.get('/empresacom/editar/:id',auth , encontrarClienteEmpresaCom);

// actualizar datos de empresa
router.put('/empresacom/:id',auth , actualizarClienteEmpresaCom);

// elimina cliente empresa por id
router.delete('/empresacom/:id',auth , eliminarClienteEmpresaCom);

// busca empresa por nombre
router.get('/empresacomBuscar/:nombre',auth , buscarPorNombreCom);

router.get('/empresacomNombre',auth , todosNombresCom);

// todos clientes empresa form
router.get('/empresacomForm', auth, getClientesSelect);

// CONTACTO EMPRESA

// crea un nuevo contacto para una empresa
router.post('/contactocom/:idEmpresa',auth , crearClienteContactoCom);

// obtener todos los contactos por empresa
router.get('/contactocom/:idEmpresa',auth , obtenerContactosPorEmpresaCom);

// obtener todos los contactos por empresa
router.get('/contactocom/editar/:idEmpresa/:id',auth , obtenerContactoEspecificoCom);

// actualizar contacto de una empresa
router.put('/contactocom/:idEmpresa',auth , actualizarContactoEmpresaCom);

// eliminar contacto de una empresa
router.delete('/contactocom/:idEmpresa/:id',auth , eliminarContactoEmpresaCom);

// obtiene 1 contacto por su id
router.get('/contactocom/info/:id',auth , contactoInfoCom);

// autocompleta si existe la empresa
router.post('/contacocom', auth, buscarContactoExiste);

// todos clientes contactos de 1 empresa form
router.get('/empresacomForm/cliente/:id', auth, getClienteContactosSelect);

export default router;