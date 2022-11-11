import { v4 as uuidv4 } from 'uuid';
import shortid from "shortid";

import Qr from "../models/Qr.js";
import Herramienta from "../models/Herramienta.js";

// genera un qr
const generarQr = async (req, res) => {
    
    const { id } = req.params;

    const herramienta = await Herramienta.scope('filtro').findByPk(id);

    if( !herramienta ) {
        return res.status(404).json({ msg: "Error en generar qr"});
    }
    
    if ( herramienta.activo === false ) {
        return res.status(400).json({ msg: "Ya se creo el codigo qr"});
    }

    herramienta.activo = false;

    herramienta.save();

    const qr = await Qr.create({
        herramientumId : id,
        mantencion: "2022-11-11",
        id: uuidv4(),
        token: shortid()
    });

    return res.status(200).json(qr);
}

// obtiene la fecha de mantencion del qr
const obtenerFecha = async (req, res) => {
    
    const { id } = req.params;

    const qr = await Qr.findOne({ where: { herramientumId: id }});

    return res.status(200).json(qr);
}

export {
    generarQr,
    obtenerFecha
}