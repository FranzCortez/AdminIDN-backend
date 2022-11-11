import expres from "express";
import { generarQr, obtenerFecha } from "../controllers/qrController.js";

const router = expres.Router();

// generar qr
router.post('/:id', generarQr);

// generar qr
router.get('/:id', obtenerFecha);

export default router;