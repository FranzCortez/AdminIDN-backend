import express from "express";
import { nuevaFactura } from "../controllers/facturaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth , nuevaFactura);


export default router;