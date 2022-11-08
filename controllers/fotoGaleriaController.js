import FotoGaleria from "../models/FotoGaleria.js";
import Herramienta from "../models/Herramienta.js";

import multer from "multer";
import shortid from "shortid";
import fs from "fs";

// CONFIGURACIÓN MULTER PDF
const fileFilter = {
    fileFilter(req, file, cb) {
        if ( file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `public/${req.otin}`;
        if (!fs.existsSync(dir)) {         
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split('/')[1];
        const imagen = `${shortid.generate()}.${extension}`;
        req.file.push(`/${req.otin}/${imagen}`)
        cb(null, imagen);
    }
});

// Pasar la configiguración y el campo
const upload = multer({ storage: Storage, fileFilter: fileFilter.fileFilter}).array('files[]');

// Sube una foto
const subirFoto = async (req, res, next) => {

    const { id } = req.params;

    const otin = await Herramienta.scope('otin').findByPk(id);

    req.otin = otin.otin;
    req.file = [];

    await upload(req, res, function (error) {
        if (error) {
            return res.json({ mensaje: error })
        }
        return next();
    })
}

// guarda las rutas de las fotos
const nuevoArchivoFoto = async (req, res, next) => {

    const { id } = req.params;

    try {

        const fotoGaleria = await FotoGaleria.findOne({ where: { herramientumId: id }});

        if ( !fotoGaleria ) {            
        
            await FotoGaleria.create({
                archivos: { "0": req.file },
                herramientumId: id
            });
    
            return res.status(200).json({ msg: "Fotos agregadas correctamente a la OTIN: " + req.otin });
        }
        
        const fotos = JSON.parse(fotoGaleria.archivos);
        
        req.file.forEach(file => {
            fotos[0].push(file);
        });
                
        fotoGaleria.archivos = fotos;
        
        await fotoGaleria.save();
        return res.status(200).json({ msg: "Fotos agregadas correctamente a la OTIN: " + req.otin });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al subir fotos, intente nuevamente'});
    }
}

// obtiene todas las rutas por id
const obtenerFoto = async (req, res) => {

    const { id } = req.params;

    const rutas = await FotoGaleria.findOne({ where: { herramientumId: id } });

    if(rutas) {
        return res.status(200).json({ rutas: JSON.parse(rutas.archivos)[0] });
    }

    return res.status(200).json({ msg: "no hay imagenes"});
}

export {
    subirFoto,
    nuevoArchivoFoto,
    obtenerFoto
}