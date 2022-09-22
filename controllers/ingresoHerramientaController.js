import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

// crea un nuevo ingreso y herramienta
const nuevoIngresoHerramienta = async (req, res, next) => {
    
    const { descripcion, nombre, marca, comentario, modelo, numeroInterno, numeroGuiaCliente, guiaDespacho, fechaGuiaDespacho, tipoHerramientaId, clienteContactoId, fecha, numeroSerie } = req.body;

    if( !descripcion, !nombre, !marca, !modelo ) {
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
            descripcion,
            nombre,
            marca,
            comentario,
            modelo,
            fecha,
            numeroInterno,
            numeroGuiaCliente,
            numeroSerie,
            guiaDespacho,
            fechaGuiaDespacho, 
            tipoHerramientumId: tipoHerramientaId, 
            clienteContactoId
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
    
    const { fecha, otin, nombre, marca, modelo, numeroInterno, numeroSerie, empresaId, tipoHerramientaId } = req.body;

    let where = {}
    let include = [];

    if( fecha !== '' && fecha ) {
        where.fecha = {
            [Op.eq] : fecha
        }
    }
    
    if( otin !== '' && otin ) {
        where.otin = {
            [Op.eq] : otin
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

    if( tipoHerramientaId !== '' && tipoHerramientaId ) {
        where.tipoHerramientumId = {
            [Op.eq] : tipoHerramientaId
        }
    }

    if( numeroInterno !== '' && numeroInterno ) {
        where.numeroInterno = {
            [Op.eq] : numeroInterno
        }
    }

    if( empresaId !== '' && empresaId ) {
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

    const ingreso = await Herramienta.findByPk( id );

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

    const { descripcion, nombre, marca, comentario, modelo, numeroInterno, numeroGuiaCliente, guiaDespacho, fechaGuiaDespacho, tipoHerramientaId, clienteContactoId, fecha, numeroSerie } = req.body;

    ingreso.descripcion = descripcion;
    ingreso.nombre = nombre;
    ingreso.marca = marca;
    ingreso.comentario = comentario;
    ingreso.modelo = modelo;
    ingreso.numeroInterno = numeroInterno;
    ingreso.numeroGuiaCliente = numeroGuiaCliente;
    ingreso.guiaDespacho = guiaDespacho;
    ingreso.fechaGuiaDespacho = fechaGuiaDespacho;
    ingreso.tipoHerramientaId = tipoHerramientaId;
    ingreso.clienteContactoId = clienteContactoId;
    ingreso.fecha = fecha;
    ingreso.numeroSerie = numeroSerie;

    await ingreso.save();

    return res.status(200).json(`Herramineta e Ingreso de: ${ingreso.nombre}, actualizado correctamente`);
}

export {
    nuevoIngresoHerramienta,
    ingresosFiltroTodos,
    ingresoInfo,
    editarInfo
}