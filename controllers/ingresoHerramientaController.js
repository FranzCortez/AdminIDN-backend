import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

// crea un nuevo ingreso y herramienta
const nuevoIngresoHerramienta = async (req, res, next) => {
    
    const { otin, descripcion, nombre, marca, comentario, modelo, numeroInterno, numeroGuiaCliente, guiaDespacho, fechaGuiaDespacho, tipoHerramientaId, clienteContactoId, fecha, numeroSerie } = req.body;

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
            fecha,
            numeroInterno,
            numeroGuiaCliente,
            numeroSerie,
            guiaDespacho,
            fechaGuiaDespacho, 
            tipoHerramientumId: tipoHerramientaId, 
            clienteContactoId
        });
    
        return res.status(200).json({ msg: 'Ingreso y herramienta creados correctamente' });

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

    if( fecha !== '' ) {
        where.fecha = {
            [Op.eq] : fecha
        }
    }
    
    if( otin !== '') {
        where.otin = {
            [Op.eq] : otin
        }
    }

    if( nombre !== '' ) {
        where.nombre = {
            [Op.like] : '%' + nombre + '%'
        }
    }

    if( numeroSerie !== '' ) {
        where.numeroSerie = {
            [Op.like] : '%' + numeroSerie + '%'
        }
    }

    if( marca !== '' ) {
        where.marca = {
            [Op.like] : '%' + marca + '%'
        }
    }

    if( modelo !== '' ) {
        where.modelo = {
            [Op.like] : '%' + modelo + '%'
        }
    }

    if( tipoHerramientaId !== '' ) {
        where.tipoHerramientumId = {
            [Op.eq] : tipoHerramientaId
        }
    }

    if( numeroInterno !== '' ) {
        where.numeroInterno = {
            [Op.eq] : numeroInterno
        }
    }

    if( empresaId !== '' ) {
        include.push({
            model: ClienteContacto,
            where: {
                clienteEmpresaId: empresaId
            }
        });
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

export {
    nuevoIngresoHerramienta,
    ingresosFiltroTodos,
    ingresoInfo
}