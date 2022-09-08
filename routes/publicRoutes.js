import express from "express";
import { formularioLogin } from "../controllers/publicController.js";

const router = express.Router();

/** Area Publica */


// login
router.post('/login', formularioLogin);

export default router;