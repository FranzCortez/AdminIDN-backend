import express from "express";
import { crearUsuario, todosUsuarios, encontrarUsuario, editarUsuario, eliminarUsuario, buscarPorNombre } from "../controllers/usuarioController.js";

const router = express.Router();

/** Rutas de usuario */

// crear usuario
router.post('/usuario', crearUsuario);

// obtener usuarios
router.get('/usuario', todosUsuarios);

// obtner usuario especifico por ID
router.get('/usuario/:id', encontrarUsuario);

// editar usuario por id
router.post('/usuario/:id', editarUsuario);

// eliminar usuario por id
router.delete('/usuario/:id', eliminarUsuario);

router.get('/usuarioBuscar/:nombre', buscarPorNombre);

export default router;