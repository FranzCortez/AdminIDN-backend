import express from "express";
import { nuevaFactura, obtenerFacturas } from "../controllers/facturaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Agrega una factura
router.post('/', auth , nuevaFactura);

// Obtiene todas las facturas
router.get('/', auth, obtenerFacturas);

export default router;