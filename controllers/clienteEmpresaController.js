import ClienteEmpresa from "../models/ClienteEmpresa.js";
import ClienteContacto from "../models/ClienteContacto.js";
import Sequelize from "sequelize"
const Op = Sequelize.Op;

// agrega un nuevo cliente empresa y retorna la id
const nuevoClienteEmpresa = async (req, res, next) => {

    // TODO: Permisos

    const {nombre: nombreEmpresa, razonSocial, rut, direccion } = req.body;

    if(!nombreEmpresa || !razonSocial || !rut || !direccion){
        res.status(400).json({msg: 'Todos los campos son necesarios'});
        return next();
    }    

    const rutLimpio = rut.split(".").join("").split("-").join("");

    try {

        const empreaExiste = await ClienteEmpresa.findOne({ where: { rut: rutLimpio } });

        if(empreaExiste) {
            res.status(400).json({ msg: 'Empresa ya existente'});
            return next();
        }

        const empresa = await ClienteEmpresa.create({
            nombre: nombreEmpresa,
            rut: rutLimpio,
            razonSocial,
            direccion
        });

        res.status(200).json({ msg: `Cliente ${nombreEmpresa} creada correctamente!`, id: empresa.dataValues.id});
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }
}

// obtiene todas las empresas
const todosClienteEmpresa = async (req, res) => {

    const offset = (parseInt(req.params.pag) || 0) * 10;

    const empresas = await ClienteEmpresa.findAll({ 
        where: { activo: 1 },
        offset: offset, 
        limit: 10,
        order: [[ 'nombre', 'ASC' ]]
    });

    const cantEmpresas = await ClienteEmpresa.findAll({where: { activo: 1 }});

    res.status(200).json({empresas, cantPag: Math.ceil(cantEmpresas.length / 10)});
}

// obtiene una empresa por el  ID
const encontrarClienteEmpresa = async (req, res, next) => {

    // TODO: revisar permisos

    const empresa = await ClienteEmpresa.findByPk(req.params.id);

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    res.status(200).json(empresa);
}

// actualiza datos de una empresa por id
const actualizarClienteEmpresa = async (req, res, next) => {

    const empresa = await ClienteEmpresa.findByPk(req.params.id);

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

// elimina un cliente empresa por ID
const eliminarClienteEmpresa = async (req, res) => {

    // const clientesContactoEmpresa = await ClienteContacto.findAll({ where: { clienteEmpresaId: req.params.id }});

    // clientesContactoEmpresa.forEach( async (contacto) => {
    //     await ClienteContacto.destroy({ where: {id: contacto.id}});
    // });

    const empresa = await ClienteEmpresa.findOne({ where: {id: req.params.id}});

    if(!empresa){
        res.status(404).json({ msg: 'Empresa no existe'});
        return next();
    }

    empresa.activo = 0;
    await empresa.save();

    res.status(200).json({ msg: 'Empresa Eliminada Correctamente'});

}

// busca una empresa por el nombre
const buscarPorNombre = async (req, res, next) => {

    const nombreBuscar = req.params.nombre;

    if(nombreBuscar.length < 3) {
        res.status(404).json({ msg: 'Mínimo debe tener 3 letras para poder buscar'});
        return next();
    }

    const empresa = await ClienteEmpresa.findAll( { where: {nombre : { [Op.like] : '%'+ nombreBuscar +'%'} }});

    if(!empresa) {
        res.status(404).json({ msg: 'No existe ningún usuario con ese nombre'});
        return next();
    }

    res.status(200).json(empresa);
}

const todosNombres = async (req, res) => {
    const empresas = await ClienteEmpresa.scope('nombre').findAll({
        where: { activo: 1 },
        order: [[ 'nombre', 'ASC' ]]
    });

    return res.status(200).json(empresas)
}

const nombreEmpresaSelect = async (req, res) => {
    const empresas = await ClienteEmpresa.scope('nombre').findAll({
        where: { activo: 1 },
        order: [[ 'nombre', 'ASC' ]]
    });

    const data = [];

    for (const empresa of empresas) {
        data.push({ value: empresa.id, text: empresa.nombre })
    }

    return res.status(200).json(data);
}

export {
    nuevoClienteEmpresa,
    todosClienteEmpresa,
    encontrarClienteEmpresa,
    actualizarClienteEmpresa,
    eliminarClienteEmpresa,
    buscarPorNombre,
    todosNombres,
    nombreEmpresaSelect
}