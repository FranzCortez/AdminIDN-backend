import jwt from "jsonwebtoken";
import Qr from "../models/Qr.js";

const auth = (req, res, next) => {

    const authHeader = req.get('Authorization') || req.body?.headers?.Authorization ;

    if(!authHeader) {
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let revisarToken;
    try {
        
        revisarToken = jwt.verify(token, process.env.LLAVESECRETA);

    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    if(!revisarToken) {
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }
    res.token = revisarToken;
    res.tipo = 0;
    next();
}

const mantencion = async (req, res, next) => {
    
    const authToken = req.get('authToken');
    const authId = req.get('authId');

    if(!authToken || !authId) {
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }

    try {
        
        const qr = await Qr.findOne({ where: { id: authId, token: authToken } });

        if ( !qr ) {
            return res.status(404).json({ msg: 'No autenticado'});
        }
        
        req.params ={ id: qr.herramientumId};
        req.mantencion = qr.mantencion;
        req.proxima = qr.proxima;
        req.tipo = 1;
        next();
        
    } catch (error) {
        error.statusCode = 500;
        throw error;        
    }
}

export {
    auth,
    mantencion
}