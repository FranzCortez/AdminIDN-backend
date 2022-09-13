import TipoHerramienta from "../models/TipoHerramienta.js";

// agrega una nueva herramienta pero revisa que este nombre no este registrado ya en el sistema
const nuevoTipoHerramienta = async (req, res, next) => {

    const { nombre, descripcion } = req.body;

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
        descripcion
    });

    res.status(200).json({ msg: `Herramienta ${nombre} registrada exitosamente`});
}

// obtiene todos los tipos de herramienta, pero solo el nombre
const obtenerNombreTodosTipo = async (req, res, next) => {

    const nombresTipo = await TipoHerramienta.scope('soloNombre').findAll({});

    res.status(200).json(nombresTipo);

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

    const { nombre, descripcion } = req.body;

    const existeHerramienta = await TipoHerramienta.findOne({ where: { nombre } });

    if(existeHerramienta.id === id){
        res.status(400).json({msg: `Ya existe una herramienta con el nombre: ${nombre}`});
        return next();
    }

    tipoHerramienta.nombre = nombre;
    tipoHerramienta.descripcion = descripcion;

    await tipoHerramienta.save();

    res.status(200).json({ msg: `Herraemienta ${nombre} actualizada correctamente`});
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

export {
    nuevoTipoHerramienta,
    obtenerNombreTodosTipo,
    obtenerInformacionTipo,
    actualizarTipoHerramienta,
    eliminarTipoHerramienta
}