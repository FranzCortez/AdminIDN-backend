import TipoHerramienta from "../models/TipoHerramienta.js";
import Herramienta from "../models/Herramienta.js";
import Sequelize from "sequelize"
const Op = Sequelize.Op;

// agrega una nueva herramienta pero revisa que este nombre no este registrado ya en el sistema
const nuevoTipoHerramienta = async (req, res, next) => {

    const { nombre, descripcion, recomendacion } = req.body;

    if( !nombre ){
        res.status(400).json({msg: 'Todos los campos son necesarios'});
        return next();
    }    

    const existeHerramienta = await TipoHerramienta.findOne({ where: { nombre } });

    if(existeHerramienta){
        res.status(400).json({msg: `Herramienta de nombre: "${nombre}" ya esta registrada en el sistema`});
        return next();
    }

    await TipoHerramienta.create({
        nombre,
        descripcion,
        recomendacion
    });

    res.status(200).json({ msg: `Herramienta ${nombre} registrada exitosamente`});
}

// obtiene todos los tipos de herramienta, pero solo el nombre
const obtenerNombreTodosTipo = async (req, res, next) => {

    const nombresTipo = await TipoHerramienta.scope('soloNombre').findAll({
        order: [[ 'nombre', 'ASC' ]]
    });

    res.status(200).json(nombresTipo);

}

// obtiene toda la info de todos los tipos
const obtenerInfo = async (req, res, next) => {
    
    const tiposHerramienta = await TipoHerramienta.findAll({
        order: [[ 'nombre', 'ASC' ]]
    });
    
    if(!tiposHerramienta){
        return res.status(404).json({msg: "No existen tipos de herramientas en el sistema"});
    }

    return res.status(200).json(tiposHerramienta);
} 

// obtiene toda la informacion de 1 tipo de herramineta
const obtenerInformacionTipo = async (req, res, next) => {

    const { id } = req.params;

    if(!id){
        res.status(400).json({msg: `Error al encontrar`});
        return next();
    }

    const tipoHerramienta = await TipoHerramienta.findByPk(id);

    res.status(200).json(tipoHerramienta);
}

// actualizar datos de 1 tipo de herramienta
const actualizarTipoHerramienta = async (req, res, next) => {

    const { id } = req.params;

    const tipoHerramienta = await TipoHerramienta.findByPk(id);

    if(!tipoHerramienta){
        res.status(400).json({msg: `Herramienta no encontrada`});
        return next();
    }

    const { nombre, descripcion, recomendacion } = req.body;

    const existeHerramienta = await TipoHerramienta.findOne({ where: { nombre } });

    if(existeHerramienta){
        if(existeHerramienta.id != id){
            res.status(400).json({msg: `Ya existe una herramienta con el nombre: ${nombre}`});
            return next();
        }
    }

    tipoHerramienta.nombre = nombre;
    tipoHerramienta.descripcion = descripcion;
    tipoHerramienta.recomendacion = recomendacion;

    await tipoHerramienta.save();

    res.status(200).json({ msg: `Herramienta ${nombre} actualizada correctamente`});
}

// elimina un tipo de herramienta
const eliminarTipoHerramienta = async (req, res, next) => {

    const { id } = req.params;

    const eliminarHerramienta = await TipoHerramienta.destroy({ where: { id } });

    if(!eliminarHerramienta){
        res.status(404).json({msg: `No existe herramienta`});
        return next();
    }
    
    res.status(200).json({ msg: 'Herramienta eliminada correctamente'});
}

// busca por nombre de la herramienta
const buscarPorNombre = async (req, res, next) => {

    const nombreBuscar = req.params.nombre;

    if(nombreBuscar.length < 3) {
        res.status(404).json({ msg: 'Mínimo debe tener 3 letras para poder buscar'});
        return next();
    }

    const herramientas = await TipoHerramienta.findAll( { where: {nombre : { [Op.like] : '%'+ nombreBuscar +'%'} }});

    if(!herramientas) {
        res.status(404).json({ msg: 'No existe ningún tipo de herramienta con ese nombre'});
        return next();
    }
    
    res.status(200).json(herramientas);
}

// busca el tipo de herramienta por le id de un ingreso y regresa la falla
const fallaTipoHerramienta = async (req, res, next) => {
    
    const { id } = req.params;
    
    const herramienta = await Herramienta.findByPk( id );

    if ( !herramienta ) {
        res.status(404).json({ msg: 'No existe ingreso'});
        return next();
    }
    
    const fallaHerramienta = await TipoHerramienta.findByPk( herramienta.tipoHerramientaId );
    
    if ( !fallaHerramienta ) {
        res.status(404).json({ msg: 'No existe tipo herramienta'});
        return next();
    }

    return res.status(200).json(fallaHerramienta);
}

// actualiza la falla de un tipo de herramienta
const actulizarFalla = async ( req, res ) => {
    
    const { id } = req.params;

    const herramienta = await TipoHerramienta.findByPk( id );

    herramienta.descripcion = req.body.descripcion;

    await herramienta.save();

    return res.status(200);
}

// actualiza la recomendacion de un tipo de herramienta
const actulizarRecomendacion = async ( req, res ) => {

    const { id } = req.params;

    const herramienta = await TipoHerramienta.findByPk( id );

    herramienta.recomendacion = req.body.recomendacion;

    await herramienta.save();

    return res.status(200);
}

export {
    nuevoTipoHerramienta,
    obtenerNombreTodosTipo,
    obtenerInfo,
    obtenerInformacionTipo,
    actualizarTipoHerramienta,
    eliminarTipoHerramienta,
    buscarPorNombre,
    fallaTipoHerramienta,
    actulizarFalla,
    actulizarRecomendacion
}