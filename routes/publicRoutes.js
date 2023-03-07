import express from "express";
import { formularioLogin } from "../controllers/publicController.js";
import { reLogin } from "../middleware/auth.js";

const router = express.Router();

/** Area Publica */


// login
router.post('/login', formularioLogin);

// login rapido
router.get('/auth', reLogin);

export default router;