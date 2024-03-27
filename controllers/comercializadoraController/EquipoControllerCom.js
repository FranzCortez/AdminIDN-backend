import TokenGenerator from "uuid-token-generator";
import Sequelize from "sequelize"
const Op = Sequelize.Op;

import EquipPadreCom from "../../models/comercializadora/EquipoPadreCom.js";
import EquipoCom from "../../models/comercializadora/EquipoCom.js";
import Proveedor from "../../models/comercializadora/ProveedorCom.js";

const nuevoEquipoPadre = async ( req, res ) => {
    
    const { nombre, descripcion } = req.body;

    try {

        const existe = await EquipPadreCom.findAll({ where: { nombre } });

        if ( existe.length > 0 ) {
            return res.status(400).json({ msg: 'Error, ya existe este insumo/equipo' });
        } 

        await EquipPadreCom.create({
            nombre,
            descripcion,
            token: new TokenGenerator(TokenGenerator.BASE16).generate()
        });
        
        return res.status(200).json({ msg: 'Insumo/Equipo ' + nombre + ' agregado correctamente' });

    } catch (error) {        
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });
    }
}

const actualizarEquipoPadre = async ( req, res ) => {
    
    const { id } = req.params;

    const { nombre, descripcion } = req.body;

    try {

        const existe = await EquipPadreCom.findByPk(id);

        if ( !existe ) {
            return res.status(400).json({ msg: 'Error, no existe este equipo' });
        } 

        existe.nombre = nombre;
        existe.descripcion = descripcion;

        await existe.save();

        return res.status(200).json({ msg: 'Insumo/Equipo ' + nombre + ' editado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });        
    }    

}

const obtenerEquiposPadres = async ( req, res ) => {

    const offset = (parseInt(req.params.pag) || 0) * 10;

    const equipo = await EquipPadreCom.findAll({ 
        offset: offset, 
        limit: 10,
        order: [[ 'nombre', 'ASC' ]]
    });

    const cantequipo = await EquipPadreCom.findAll();

    res.status(200).json({equipo, cantPag: Math.ceil(cantequipo.length / 10)});


}

const obtenerEquipoPadre = async ( req, res ) => {
    
    const { id } = req.params;

    try {
        
        const equipoPadre = await EquipPadreCom.findByPk(id);

        if ( !equipoPadre ) {
            res.status(400).json({msg: `Error al encontrar`});
            return next();
        }

        return res.status(200).json(equipoPadre);

    } catch (error) {        
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });       
    }
}

const obtenerNombrePadre = async (req, res) => {

    const { id } = req.params;

    const nombre = await EquipPadreCom.findByPk(id);

    return res.status(200).json({ nombre: nombre.nombre })

}

const nuevoEquipo = async ( req, res ) => {

    const { nombre, marca, modelo, descripcion, stock, valor, proveedorComId, equipoPadreComId, tipo, numeroSerie, codigo } = req.body;

    try {
        
        const existe = await EquipoCom.findAll({ where: { nombre, proveedorComId, equipoPadreComId } });
        
        if ( existe.length > 0 ) {
            return res.status(400).json({ msg: 'Error, ya existe este equipo de ese proveedor' });
        } 

        await EquipoCom.create({
            nombre,
            marca,
            modelo,
            descripcion,
            stock,
            valor,
            proveedorComId,
            equipoPadreComId,
            tipo,
            numeroSerie,
            codigo
        });

        return res.status(200).json({ msg: 'Equipo ' + nombre + ' agregado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });
    }

}

const obtenerUnEquipo = async ( req, res ) => {

    const { id } = req.params;

    const equipo = await EquipoCom.findByPk(id);

    return res.status(200).json(equipo);
}

const editarEquipo = async ( req, res ) => {
    
    const { nombre, marca, modelo, descripcion, stock, valor, proveedorComId, equipoPadreComId, tipo, numeroSerie, codigo } = req.body;

    const { id } = req.params;

    try {
        
        const existe = await EquipoCom.findByPk(id)

        if ( !existe ) {
            return res.status(400).json({ msg: 'Error, no existe este equipo' });
        } 

        existe.nombre = nombre;
        existe.marca = marca;
        existe.modelo = modelo;
        existe.descripcion = descripcion;
        existe.stock = stock;
        existe.valor = valor;
        existe.proveedorComId = proveedorComId;
        existe.equipoPadreComId = equipoPadreComId;
        existe.tipo = tipo;
        existe.numeroSerie = numeroSerie;
        existe.codigo = codigo;

        await existe.save();

        return res.status(200).json({ msg: 'Equipo ' + nombre + ' editado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });
    }
}

const obtenerNombreTodosEquipo = async (req, res, next) => {

    const nombresTipo = await EquipoCom.scope('soloNombre').findAll({
        order: [[ 'nombre', 'ASC' ]]
    });

    res.status(200).json(nombresTipo);

}

const obtenerInfo = async (req, res, next) => {
    
    const equipo = await EquipoCom.findAll({
        include: {
            model: Proveedor,
            attributes: ['id', 'nombre']
        },
        order: [[ 'nombre', 'ASC' ]]
    });
    
    if(!equipo){
        return res.status(404).json({msg: "No existen Equipos en el sistema"});
    }

    return res.status(200).json(equipo);
} 

const obtenerInformacionTipo = async (req, res, next) => {

    const { id } = req.params;

    if(!id){
        res.status(400).json({msg: `Error al encontrar`});
        return next();
    }

    const offset = (parseInt(req.params.offset) || 0) * 10;

    const equipo = await EquipoCom.findAll({ 
        where: {
            equipoPadreComId: id
        },
        include: [
            {
                model: Proveedor,
                attributes: ['id', 'nombre']
            },
            {
                model: EquipPadreCom,
                attributes: ['nombre']
            }
        ],
        offset: offset, 
        limit: 10,
        
        order: [[ 'nombre', 'ASC' ]]
    });
    
    const cantequipo = await EquipoCom.findAll({where: {
        equipoPadreComId: id
    }});

    return res.status(200).json({equipo, cantPag: Math.ceil(cantequipo.length / 10)});
}

const eliminarEquipo = async (req, res, next) => {

    const { id } = req.params;

    const eliminarEquipo = await EquipoCom.destroy({ where: { id } });

    if(!eliminarEquipo){
        res.status(404).json({msg: `No existe equipo`});
        return next();
    }
    
    res.status(200).json({ msg: 'equipo eliminado correctamente'});
}

const buscarPorNombre = async (req, res, next) => {

    const nombreBuscar = req.params.nombre;

    if(nombreBuscar.length < 3) {
        res.status(404).json({ msg: 'Mínimo debe tener 3 letras para poder buscar'});
        return next();
    }

    const equipo = await EquipoCom.findAll( { where: {nombre : { [Op.like] : '%'+ nombreBuscar +'%'} }});

    if(!equipo) {
        res.status(404).json({ msg: 'No existe ningún equipo con ese nombre'});
        return next();
    }
    
    res.status(200).json(equipo);
}


export {
    nuevoEquipo,
    editarEquipo,
    obtenerNombreTodosEquipo, 
    obtenerInfo,
    obtenerInformacionTipo,
    eliminarEquipo,
    buscarPorNombre,
    nuevoEquipoPadre,
    actualizarEquipoPadre,
    obtenerEquiposPadres,
    obtenerEquipoPadre,
    obtenerNombrePadre,
    obtenerUnEquipo
}