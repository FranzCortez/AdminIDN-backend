import express from "express";
import { obtenerOtin, nuevoIngresoHerramienta, ingresosFiltroTodos, ingresoInfo, editarInfo, subirArchivo, cotizacion, obtenerArchivo, ingresoIdEmpresa, guardarPreinforme, obtenerFallaPreinforme, obtenerTecnicoPreinforme, actualizarPreinforme, obtenerPreinforme, obtenerIngresoMes } from "../controllers/ingresoHerramientaController.js";
import { subirFoto, nuevoArchivoFoto, obtenerFoto, eliminarFotos, fotoBase } from "../controllers/fotoGaleriaController.js";
import { subirInforme, guardarInforme, obtenerInforme, guardarDatosInforme, obtenerDatosInforme, obtenerConclusionInforme } from "../controllers/informeController.js";
import { subirCertificado, guardarCertificado, obtenerCertificado } from "../controllers/certificadoController.js";
import { auth, mantencion } from "../middleware/auth.js";

const router = express.Router();

// obtener OTIN
router.get('/otin', auth, obtenerOtin);

// se ingresa un nuevo ingreso
router.post('/ingreso',auth , nuevoIngresoHerramienta);

// se obtiene los ingresos segun los filtros
router.post('/ingreso/obtener/:offset',auth , ingresosFiltroTodos);

// obtener ingreso segun empresID
router.post('/ingreso/empresa', auth, ingresoIdEmpresa);

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

// obtiene el informe
router.get('/ingreso/informe/:id', auth, obtenerInforme);

// guarda el certificado
router.post('/ingreso/certificado/:id', auth, subirCertificado, guardarCertificado );

// obtener el certificado
router.get('/ingreso/certificado/:id', auth, obtenerCertificado);

// guardar datos de informe
router.post('/info', auth, guardarDatosInforme);

// obtener datos de informe
router.get('/info/:id', auth, obtenerDatosInforme);

//obtener conclusion de informe
router.get('/info/conclu/:id', auth, obtenerConclusionInforme);

// guardar preinforme
router.post('/preinforme', auth, guardarPreinforme);

// obtener preinforme
router.get('/preinforme/:id', auth, obtenerPreinforme);

// obtener falla preinforme
router.get('/preinforme/falla/:id', auth, obtenerFallaPreinforme);

// obtener falla preinforme
router.get('/preinforme/tecnico/:id', auth, obtenerTecnicoPreinforme);

// obtener falla preinforme
router.put('/preinforme/actualizar/:id', auth, actualizarPreinforme);

// obtener ingresos por mes
router.post('/ingreso/mes', auth, obtenerIngresoMes);

export default router;