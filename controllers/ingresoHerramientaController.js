import { actualizarEstado } from "./facturaController.js";
import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";
import TipoHerramienta from "../models/TipoHerramienta.js";
import Preinforme from "../models/Preinforme.js";
import Factura from "../models/Factura.js";
import Archivos from "../models/Archivos.js";
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
        console.log(file.originalname);
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

// obtener otin
const obtenerOtin = async ( req, res ) => {
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

        return res.status(200).json(otin);

    } catch (error) {
        return res.status(404).json({ msg: 'Error al tomar una OTIN' });
    }
}

// crea un nuevo ingreso y herramienta
const nuevoIngresoHerramienta = async (req, res, next) => {
    
    const { nombre, marca, comentario, modelo, numeroInterno, numeroGuiaCliente, tipoHerramientaId, clienteContactoId, fecha, numeroSerie, guiaDespacho, fechaGuiaDespacho, otin, usuario, usuarioId } = req.body;

    if( !nombre, !marca, !modelo ) {
        res.status(400).json({ msg: 'Todos los campos son necesarios'});
        return next();
    }

    try {

        const herramienta = await Herramienta.create({
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
            clienteContactoId,
            guiaDespacho,
            fechaGuiaDespacho,
            usuario,
            usuarioId
        });

        const dir = `./public/${otin}`
        fs.mkdir(dir, (err) => {
            if (err) {
                throw err;
            }
        });
    
        return res.status(200).json({ msg: `Ingreso y herramienta: ${nombre} creada correctamente con otin: ${otin}`, herramientumId: tipoHerramientaId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al crear el nuevo ingreso y herramienta, intente nuevamente'});
    }
    
} 

// obtener todos los ingresos ordenados segun del mas nuevo al mas antiguo y por si estana activos o no
// filtro por otin(text), nombre(text), marca(text), modelo(text), numero interno(text), fecha ingreso(selected), nombre cliente(selected), numero serie(text), tipo herramienta(selected)
const ingresosFiltroTodos = async (req, res, next) => {
    
    //await eliminarDuplicado();

    const { fecha, otin, nombre, marca, modelo, numeroInterno, numeroSerie, empresaId, tipoHerramientaId, activo } = req.body;
    
    const { id } = req.params;

    const offset = (parseInt(req.params.offset) || 0) * 20;

    let where = {}
    let include = [];
    if ( id != 0 ) {
        where.usuarioId = {
            id : id
        }
    }

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
        where.tipoHerramientaId = {
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

    await actualizarEstado();

    include.push({
        model: Factura,
        attributes: ['fechaFactura', 'estado', 'numeroFactura']
    });

    const herramientas = await Herramienta.scope('filtro').findAll({ 
        where,
        offset,
        limit: 20,
        include,
        order: [['otin', 'DESC']]
    });

    const idHerramienta = herramientas.map(herramienta => herramienta.id);

    const preinforme = await Preinforme.findAll({
        where: {
            herramientumId: {
                [Op.in]: idHerramienta
            }
        }
    });

    const cant = await Herramienta.scope('filtro').findAll({where});

    const archivos = await Archivos.scope('cotizacion').findAll();
    
    const herramientaFiltro = herramientas.map( herramienta =>{

        const existePreinforme = preinforme.find(preinfo => preinfo.herramientumId == herramienta.id);

        const existe = archivos.find(archivo => archivo.herramientumId === herramienta.id && archivo.rutaCotizacion !== null);
        // guardar referencia y referencia null
        if(existe) {
            herramienta.dataValues.archivo = true;
        } else {
            herramienta.dataValues.archivo = false;
        }

        if ( existePreinforme ) {
            herramienta.dataValues.preinforme = true;
        } else {
            herramienta.dataValues.preinforme = false;
        }

        return herramienta;
    });
    
    return res.status(200).json({herramientaFiltro, cantPag: Math.ceil(cant.length / 20)});

}

// obtiene ingreso segun empresa id
const ingresoIdEmpresa = async ( req, res ) => {

    const { empresaId } = req.body;

    const include = [];

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

    await actualizarEstado();

    const herramientas = await Herramienta.scope('filtro').findAll({ 
        include,
        order: [['otin', 'ASC']]
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

    if ( req.tipo === 1 ) {
        return res.status(200).json({ ingreso , mantencion: req.mantencion, proxima: req.proxima});
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

    const { comentario, nombre, marca, modelo, numeroInterno, numeroGuiaCliente, tipoHerramientaId, clienteContactoId, fecha, numeroSerie, guiaDespacho, fechaGuiaDespacho, otin } = req.body;

    ingreso.otin = otin;
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
    ingreso.guiaDespacho = guiaDespacho;
    ingreso.fechaGuiaDespacho = fechaGuiaDespacho;

    await ingreso.save();

    return res.status(200).json(`Herramineta e Ingreso de: ${ingreso.nombre}, actualizado correctamente`);
}

const eliminarDuplicado = async ( req, res ) => {

    const ingresos = await Herramienta.scope('otin').findAll({});

    const duplicado = [];
    const otines = [];

    ingresos.forEach(ingreso => {
        
        const existe = ingresos.find( data => ingreso.otin === data.otin && ingreso.id !== data.id );
        
        if ( existe ) {
            const repetido = otines.find( otin => otin.otin === existe.otin );

            if ( !repetido ) {
                duplicado.push(existe.id);
                otines.push(existe);
            }
        }
    });

    await Herramienta.destroy({ where: { id: duplicado } });

}

// guarda una la ruta del archivo en la base de datos
const cotizacion = async (req, res, next) => {

    const data = JSON.parse(req.body.data);

    const { otin, herramientumId } = data;

    if( !otin ) {
        return res.status(404).json({ msg: "Faltan campos importantes" });
    }

    try {

        const archivos = await Archivos.findOne({ where: { herramientumId } });

        if ( archivos ) {

            archivos.rutaCotizacion = `/${otin}/cotizacion ${otin}.pdf`;

            await archivos.save();

        } else {
            
            await Archivos.create({
                herramientumId,
                rutaCotizacion: `/${otin}/cotizacion ${otin}.pdf`
            });
        }
    
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
    
    const ruta = await Archivos.scope('cotizacion').findOne({ where: { herramientumId: id } });

    return res.status(200).json(ruta);
}

// guardar preinforme
const guardarPreinforme = async (req, res) => {

    const { tecnico, falla, herramientumId } = req.body;
    
    if ( !tecnico || !herramientumId ){
        return res.status(404).json({ msg: 'Error al guardar Preinforme' });
    }
    await Preinforme.create({
        falla,
        tecnico,
        herramientumId
    });

    return res.status(200).json({ msg: 'Preinforme guardado' });

}

// obtener preinforme
const obtenerPreinforme = async (req, res) => {

    const { id } = req.params;
    
    if ( !id ) {
        return res.status(404).json({ msg: 'Error no existe preinforme' });
    }

    const preinforme = await Preinforme.findOne({ where: { herramientumId: id } });

    return res.status(200).json(preinforme);
}

// obtener falla
const obtenerFallaPreinforme = async (req, res) => {

    const { id } = req.params;

    if ( !id ) {
        return res.status(404).json({ msg: 'Error' });
    }

    const preinforme = await Preinforme.scope('falla').findOne({ where: { herramientumId: id } });
    

    return res.status(200).json(preinforme);
}

// obtener tecnico
const obtenerTecnicoPreinforme = async (req, res) => {

    const { id } = req.params;

    if ( !id ) {
        return res.status(404).json({ msg: 'Error' });
    }

    const preinforme = await Preinforme.scope('tecnico').findOne({ where: { herramientumId: id } });
    

    return res.status(200).json(preinforme);
}

// actualizar preinforme
const actualizarPreinforme = async (req, res) => {

    const { id } = req.params;

    if ( !id ) {
        return res.status(404).json({ msg: 'Error' });
    }

    const { falla, tecnico } = req.body;

    const preinforme = await Preinforme.findOne({ where: { herramientumId: id } });

    if ( !preinforme ) {

        await Preinforme.create({
            falla,
            tecnico,
            herramientumId: id
        });

        return res.status(200).json({ msg: 'Cambio realizado' });
    }


    preinforme.falla = falla != preinforme?.falla ? falla : preinforme.falla;
    preinforme.tecnico = tecnico != preinforme?.tecnico ? tecnico : preinforme.tecnico;

    await preinforme.save();

    return res.status(200).json({ msg: 'Cambio realizado' });
}

// obtener ingresos de herramienta por mes
const obtenerIngresoMes = async (req, res) => {

    try {

        const { mes, año } = req.body;

        const ingresos = await Herramienta.findAll({ 
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fecha')), mes),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha')), año),
                ],
            },
            attributes: ['id', 'otin', 'nombre', 'fecha'],
            include: {
                model: ClienteContacto,
                attributes: ['nombre', 'clienteEmpresaId'],
                include: {
                    model: ClienteEmpresa,                    
                    attributes: ['id', 'nombre']
                }
            }
        });
        
        return res.status(200).json(ingresos);

    } catch (error) {
        console.log(error);
        return res.status(404).json({msg: 'Error al obtener ingresos por mes'});
    }

}

const obtenerOtinManual = async (req, res) => {
    try {
        
        const { otin } = req.body;

        const otinManual = await Herramienta.findOne( { where: { otin } } );

        return res.status(200).json(otinManual);

    } catch (error) {
        console.log(error);
        return res.status(404).json({msg: 'Error al obtener OTIN'});
    }
}

const obtenerOtinTarjeta = async (req, res) => {
    try {
        
        const { otin } = req.body;

        const info = await Herramienta.findOne({ 
            attributes: ['fecha', 'otin', 'modelo', 'marca', 'numeroSerie', 'numeroInterno', 'id'],
            where: { otin },
            include: [
                {
                    model: TipoHerramienta,
                    attributes: ['nombre']
                },
                {
                    model: ClienteContacto,
                    attributes: ['nombre'],
                    include: {
                        model: ClienteEmpresa,
                        attributes: ['nombre']
                    }
                }
            ]
        });

        const preinforme = await Preinforme.scope('tecnico').findOne({ where: { herramientumId: info.id } });

        return res.status(200).json({
            ...info.dataValues,
            tecnico: preinforme?.tecnico ?? ''
        });

    } catch (error) {
        console.error(error);
        return res.status(404).json({msg: 'Error al obtener OTIN'});
    }
}

const infoChecklist = async (req, res) => {
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
                attributes: ['nombre'],
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

    const preinforme = await Preinforme.scope('tecnico').findOne({ where: { herramientumId: ingreso.id } });

    return res.status(200).json({
        otin: ingreso.otin,
        tecnico: preinforme?.tecnico ?? '',
        cliente: ingreso.clienteContacto.nombre,
        tipoHerramienta: ingreso.tipoHerramientum.nombre,
        marca: ingreso.marca,
        modelo: ingreso.modelo,
        numeroInterno: ingreso.numeroInterno,
        numeroSerie: ingreso.numeroSerie,
    });
}

const guardarChechlistSalida = async (req, res) => {

    const { id } = req.params;

    const ingreso = await Herramienta.findOne({ where: { id } });

    ingreso.archivoSalida = `/${ingreso.otin}/salida_OTIN ${ingreso.otin}.pdf`; 
    await ingreso.save();

    return res.status(200).json({ msg: 'Informe generado y guardado con exito.' });
}

export {
    obtenerOtin,
    nuevoIngresoHerramienta,
    ingresosFiltroTodos,
    ingresoInfo,
    editarInfo,
    subirArchivo,
    cotizacion,
    obtenerArchivo,
    ingresoIdEmpresa,
    guardarPreinforme,
    obtenerPreinforme,
    obtenerFallaPreinforme,
    obtenerTecnicoPreinforme,
    actualizarPreinforme,
    obtenerIngresoMes,
    obtenerOtinManual,
    obtenerOtinTarjeta,
    infoChecklist,
    guardarChechlistSalida
}