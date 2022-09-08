import express from "express";
import { crearUsuario, todosUsuarios, encontrarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

/** Rutas de usuario */

// crear usuario
router.post('/usuario', crearUsuario);

// obtener usuarios
router.get('/usuario', todosUsuarios);

// obtner usuario especifico por ID
router.get('/usuario/:id', encontrarUsuario);

export default router;