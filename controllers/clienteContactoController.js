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

// obtener todos los contactos de una empresa especifica por id
const obtenerContactosPorEmpresa = async (req, res, next) => {

    const { idEmpresa: id } = req.params;

    const empresa = await ClienteEmpresa.findByPk(id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contactos = await ClienteContacto.findAll({ where: { clienteEmpresaId: id } });

    res.status(200).json(contactos);
}

const obtenerContactoEspecifico = async (req, res, next) => {

    const { idEmpresa, id } = req.params;

    const empresa = await ClienteEmpresa.findByPk(idEmpresa);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contacto = await ClienteContacto.findOne({ where: { clienteEmpresaId : idEmpresa, id} });

    res.status(200).json(contacto);
}

// actualizar la informacion de 1 usuario especifico
const actualizarContactoEmpresa = async (req, res, next) => {

    const { idEmpresa: id } = req.params;

    const empresa = await ClienteEmpresa.findByPk(id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contacto = await ClienteContacto.findOne({ where: { clienteEmpresaId: id, id: req.body.id } });

    if(!contacto){
        res.status(404).json({ msg: 'Contacto de la empresa no existe'});
        return next();
    }

    const {nombre, cargo, correo, telefono } = req.body;

    if(!nombre || !correo || !telefono){
        res.status(400).json({msg: 'Los campos de nombre, correo y teléfono son necesarios'});
        return next();
    }  
    
    contacto.cargo = cargo;
    contacto.nombre = nombre;
    contacto.correo = correo;
    contacto.telefono = telefono;
    
    await contacto.save();

    res.status(200).json({ msg: `Contacto ${nombre} fue actualizado correctamente` });    
}

// eliminar contacto de 1 empresa
const eliminarContactoEmpresa = async (req, res, next) => {

    const { idEmpresa, id } = req.params;

    const empresa = await ClienteEmpresa.findByPk(idEmpresa);
    
    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }
    
    const contactosEmpresa = await ClienteContacto.findAll({ where: { clienteEmpresaId: empresa.id } });

    if(contactosEmpresa.length === 1) {
        res.status(400).json({ msg: 'Debe haber por lo menos 1 contacto por empresa'});
        return next();
    }

    const contacto = await ClienteContacto.destroy({ where: { clienteEmpresaId: empresa.id, id: id } });

    if(!contacto){
        res.status(404).json({ msg: 'No existe ese contacto'});
        return next();
    }

    res.status(200).json({ msg: 'Contacto empresa ha sido eliminado correctamente'});
}

// obtiene toda la info de 1 contacto por id
const contactoInfo = async (req, res, next) => {

    const { id } = req.params;

    const contacto = await ClienteContacto.findByPk(id);

    return res.status(200).json(contacto);
}

export {
    crearClienteContacto,
    obtenerContactosPorEmpresa,
    obtenerContactoEspecifico,
    actualizarContactoEmpresa,
    eliminarContactoEmpresa,
    contactoInfo
}