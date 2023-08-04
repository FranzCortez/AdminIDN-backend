import express from "express";

import { editarSolicitud, guardarSolicitud, obtenerSolicitudes, respuestaSolicitud, obtenerSolicitudId } from "../controllers/checkListController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get('/:offset', auth, obtenerSolicitudes);

router.post('/nuevo', auth, guardarSolicitud);

router.post('/editar/:id', auth, editarSolicitud);

router.post('/respuesta/:id', auth, respuestaSolicitud);

router.get('/solicitud/:id', auth, obtenerSolicitudId);

export default router;