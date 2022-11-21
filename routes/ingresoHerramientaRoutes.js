import express from "express";
import { nuevoIngresoHerramienta, ingresosFiltroTodos, ingresoInfo, editarInfo, subirArchivo, cotizacion, obtenerArchivo } from "../controllers/ingresoHerramientaController.js";
import { subirFoto, nuevoArchivoFoto, obtenerFoto, eliminarFotos, fotoBase } from "../controllers/fotoGaleriaController.js";
import { subirInforme, guardarInforme } from "../controllers/informeController.js";
import { auth, mantencion } from "../middleware/auth.js";

const router = express.Router();

// se ingresa un nuevo ingreso
router.post('/ingreso',auth , nuevoIngresoHerramienta);

// se obtiene los ingresos segun los filtros
router.post('/ingreso/obtener',auth , ingresosFiltroTodos);

// se obtiene 1 ingreso
router.get('/ingreso/:id',auth , ingresoInfo);

// se actualiza 1 ingreso
router.put('/ingreso/:id',auth , editarInfo);

// subir archivo
router.post('/ingreso/pdf', auth, subirArchivo, cotizacion);

// obtener ruta para abrir o descargar archivo
router.get('/ingreso/pdf/:id', auth, obtenerArchivo);

// subir foto
router.post('/ingreso/foto/:id', auth, subirFoto, nuevoArchivoFoto);

// obtener las rutas de las imagenes
router.get('/ingreso/foto/:id', auth, obtenerFoto);

// eliminar fotos
router.post('/ingreso/foto/eliminar/:id', auth, eliminarFotos);

// obtener datos mantencion
router.get('/mantencion/:id', mantencion, ingresoInfo);

// obtiene las fotos pero en base 64
router.post('/base/foto', auth, fotoBase);

// sube y guarda el informe
router.post('/ingreso/informe/:id', auth, subirInforme, guardarInforme);

export default router;