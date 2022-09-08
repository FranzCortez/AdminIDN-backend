import express from "express";
import { crearUsuario, editarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

/** Rutas de usuario */

// crear usuario
router.post('/usuario', crearUsuario);

// editar usuario especifico por ID
router.get('/usuario/:id', editarUsuario);



export default router;