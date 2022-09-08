import Usuario from "../models/Usuario.js";

// crea a un usuario nuevo
const crearUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const { nombre, rut, email, tipo, telefono } = req.body;

    if(!nombre || !rut || !email || !tipo || tipo < 0 || tipo > 3){
        res.json({msg: 'Faltan datos'});
        return next();
    }

    const rutLimpio = rut.split(".").join("").split("-").join("");

    const invertirRut = rutLimpio.split("").reverse().join("");

    const password = invertirRut + '@' + nombre.split(" ")[0];
    
    try {
        await Usuario.create({
            nombre,
            rut: parseInt(rutLimpio),
            password,
            telefono,
            email,
            tipo
        });

        res.json({ msg: `Usuario ${nombre} creado correctamente!`});
    } catch (error) {
        console.log(error);
        res.json({ msg: 'Error al crear el usuario, intente nuevamente'});
    }
}

// editar usuario
const editarUsuario = async (req, res, next) => {

    // TODO: revisar permisos

    const usuario = await Usuario.scope('eliminarPass').findByPk(req.params.id);

    if(!usuario){
        res.json({ msg: 'Usuario no existe'});
        return next();
    }

    res.json(usuario);
}

export{ 
    crearUsuario,
    editarUsuario
}