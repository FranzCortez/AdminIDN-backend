import express from "express";
import { nuevaFactura, obtenerFacturas, actualizarFactura, notaCredito, pagarFactura } from "../controllers/facturaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Agrega una factura
router.post('/', auth , nuevaFactura);

// Obtiene todas las facturas
router.get('/', auth, obtenerFacturas);

// Actualizar factura
router.put('/', auth, actualizarFactura);

// Anula una factura
router.post('/anular/:id', auth, notaCredito);

// Pagar una factura
router.post('/pagar/:id', auth, pagarFactura);

export default router;