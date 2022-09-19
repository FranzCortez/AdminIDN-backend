import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

    const authHeader = req.get('Authorization');

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
    next();
}

export {
    auth
}