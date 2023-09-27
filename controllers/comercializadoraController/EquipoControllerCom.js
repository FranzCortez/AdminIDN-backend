import Sequelize from "sequelize"
const Op = Sequelize.Op;

import ClienteEmpresaCom from "../../models/comercializadora/ClienteEmpresaCom.js";
import EquipoCom from "../../models/comercializadora/EquipoCom.js";

const nuevoEquipo = async ( req, res ) => {

    const { nombre, marca, modelo, descripcion, stock, valor, clienteEmpresaComId } = req.body;

    try {
        
        const existe = await EquipoCom.findAll({ where: { nombre, clienteEmpresaComId } });
console.log(existe)
        if ( existe.length > 0 ) {
            return res.status(400).json({ msg: 'Error, ya existe este equipo de ese cliente' });
        } 

        await EquipoCom.create({
            nombre,
            marca,
            modelo,
            descripcion,
            stock,
            valor,
            clienteEmpresaComId
        });

        return res.status(200).json({ msg: 'Equipo ' + nombre + ' agregado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelve a intetar' });
    }

}

const editarEquipo = async ( req, res ) => {
    
    const { nombre, marca, modelo, descripcion, stock, valor, clienteEmpresaComId } = req.body;

    const { id } = req.params;

    try {
        
        const existe = await EquipoCom.findAll({ where: { id } });

        if ( existe ) {
            return res.status(400).json({ msg: 'Error, ya existe este equipo' });
        } 

        existe.nombre = nombre;
        existe.marca = marca;
        existe.modelo = modelo;
        existe.descripcion = descripcion;
        existe.stock = stock;
        existe.valor = valor;
        existe.clienteEmpresaComId = clienteEmpresaComId;

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
            model: ClienteEmpresaCom,
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

    const equipo = await EquipoCom.findByPk(id);

    res.status(200).json(equipo);
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
    buscarPorNombre
}