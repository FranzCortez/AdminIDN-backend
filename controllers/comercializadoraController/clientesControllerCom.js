import Sequelize from "sequelize"
const Op = Sequelize.Op;

import ClienteContactoCom from "../../models/comercializadora/ClienteContactoCom.js";
import ClienteEmpresaCom from "../../models/comercializadora/ClienteEmpresaCom.js";

import ClienteEmpresa from "../../models/ClienteEmpresa.js";
import ClienteContacto from "../../models/ClienteContacto.js";

const buscarEmpresaExiste = async ( req, res ) => {

    const { rut, razonSocial, nombre } = req.body;

    try {
        
        if ( nombre ) {

            const empresaExiste = await ClienteEmpresa.findOne({ where: { nombre: { [Op.like] : '%'+ nombre +'%'} } });

            if ( empresaExiste ) {

                return res.status(200).json(empresaExiste);

            }

        } 
        
        if ( rut ) {

            const empresaExiste = await ClienteEmpresa.findOne({ where: { rut } });

            if ( empresaExiste ) {
                return res.status(200).json(empresaExiste);
            }

        }

        if ( razonSocial ) {
            const empresaExiste = await ClienteEmpresa.findOne({ where: { razonSocial: { [Op.like] : '%'+ razonSocial +'%'} } });

            if ( empresaExiste ) {

                return res.status(200).json(empresaExiste);

            }
        }

        return res.status(200).json({})

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }

}

const nuevoClienteEmpresaCom = async ( req, res ) => {

    const { rut, razonSocial, nombre, direccion } = req.body;

    if(!nombre || !razonSocial || !rut || !direccion){
        res.status(400).json({msg: 'Todos los campos son necesarios'});
        return next();
    } 

    const rutLimpio = rut.split(".").join("").split("-").join("");

    try {
        
        const empresaExiste = await ClienteEmpresaCom.findOne({ where: { rut: rutLimpio } });

        if(empresaExiste) {
            res.status(400).json({ msg: 'Empresa ya existente'});
            return next();
        }

        const empresa = await ClienteEmpresaCom.create({
            nombre,
            rut: rutLimpio,
            razonSocial,
            direccion
        });

        res.status(200).json({ msg: `Cliente ${nombre} creada correctamente!`, id: empresa.dataValues.id});

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }

}

const todosClienteEmpresaCom = async ( req, res ) => {

    const offset = (parseInt(req.params.pag) || 0) * 10;

    const empresas = await ClienteEmpresaCom.findAll({ 
        where: { activo: 1 },
        offset: offset, 
        limit: 10,
        order: [[ 'nombre', 'ASC' ]]
    });

    const cantEmpresas = await ClienteEmpresaCom.findAll({where: { activo: 1 }});

    res.status(200).json({empresas, cantPag: Math.ceil(cantEmpresas.length / 10)});

}

const encontrarClienteEmpresaCom = async (req, res, next) => {

    const empresa = await ClienteEmpresaCom.findByPk(req.params.id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    res.status(200).json(empresa);
}

const actualizarClienteEmpresaCom = async (req, res, next) => {

    const empresa = await ClienteEmpresaCom.findByPk(req.params.id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const { nombre: nombreEmpresa, razonSocial, rut, direccion } = req.body;
    
    if(!nombreEmpresa || !razonSocial || !rut || !direccion){
        res.status(400).json({msg: 'Todos los campos son necesarios'});
        return next();
    }

    empresa.nombre = nombreEmpresa;
    empresa.rut = rut.split(".").join("").split("-").join("");
    empresa.razonSocial = razonSocial;
    empresa.direccion = direccion;

    await empresa.save();

    res.status(200).json({msg: `${nombreEmpresa} fue actualizado correctamente!`});
}

const eliminarClienteEmpresaCom = async (req, res) => {

    // const clientesContactoEmpresa = await ClienteContacto.findAll({ where: { clienteEmpresaComId: req.params.id }});

    // clientesContactoEmpresa.forEach( async (contacto) => {
    //     await ClienteContacto.destroy({ where: {id: contacto.id}});
    // });

    const empresa = await ClienteEmpresaCom.findOne({ where: {id: req.params.id}});

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }
    
    empresa.activo = 0;
    await empresa.save();

    res.status(200).json({ msg: 'Empresa Eliminada Correctamente'});

}

const buscarPorNombreCom = async (req, res, next) => {

    const nombreBuscar = req.params.nombre;

    if(nombreBuscar.length < 3) {
        res.status(404).json({ msg: 'Mínimo debe tener 3 letras para poder buscar'});
        return next();
    }

    const empresa = await ClienteEmpresaCom.findAll( { where: {nombre : { [Op.like] : '%'+ nombreBuscar +'%'} }});

    if(!empresa) {
        res.status(404).json({ msg: 'No existe ningún usuario con ese nombre'});
        return next();
    }

    res.status(200).json(empresa);
}

const todosNombresCom = async (req, res) => {
    const empresas = await ClienteEmpresaCom.scope('nombre').findAll({
        where: { activo: 1 },
        order: [[ 'nombre', 'ASC' ]]
    });

    return res.status(200).json(empresas)
}

// contacto

const buscarContactoExiste = async ( req, res ) => {

    const { correo, telefono, nombre } = req.body;

    try {
        
        if ( nombre ) {

            const contactoExiste = await ClienteContacto.findOne({ where: { nombre: { [Op.like] : '%'+ nombre +'%'} } });

            if ( contactoExiste ) {

                return res.status(200).json(contactoExiste);

            }

        } 
        
        if ( telefono ) {

            const contactoExiste = await ClienteContacto.findOne({ where: { telefono } });

            if ( contactoExiste ) {
                return res.status(200).json(contactoExiste);
            }

        }

        if ( correo ) {
            const contactoExiste = await ClienteContacto.findOne({ where: { correo: { [Op.like] : '%'+ correo +'%'} } });

            if ( contactoExiste ) {

                return res.status(200).json(contactoExiste);

            }
        }

        return res.status(200).json({})

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }

}

const crearClienteContactoCom = async (req, res, next) => {

    const { idEmpresa: id } = req.params;

    if(!id) {
        res.status(400).json({msg: 'No existe la empresa'});
        return next();
    }    

    const empresaExiste = await ClienteEmpresaCom.findByPk(id);

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

        const existeContacto = await ClienteContactoCom.findOne({ where: { correo, clienteEmpresaComId: id, telefono }});

        if(existeContacto) {
            res.status(400).json({ msg: 'El contacto ya existente'});
            return next();
        }

        await ClienteContactoCom.create({
            nombre,
            telefono,
            correo,
            cargo,
            clienteEmpresaComId: id
        });

        res.status(200).json({ msg: `Contacto ${nombre} creado correctamente!`});
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }
}

// obtener todos los contactos de una empresa especifica por id
const obtenerContactosPorEmpresaCom = async (req, res, next) => {

    const { idEmpresa: id } = req.params;

    const empresa = await ClienteEmpresaCom.findByPk(id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contactos = await ClienteContactoCom.findAll({ where: { clienteEmpresaComId: id, activo: 1 } });

    res.status(200).json(contactos);
}

const obtenerContactoEspecificoCom = async (req, res, next) => {

    const { idEmpresa, id } = req.params;

    const empresa = await ClienteEmpresaCom.findByPk(idEmpresa);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contacto = await ClienteContactoCom.findOne({ where: { clienteEmpresaComId : idEmpresa, id} });

    res.status(200).json(contacto);
}

const actualizarContactoEmpresaCom = async (req, res, next) => {

    const { idEmpresa: id } = req.params;

    const empresa = await ClienteEmpresaCom.findByPk(id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    const contacto = await ClienteContactoCom.findOne({ where: { clienteEmpresaComId: id, id: req.body.id } });

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
const eliminarContactoEmpresaCom = async (req, res, next) => {

    const { idEmpresa, id } = req.params;

    const empresa = await ClienteEmpresaCom.findByPk(idEmpresa);
    
    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }
    
    const contacto = await ClienteContactoCom.findOne({ where: { clienteEmpresaComId: empresa.id, id: id } });

    if(!contacto){
        res.status(404).json({ msg: 'No existe ese contacto'});
        return next();
    }

    contacto.activo = 0;

    await contacto.save();

    res.status(200).json({ msg: 'Contacto empresa ha sido eliminado correctamente'});
}

// obtiene toda la info de 1 contacto por id
const contactoInfoCom = async (req, res, next) => {

    const { id } = req.params;

    const contacto = await ClienteContactoCom.findByPk(id);

    return res.status(200).json(contacto);
}

const getClientesSelect = async ( req, res ) => {

    try {
        
        const clientes = await ClienteEmpresaCom.findAll({ where: { activo: 1 }, order: [[ 'nombre', 'ASC' ]] });

        const data = [];

        for (const cliente of clientes) {
            data.push({ value: cliente.id, text: cliente.nombre })
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: 'Error al traer los clientes' });
    }

}

const getClienteContactosSelect = async ( req, res ) => {

    try {
        
        const { id } = req.params;

        const clientes = await ClienteContactoCom.findAll({ where: { activo: 1, clienteEmpresaComId: id }, order: [[ 'nombre', 'ASC' ]] });

        const data = [];

        for (const cliente of clientes) {
            data.push({ value: cliente.id, text: cliente.nombre })
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: 'Error al traer los clientes contacto' });
    }

}

export {
    nuevoClienteEmpresaCom,
    buscarEmpresaExiste,
    todosClienteEmpresaCom,
    encontrarClienteEmpresaCom,
    actualizarClienteEmpresaCom,
    eliminarClienteEmpresaCom,
    buscarPorNombreCom,
    todosNombresCom,
    buscarContactoExiste,
    crearClienteContactoCom,
    obtenerContactosPorEmpresaCom,
    obtenerContactoEspecificoCom,
    actualizarContactoEmpresaCom,
    eliminarContactoEmpresaCom,
    contactoInfoCom,
    getClientesSelect,
    getClienteContactosSelect
}