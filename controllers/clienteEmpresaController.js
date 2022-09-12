import ClienteEmpresa from "../models/ClienteEmpresa.js";

// agrega un nuevo cliente empresa y retorna la id
const nuevoClienteEmpresa = async (req, res, next) => {

    // TODO: Permisos

    const {nombreEmpresa, razonSocial, rut, direccion } = req.body;

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

        res.status(200).json({ msg: `Cliente ${razonSocial} creada correctamente!`, id: empresa.dataValues.id});
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error, vuelva a intentar'});
    }
}

// obtiene todas las empresas
const todosClienteEmpresa = async (req, res) => {

    const empresas = await ClienteEmpresa.findAll({});

    res.status(200).json(empresas);
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

    const { nombreEmpresa, razonSocial, rut, direccion } = req.body;
    
    if(!nombreEmpresa || !razonSocial || !rut || !direccion){
        res.status(400).json({msg: 'Todos los campos son necesarios'});
        return next();
    }

    empresa.nombre = nombreEmpresa;
    empresa.rut = rut.split(".").join("").split("-").join("");
    empresa.razonSocial = razonSocial;
    empresa.direccion = direccion;

    await empresa.save();

    res.status(200).json({msg: `${razonSocial} fue actualizado correctamente!`});
}

export {
    nuevoClienteEmpresa,
    todosClienteEmpresa,
    encontrarClienteEmpresa,
    actualizarClienteEmpresa
}