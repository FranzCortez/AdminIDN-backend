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
const subirCertificado = async (req, res, next) => {
    
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

const guardarCertificado = async ( req, res ) => {

    const { id } = req.params;
    const { otin } = req.body;

    const archivos = await Archivos.findOne({ where: { herramientumId: id } });

    if( archivos ) {

        archivos.rutaCertificado = `/${otin}/certificado ${otin}.pdf`;
        await archivos.save();

    } else {

        await Archivos.create({
            herramientumId: id,
            rutaCertificado: `/${otin}/certificado ${otin}.pdf`
        });

    }

    return res.status(200).json({ msg: 'Certificado generado y guardado con exito.' });

}

export {
    subirCertificado,
    guardarCertificado
}