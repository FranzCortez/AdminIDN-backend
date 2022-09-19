import express from "express";
import { crearUsuario, todosUsuarios, encontrarUsuario, editarUsuario, eliminarUsuario, buscarPorNombre } from "../controllers/usuarioController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/** Rutas de usuario */

// crear usuario
router.post('/usuario', auth, crearUsuario);

// obtener usuarios
router.get('/usuario/:pag', auth, todosUsuarios);

// obtner usuario especifico por ID
router.get('/usuario/editar/:id', auth, encontrarUsuario);

// editar usuario por id
router.put('/usuario/:id', auth, editarUsuario);

// eliminar usuario por id
router.delete('/usuario/:id', auth, eliminarUsuario);

router.get('/usuarioBuscar/:nombre', auth, buscarPorNombre);

export default router;