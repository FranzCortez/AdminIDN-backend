import Informe from "../models/Informe.js";
import Archivos from "../models/Archivos.js";

import multer from "multer";
import fs from "fs";

// CONFIGURACIÓN MULTER PDF
const fileFilter = {
    fileFilter(req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const otin = file.originalname.split(" ")[1].split(".")[0];

        req.body = { otin };

        let dir = `public/${otin}`;
        
        if (!fs.existsSync(dir)) {         
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Pasar la configiguración y el campo
const upload = multer({ storage: Storage, fileFilter: fileFilter.fileFilter}).array('document');

// Sube un archivo
const subirInforme = async (req, res, next) => {
    
    const { id } = req.params;
    
    if ( !id ) {
        return res.status(404).json({ msg: "Faltan campos importantes" });        
    }

    await upload(req, res, function (error) {
        if (error) {
            return res.json({ mensaje: error })
        }
        return next();
    })
}

const guardarInforme = async (req, res) => {

    const { id } = req.params;

    const { otin } = req.body;

    const archivos = await Archivos.findOne({ where: { herramientumId: id } });

    if( archivos ) {

        archivos.rutaInforme = `/${otin}/informe ${otin}.pdf`;
        await archivos.save();

    } else {

        await Archivos.create({
            herramientumId: id,
            rutaInforme: `/${otin}/informe ${otin}.pdf`
        });

    }

    return res.status(200).json({ msg: 'Informe generado y guardado con exito.' });
}

const obtenerInforme = async (req, res) => {

    const { id } = req.params;

    const archivo = await Archivos.scope('informe').findOne({ where: { herramientumId: id } });

    return res.status(200).json(archivo);
}

const guardarDatosInforme = async (req, res) => {

    const { nombreCliente, fechaEvaluacion, fechaCotizacion, condiciones, plazoEntrega, garantia, gastos, contenido, descuento, tecnico, fechaInfo, falla, cuadroA, cuadroB, fallaText, conclusion, recomendacion, id } = req.body;
    
    const info = await Informe.findOne({ where: { herramientumId: id } });

    if ( info ) {

        info.nombreCliente = nombreCliente;
        info.fechaEvaluacion = fechaEvaluacion;
        info.fechaCotizacion = fechaCotizacion;
        info.condiciones = condiciones;
        info.plazoEntrega = plazoEntrega;
        info.garantia = garantia;
        info.gastos = gastos;
        info.contenido = JSON.stringify(contenido);
        info.descuento = descuento;
        info.tecnico = tecnico;
        info.fechaInfo = fechaInfo;
        info.falla = falla;
        info.cuadroA = JSON.stringify(cuadroA);
        info.cuadroB = JSON.stringify(cuadroB);
        info.fallaText = fallaText?.join('\n');
        info.conclusion = conclusion?.join('\n');
        info.recomendacion = recomendacion?.join('\n');

        await info.save();

        return res.status(200).json({ msg: 'Datos de informe guardados' });

    }

    await Informe.create({
        nombreCliente,
        fechaEvaluacion,
        fechaCotizacion,
        condiciones,
        plazoEntrega,
        garantia,
        gastos,
        contenido :JSON.stringify(contenido),
        descuento,
        tecnico,
        fechaInfo,
        falla,
        cuadroA : JSON.stringify(cuadroA),
        cuadroB : JSON.stringify(cuadroB),
        fallaText : fallaText?.join('\n'),
        conclusion : conclusion?.join('\n'),
        recomendacion : recomendacion?.join('\n'),
        herramientumId: id
    });

    return res.status(200).json({ msg: 'Datos de informe guardados' });
}

const obtenerDatosInforme = async (req, res) => {

    const { id } = req.params;

    const info = await Informe.findOne( { where: {herramientumId: id} } );

    res.status(200).json(info);
}

const obtenerConclusionInforme = async (req, res) => {
    
    const { id } = req.params;

    const info = await Informe.scope('conclusion').findOne({ where: { herramientumId: id } });

    res.status(200).json(info);

}

export {
    subirInforme,
    guardarInforme,
    obtenerInforme,
    guardarDatosInforme,
    obtenerDatosInforme,
    obtenerConclusionInforme
}