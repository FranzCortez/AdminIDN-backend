import expres from "express";
import { generarQr } from "../controllers/qrController.js";

const router = expres.Router();

// generar qr
router.post('/:id', generarQr);

export default router;