import Herramienta from "../models/Herramienta.js";

// crea un nuevo ingreso/herramienta
const nuevoIngresoHerramienta = async (req, res, next) => {
    console.log("entre")
    const { otin, descripcion, nombre, marca, comentario, modelo, numeroIntero, numeroGuiaCliente, guiaDespacho, fechaGuiaDespacho, tipoHerramientaId, clienteContactoId } = req.body;

    if( !otin, !descripcion, !nombre, !marca, !modelo ) {
        res.status(400).json({ msg: 'Todos los campos son necesarios'});
        return next();
    }

    try {
        await Herramienta.create({
            otin,
            descripcion,
            nombre,
            marca,
            comentario,
            modelo,
            fecha: Date.now(),
            numeroIntero,
            numeroGuiaCliente,
            guiaDespacho,
            fechaGuiaDespacho, 
            tipoHerramientaId, 
            clienteContactoId
        });
    
        return res.status(200).json({ msg: 'Ingreso y herramienta creados correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al crear el nuevo ingreso y herramienta, intente nuevamente'});
    }
    
} 

export {
    nuevoIngresoHerramienta
}