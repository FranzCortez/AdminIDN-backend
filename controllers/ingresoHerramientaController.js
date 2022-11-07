import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";
import TipoHerramienta from "../models/TipoHerramienta.js";
import Cotizacion from "../models/Cotizacion.js";
import Sequelize from "sequelize";
import multer from "multer";
import fs from "fs";
const Op = Sequelize.Op;

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
        let dir = `public/${file.originalname.split(" ")[1].split(".")[0]}`;
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
const subirArchivo = async (req, res, next) => {
    await upload(req, res, function (error) {
        if (error) {
            return res.json({ mensaje: error })
        }
        return next();
    })
}

// ----------------------------

// crea un nuevo ingreso y herramienta
const nuevoIngresoHerramienta = async (req, res, next) => {
    
    const { nombre, marca, comentario, modelo, numeroInterno, numeroGuiaCliente, tipoHerramientaId, clienteContactoId, fecha, numeroSerie } = req.body;

    if( !nombre, !marca, !modelo ) {
        res.status(400).json({ msg: 'Todos los campos son necesarios'});
        return next();
    }

    try {

        const ultimoIngreso = await Herramienta.scope('otin').findAll({
            limit: 1,
            where: {
              activo : true
            },
            order: [ [ 'id', 'DESC' ]]
        });

        let otin;
        
        if(ultimoIngreso.length === 0) { 
            otin = '1-' + new Date().getFullYear();
        } else {
            otin = (parseInt(ultimoIngreso[0].otin.split("-")[0]) + 1) + '-' + new Date().getFullYear();
        }

        await Herramienta.create({
            otin,
            nombre,
            marca,
            comentario,
            modelo,
            fecha,
            numeroInterno,
            numeroGuiaCliente,
            numeroSerie,
            tipoHerramientaId, 
            clienteContactoId
        });

        const dir = `./public/${otin}`
        fs.mkdir(dir, (err) => {
            if (err) {
                throw err;
            }
        });
    
        return res.status(200).json({ msg: `Ingreso y herramienta: ${nombre} creada correctamente con otin: ${otin}` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al crear el nuevo ingreso y herramienta, intente nuevamente'});
    }
    
} 

// obtener todos los ingresos ordenados segun del mas nuevo al mas antiguo y por si estana activos o no
// filtro por otin(text), nombre(text), marca(text), modelo(text), numero interno(text), fecha ingreso(selected), nombre cliente(selected), numero serie(text), tipo herramienta(selected)
const ingresosFiltroTodos = async (req, res, next) => {
    
    const { fecha, otin, nombre, marca, modelo, numeroInterno, numeroSerie, empresaId, tipoHerramientaId, activo } = req.body;

    let where = {}
    let include = [];

    if( fecha !== '' && fecha ) {
        where.fecha = {
            [Op.eq] : fecha
        }
    }
    
    if( otin !== '' && otin ) {
        where.otin = {
            [Op.like] : '%' + otin + '%'
        }
    }

    if( nombre !== '' && nombre ) {
        where.nombre = {
            [Op.like] : '%' + nombre + '%'
        }
    }

    if( numeroSerie !== '' && numeroSerie ) {
        where.numeroSerie = {
            [Op.like] : '%' + numeroSerie + '%'
        }
    }

    if( marca !== '' && marca ) {
        where.marca = {
            [Op.like] : '%' + marca + '%'
        }
    }

    if( modelo !== '' && modelo ) {
        where.modelo = {
            [Op.like] : '%' + modelo + '%'
        }
    }
 
    if( tipoHerramientaId !== '' && tipoHerramientaId && tipoHerramientaId !== '0' ) {
        where.tipoHerramientumId = {
            [Op.eq] : tipoHerramientaId
        }
    }

    if( numeroInterno !== '' && numeroInterno ) {
        where.numeroInterno = {
            [Op.eq] : numeroInterno
        }
    }

    if( empresaId !== '' && empresaId && empresaId !== '0' ) {
        include.push({
            model: ClienteContacto,
            where: {
                clienteEmpresaId: empresaId
            },
            attributes: ['nombre'],
            include: {
                model: ClienteEmpresa,
                attributes: ['id', 'nombre']
            }
        });
    } else {
        include.push(
            {
                model: ClienteContacto,
                attributes: ['nombre'],
                include: {
                    model: ClienteEmpresa,
                    attributes: ['id', 'nombre']
                }
            }
        );
    }

    if( activo !== '' && activo && activo !== '0' ){
        where.activo = {
            [Op.eq] : activo
        }
    }

    const herramientas = await Herramienta.scope('filtro').findAll({ 
        where,
        include,
        order: [['activo', 'DESC']]
    });

    return res.status(200).json(herramientas);

}

// obtiene toda la info de 1 ingreso
const ingresoInfo = async ( req, res, next ) => {

    const { id } = req.params;

    if(!id) {
        res.status(404).json({ msg: 'Faltan parametros' });
        return next();
    }

    const ingreso = await Herramienta.findOne( { 
        where:  { id }, 
        include: [
            {
                model: ClienteContacto,
                attributes: ['nombre', 'correo', 'telefono'],
                include: [
                    {
                        model: ClienteEmpresa,
                        attributes: ['id', 'nombre', 'direccion', 'rut']
                    }
                ]
            },
            {
                model: TipoHerramienta,
                attributes: ['id', 'nombre']
            }
        ]
    });

    if(!ingreso){
        res.status(404).json({ msg: 'No existe'});
        return next();
    }

    return res.status(200).json(ingreso);
}

// edita la informacion de un ingreso
const editarInfo = async ( req, res, next ) => {

    const { id } = req.params;

    if(!id) {
        res.status(404).json({ msg: 'Faltan parametros' });
        return next();
    }

    const ingreso = await Herramienta.findByPk( id );

    if(!ingreso){
        res.status(404).json({ msg: 'No existe'});
        return next();
    }

    const { comentario, nombre, marca, modelo, numeroInterno, numeroGuiaCliente, tipoHerramientaId, clienteContactoId, fecha, numeroSerie } = req.body;

    ingreso.comentario = comentario;
    ingreso.nombre = nombre;
    ingreso.marca = marca;
    ingreso.fecha = fecha;
    ingreso.modelo = modelo;
    ingreso.numeroSerie = numeroSerie;
    ingreso.numeroInterno = numeroInterno;
    ingreso.numeroGuiaCliente = numeroGuiaCliente;
    ingreso.tipoHerramientaId = tipoHerramientaId;
    ingreso.clienteContactoId = clienteContactoId;

    await ingreso.save();

    return res.status(200).json(`Herramineta e Ingreso de: ${ingreso.nombre}, actualizado correctamente`);
}

// guarda una cotizacion en la base de datos
const cotizacion = async (req, res, next) => {

    const data = JSON.parse(req.body.data);

    const { contenido, fechaEvaluacion, fechaCotizacion, condiciones, plazoEntrega, garantia, descuento, subtotal, neto, iva, total, otin, clienteContactoId, herramientumId } = data;

    if( !otin || !clienteContactoId ) {
        return res.status(404).json({ msg: "Faltan campos importantes" });
    }

    try {
        let json = {
            contenido
        }
        await Cotizacion.create({
            contenido: json,
            fechaCotizacion,
            fechaEvaluacion,
            condiciones,
            plazoEntrega,
            garantia,
            descuento,
            subtotal,
            neto,
            iva, 
            herramientumId,
            total,
            otin,
            clienteContactoId,
            archivo: `/${otin}/cotizacion ${otin}.pdf`
        });
    
        return res.status(200).json({ msg: `Cotización creada y guardada exitosamente` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al crear el nuevo ingreso y herramienta, intente nuevamente'});
    }
}

// Obtener ruta del archivo
const obtenerArchivo = async (req, res, next) => {

    const { id } = req.params;
    
    if( !id ) {
        res.status(404).json({ msg: 'Faltan parametros' });
        return next();
    }
    
    const ruta = await Cotizacion.scope('archivo').findOne({ where: { herramientumId: id } });

    return res.status(200).json(ruta);
}

export {
    nuevoIngresoHerramienta,
    ingresosFiltroTodos,
    ingresoInfo,
    editarInfo,
    subirArchivo,
    cotizacion,
    obtenerArchivo
}