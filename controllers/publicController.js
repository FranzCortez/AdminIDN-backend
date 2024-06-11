import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

const formularioLogin = async (req, res, next) => {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if(!usuario) {
        await res.status(401).json({mensaje: 'Ese usuario no existe'});
        return next();
    } else {
        
        if (!usuario.verificarPassword(password)){
            await res.status(401).json({mensaje: 'Password Incorrecto'});
            return next();
        } else {
            const token = jwt.sign({
               email: usuario.email,
               usuario: usuario.nombre,
               id: usuario.id,
               tipo: usuario.tipo
            }, process.env.LLAVESECRETA, {
                expiresIn: '7d'
            });

            res.json({token, tipo: usuario.tipo, nombre: usuario.nombre, id: usuario.id});
        }
    } 

}

export {
    formularioLogin
}