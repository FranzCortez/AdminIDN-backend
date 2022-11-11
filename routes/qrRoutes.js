import expres from "express";
import { generarQr, obtenerFecha, actualizarFecha } from "../controllers/qrController.js";

const router = expres.Router();

// generar qr
router.post('/:id', generarQr);

// obtener fecha del qr (mantencion)
router.get('/:id', obtenerFecha);

// actualiza la fecha del qr (mantencion)
router.put('/:id', actualizarFecha);

export default router;