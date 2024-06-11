import Proveedor from "../../models/comercializadora/ProveedorCom.js";
import ProveedorContactoCom from "../../models/comercializadora/ProveedorContactoCom.js";

const nuevoProveedor = async ( req, res ) => {

    const { nombre, razonSocial, rut, direccion } = req.body;

    try {
        
        const existe = await Proveedor.findAll({ where: {razonSocial, nombre} });

        if ( existe.length > 0 ) {
            return res.status(500).json({ msg: 'Ya existe este proveedor' });
        }

        await Proveedor.create({
            nombre,
            razonSocial,
            rut,
            direccion,
            activo: 1
        });

        return res.status(200).json({ msg: 'Proveedor agregado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error agregando proveedor' });
    }
}

const obtenerProveedores = async ( req, res) => {
    try {
        
        const offset = parseInt(req.params.offset) ? (parseInt(req.params.offset) || 0) * 20 : 0;
        
        const proveedores = await Proveedor.findAll({
            where: {
                activo: 1
            },
            offset,
            limit:  parseInt(req.params.offset) ? 20 : 100000,
            order: [[ 'nombre', 'ASC' ]]
        });

        const cant = await Proveedor.findAll();

        return res.status(200).json({proveedores, cantPag: Math.ceil(cant.length / 20)});

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error obteniendo proveedores' });
    }
}

const  actualizarProveedor = async (req, res) => {
    
    const { nombre, rut, razonSocial, direccion, id } = req.body;

    try {
        
        const existe = await Proveedor.findByPk(id);

        if ( existe.length == 0 ){
            return res.status(500).json({ msg: 'Error en encontrar proveedor' });
        }

        existe.nombre = nombre;
        existe.razonSocial = razonSocial;
        existe.direccion = direccion;
        existe.rut = rut;

        await existe.save();

        return res.status(200).json({ msg: 'Proveedor Actualizado' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error actualizando proveedor' });
    }
}

const desactivarProveedor = async ( req, res ) => {

    const { id } = req.params;

    try {
        
        const existe = await Proveedor.findByPk(id);

        if ( existe.length == 0 ) {
            return res.status(500).json({ msg: 'Error en encontrar proveedor' });
        }

        existe.activo = !existe.activo;

        await existe.save();

        return res.status(200).json({ msg: 'Proveedor desactivado' })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error encontrando a proveedor' });
    }

}

const obtenerProveedor = async ( req, res ) => {

    const { id } = req.params;

    try {
        
        const existe = await Proveedor.findByPk(id);

        if ( existe.length == 0 ) {
            return res.status(500).json({ msg: 'Error en encontrar proveedor' });
        }

        return res.status(200).json(existe);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error encontrando a proveedor' });
    }
}

const obtenerNombresProveedores = async ( req, res ) => {

    const proveedores = await Proveedor.findAll({
        where: {
            activo: 1
        },
        attributes: ['id', 'nombre']
    });

    return res.status(200).json(proveedores);

}

const obtenerContactos = async ( req, res ) => {

    const { id } = req.params;

    const offset = parseInt(req.params.offset) ? (parseInt(req.params.offset) || 0) * 20 : 0;
 
    const cant = await ProveedorContactoCom.findAll({where: {proveedorComId: id, activo: 1}});

    const contactos = await ProveedorContactoCom.findAll({ 
        where: {proveedorComId: id, activo: 1},
        offset,
        limit:  parseInt(req.params.offset) ? 20 : 100000,
        order: [[ 'nombre', 'ASC' ]]
    });

    return res.status(200).json({contactos, cantPag: Math.ceil(cant.length / 20)})
}

const editarContacto = async ( req, res ) => {
    const { id } = req.params;

    const contacto = await ProveedorContactoCom.findByPk(id);

    return res.status(200).json(contacto);
} 

const actualizarContacto = async ( req, res ) => {

    const { id } = req.params;
    const { nombre, cargo, correo, telefono } = req.body;

    const contacto = await ProveedorContactoCom.findByPk(id);

    contacto.nombre = nombre;
    contacto.cargo = cargo;
    contacto.correo = correo;
    contacto.telefono = telefono;

    await contacto.save();

    return res.status(200).json({msg: 'Todo Ok'});
}

const eliminarContacto = async ( req, res ) => {

    const { id } = req.params;

    const contacto = await ProveedorContactoCom.findByPk(id);

    contacto.activo = 0;

    await contacto.save();

    return res.status(200).json({msg: 'ok'})

}

const nuevoContacto = async ( req, res ) => {

    const { id } = req.params

    const { nombre, telefono, correo, cargo } = req.body;

    await ProveedorContactoCom.create({
        nombre,
        telefono,
        correo,
        cargo,
        activo: 1,
        proveedorComId: id
    })

    return res.status(200).json({ msg: 'ok'})
}

const getProveedoresSelect = async ( req, res ) => {

    try {
        
        const proveedores = await Proveedor.findAll({ where: { activo: 1 }, order: [[ 'nombre', 'ASC' ]] });

        const data = [];

        for (const proveedor of proveedores) {
            data.push({ value: proveedor.id, text: proveedor.nombre })
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: 'Error al traer los proveedores' });
    }

}

const getProveedorContactosSelect = async ( req, res ) => {

    try {
        
        const { id } = req.params;

        const contactos = await ProveedorContactoCom.findAll({ where: { activo: 1, proveedorComId: id }, order: [[ 'nombre', 'ASC' ]] });

        const data = [];

        for (const contacto of contactos) {
            data.push({ value: contacto.id, text: contacto.nombre })
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error)
        return res.status(400).json({ msg: 'Error al traer los proveedores contacto' });
    }

}
export {
    actualizarProveedor,
    desactivarProveedor,
    nuevoProveedor,
    obtenerProveedores,
    obtenerProveedor,
    obtenerNombresProveedores,
    obtenerContactos,
    actualizarContacto,
    eliminarContacto,
    editarContacto,
    nuevoContacto,
    getProveedoresSelect,
    getProveedorContactosSelect
}