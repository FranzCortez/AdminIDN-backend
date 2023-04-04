import expres from "express";
import { generarQr, obtenerFecha, actualizarFecha, obtenerInfo } from "../controllers/qrController.js";

import { auth } from "../middleware/auth.js";

const router = expres.Router();

// generar qr
router.post('/:id', auth, generarQr);

// obtener fecha del qr (mantencion)
router.get('/:id', auth, obtenerFecha);

// actualiza la fecha del qr (mantencion)
router.put('/:id', auth, actualizarFecha);

// obtiene info
router.get('/info/:id', auth, obtenerInfo);

export default router;