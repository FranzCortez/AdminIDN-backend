import express from "express";
import { formularioLogin } from "../controllers/publicController.js";
import { reLogin } from "../middleware/auth.js";
import { statusEfecto, cambioStatus } from "../controllers/efectoController.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

/** Area Publica */


// login
router.post('/login', formularioLogin);

// login rapido
router.get('/auth', reLogin);

router.get('/efecto', statusEfecto);
router.get('/efecto/:id', auth, cambioStatus);

export default router;