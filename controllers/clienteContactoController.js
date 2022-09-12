import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";

// agrega un nuevo contacto a la empresa
const crearClienteContacto = async (req, res, next) => {
    // TODO: Permisos

    const { idEmpresa: id } = req.params;

    if(!id) {
        res.status(400).json({msg: 'No existe la empresa'});
        return next();
    }    

    const empresaExiste = await ClienteEmpresa.findByPk(id);

    if(!empresaExiste){
        res.status(400).json({msg: 'No existe la empresa'});
        return next();
    }

    const {nombre, cargo, correo, telefono } = req.body;

    if(!nombre || !correo || !telefono){
        res.status(400).json({msg: 'Los campos de nombre, correo y teléfono son necesarios'});
        return next();
    }    

    try {

        const existeContacto = await ClienteContacto.findOne({ where: { correo, clienteEmpresaId: id, telefono }});

        if(existeContacto) {
            res.status(400).json({ msg: 'El contacto ya existente'});
            return next();
        }

        await ClienteContacto.create({
            nombre,
            telefono,
            correo,
            cargo,
            clienteEmpresaId: id
        });

        res.status(200).json({ msg: `Contacto ${nombre} creado correctamente!`});
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }
}


export {
    crearClienteContacto
}