import Qr from "../models/Qr.js";

const mantencion = async (req, res, next) => {
    
    const authToken = req.get('authToken');
    const authId = req.get('authId');

    // if(!authToken || !authId) {
    //     const error = new Error('No autenticado');
    //     error.statusCode = 401;
    //     throw error;
    // }

    const qr = await Qr.findOne({ where: { id: authId, token: authToken } });

    if ( !qr ) {
        const error = new Error('No autenticado');
        error.statusCode = 401;
        throw error;
    }
    
    req.params ={ id: qr.herramientumId};
    req.mantencion = qr.mantencion;
    req.proxima = qr.proxima;
    req.tipo = 1;
    next();
    
}

export {
    mantencion
}