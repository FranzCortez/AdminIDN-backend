import express from "express";
import { 
    actualizarProveedor, 
    desactivarProveedor, 
    nuevoProveedor, 
    obtenerProveedores, 
    obtenerProveedor,
    obtenerNombresProveedores,
    actualizarContacto,
    eliminarContacto,
    obtenerContactos,
    editarContacto,
    nuevoContacto
} from "../../controllers/comercializadoraController/proveedorControllerCom.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post( '/', auth, nuevoProveedor );

router.get( '/:offset', auth, obtenerProveedores);

router.put( '/', auth, actualizarProveedor );

router.delete( '/:id', auth, desactivarProveedor );

router.get( '/obtener/:id', auth, obtenerProveedor );

router.get( '/obtener/nombres/proveedores', auth, obtenerNombresProveedores );

router.get('/contactocom/:id/:offset', auth, obtenerContactos);

router.get('/contactocome/editar/:id', auth, editarContacto);

router.put('/contactocom/:id', auth, actualizarContacto);

router.delete('/contactocom/:id', auth, eliminarContacto);

router.post('/contactocom/:id', auth, nuevoContacto);

export default router;