import express from "express";
import { nuevaFactura, obtenerFacturas, actualizarFactura, notaCredito, pagarFactura, obtenerFactura, numeroFactura, cantFactura, infoFact, boletaAutomatica, marcarPagadas, obtenerFacturaMesAño, obtenerIngresoMesAño } from "../controllers/facturaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Agrega una factura
router.post('/', auth , nuevaFactura);

// Obtiene todas las facturas
router.post('/filtro/:offset', auth, obtenerFacturas);

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

// obtener cant de factura 
router.get('/fact/cant', auth,cantFactura);

// obtener informacion de una factura con su numero de factura
router.get('/info/:nFactura', auth, infoFact);

// obtiene facturas para la boleta
router.post('/boleta/facturar', auth, boletaAutomatica);

// marcar generacion de boleta de pago
router.post('/boleta/pago', auth, marcarPagadas);

// obtener factura mes y año
router.post('/balance/factura/mes', auth, obtenerFacturaMesAño);

// obtener ingreso mes y año
router.post('/balance/ingreso/mes', auth, obtenerIngresoMesAño);

export default router;