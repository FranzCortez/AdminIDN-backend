import express from "express";
import { nuevaFactura, obtenerFacturas, actualizarFactura, notaCredito, pagarFactura, obtenerFactura, numeroFactura } from "../controllers/facturaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Agrega una factura
router.post('/', auth , nuevaFactura);

// Obtiene todas las facturas
router.post('/filtro', auth, obtenerFacturas);

// Actualizar factura
router.put('/:id', auth, actualizarFactura);

// Anula una factura
router.post('/anular/:id', auth, notaCredito);

// Pagar una factura
router.post('/pagar/:id', auth, pagarFactura);

// obtiene 1 factura por id
router.get('/:id', auth, obtenerFactura);

// obtener numero de factura automatico
router.get('/', auth, numeroFactura);

export default router;