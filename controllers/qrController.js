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
    herramienta.fechaGuiaDespacho = req.body.fechaGuiaDespacho;
    herramienta.guiaDespacho = req.body.guiaDespacho;

    herramienta.save();

    const qr = await Qr.create({
        herramientumId : id,
        guiaDespacho: req.body.guiaDespacho,
        fechaGuiaDespacho: req.body.fechaGuiaDespacho,
        mantencion: req.body.mantencion,
        proxima: req.body.proxima,
        id: uuidv4(),
        token: shortid()
    });

    return res.status(200).json({ qr, otin: herramienta.otin });
}

// obtiene la fecha de mantencion del qr
const obtenerFecha = async (req, res) => {
    
    const { id } = req.params;

    const herramienta = await Herramienta.findByPk(id);

    const qr = await Qr.findOne({ where: { herramientumId: id }});

    if ( !qr ) {

        return res.status(200).json(qr);
    }

    qr.dataValues.guiaDespacho = herramienta.guiaDespacho;
    qr.dataValues.fechaGuiaDespacho = herramienta.fechaGuiaDespacho;

    return res.status(200).json(qr);
}

// actualiza la fecha del qr
const actualizarFecha = async (req, res) => {

    const { id } = req.params;

    const qr = await Qr.findOne({ where: { herramientumId: id }});

    if ( !qr ) {
        return res.status(404).json({ msg: "Error"});
    }

    const herramienta = await Herramienta.findByPk(id);

    herramienta.guiaDespacho = req.body.guiaDespacho;
    herramienta.fechaGuiaDespacho = req.body.fechaGuiaDespacho;

    await herramienta.save();

    qr.mantencion = req.body.mantencion;
    qr.proxima = req.body.proxima;

    await qr.save();

    return res.status(200).json({ msg: "Actualizado correctamente"});
}

export {
    generarQr,
    obtenerFecha,
    actualizarFecha
}