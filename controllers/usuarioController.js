import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Sequelize from "sequelize"
const Op = Sequelize.Op;

// crea a un usuario nuevo
const crearUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const { nombre, rut, email, tipo, telefono } = req.body;

    if(!nombre || !rut || !email || !tipo || tipo < 0 || tipo > 3){
        res.status(404).json({msg: 'Faltan datos'});
        return next();
    }

    const rutLimpio = rut.split(".").join("").split("-").join("");

    const invertirRut = rutLimpio.split("").reverse().join("");

    const password = invertirRut + '@' + nombre.split(" ")[0];
    
    try {

        const validarUsuario = await Usuario.findOne({ where: {rut : rutLimpio} });

        if(validarUsuario){
            res.status(501).json({msg: 'Ese usuario ya existe en el sistema'});
            return next();
        }

        await Usuario.create({
            nombre,
            rut: rutLimpio,
            password,
            telefono,
            email,
            tipo
        });

        res.status(200).json({ msg: `Usuario ${nombre} creado correctamente!`});
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'Error al crear el usuario, intente nuevamente'});
    }
}

// obtener todos los usuarios
const todosUsuarios = async (req, res, next) => {
    // TODO: revisar permisos

    const offset = (parseInt(req.params.pag) || 0) * 10;

    const usuarios = await Usuario.scope('eliminarPass').findAll({ offset: offset, limit: 10});

    const cantUsuarios = await Usuario.scope('eliminarPass').findAll({});

    res.json({usuarios, cantPag: Math.ceil(cantUsuarios.length / 10)});
}

// obtener usuario por ID
const encontrarUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const usuario = await Usuario.scope('eliminarPass').findByPk(req.params.id);

    if(!usuario){
        res.status(404).json({ msg: 'Usuario no existe'});
        return next();
    }

    res.json(usuario);
}

// Edita a un usuario
const editarUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const { nombre, rut, email, tipo, telefono } = req.body; 

    if(!nombre || !rut || !email || !tipo || tipo < 0 || tipo > 3){
        res.status(501).json({msg: 'Todos los campos son necesarios'});
        return next();
    }

    const usuario = await Usuario.scope('eliminarPass').findByPk(req.params.id);

    if(!usuario){
        res.status(404).json({ msg: 'Usuario no existe'});
        return next();
    }

    const rutLimpio = rut.split(".").join("").split("-").join("");

    if(usuario.nombre != nombre || usuario.rut != rut){

        const invertirRut = rutLimpio.split("").reverse().join("");

        const password = invertirRut + '@' + nombre.split(" ")[0];

        const salt = await bcrypt.genSalt(12);
        usuario.password = await bcrypt.hash( password, salt );
    }

    usuario.nombre = nombre;
    usuario.rut = parseInt(rutLimpio);
    usuario.email = email;
    usuario.tipo = tipo;
    usuario.telefono = telefono;

    await usuario.save();

    res.status(200).json({msg: `Usuario ${nombre} fue actualizado correctamente!`});
}

// eliminar usuario
const eliminarUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const usuario = await Usuario.destroy({ where: {id: req.params.id}});

    if(!usuario){
        res.status(404).json({ msg: 'Usuario no existe'});
        return next();
    }

    res.status(200).json({ msg: 'Usuario Eliminado Correctamente'});
}

const buscarPorNombre = async (req, res, next) => {

    const nombreBuscar = req.params.nombre;

    if(nombreBuscar.length < 3) {
        res.status(404).json({ msg: 'Mínimo debe tener 3 letras para poder buscar'});
        return next();
    }

    const usuarios = await Usuario.scope('eliminarPass').findAll( { where: {nombre : { [Op.like] : '%'+ nombreBuscar +'%'} }});

    if(!usuarios) {
        res.status(404).json({ msg: 'No existe ningún usuario con ese nombre'});
        return next();
    }

    res.status(200).json(usuarios);
}

export{ 
    crearUsuario,
    todosUsuarios,
    encontrarUsuario,
    editarUsuario,
    eliminarUsuario,
    buscarPorNombre
}