import express from "express";
import { crearUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

/** Rutas de usuario */

// crear usuario
router.post('/usuario', crearUsuario);



export default router;