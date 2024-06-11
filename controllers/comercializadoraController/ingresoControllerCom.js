import IngresoCom from "../../models/comercializadora/IngresoCom.js";
import EdpCom from "../../models/comercializadora/EdpCom.js";
import OcinCom from "../../models/comercializadora/OcinCom.js";
import ProveedorContactoCom from "../../models/comercializadora/ProveedorContactoCom.js";
import Proveedor from "../../models/comercializadora/ProveedorCom.js";
import IngresoEdpCom from "../../models/comercializadora/IngresoEdpCom.js";
import ProveedorOcinIngresoCom from "../../models/comercializadora/ProveedorOcinIngresoCom.js"
import ProveedorIngresoCom from "../../models/comercializadora/ProveedorIngresoCom.js";
import ClienteContactoCom from "../../models/comercializadora/ClienteContactoCom.js";
import ClienteEmpresaCom from "../../models/comercializadora/ClienteEmpresaCom.js";
import Usuario from "../../models/Usuario.js";

const obtenerOvin = async ( req, res ) => {

    try {
        
        const ultimoIngreso = await IngresoCom.findAll({
            limit: 1,
            order: [ [ 'id', 'DESC' ]]
        });

        let ovin = '';

        if ( !ultimoIngreso.length ) {
            ovin = '1-' + new Date().getFullYear();
        } else {
            ovin = (parseInt(ultimoIngreso[0].ovin.split("-")[0]) + 1) + '-' + new Date().getFullYear();
        }

        return res.status(200).json(ovin);

    } catch (error) {
        console.error(error);
        return res.status(404).json({ msg: 'Error al tomar una OTIN', error: true });
    }

}

const nuevoIngresoCom = async ( req, res ) => {

    try {
        
        const { ovin, fecha, tipo, descripcion, numeroGuiaDespacho, fechaGuiaDespacho, numeroOrdenCompra, fechaOrdenCompra, usuarioId, clienteComId, comentario, edps, ocines, proveedoresContacto } = req.body;

        const ingreso = await IngresoCom.create({
            ovin,
            fecha, 
            tipo,
            descripcion,
            numeroGuiaDespacho,
            fechaGuiaDespacho,
            numeroOrdenCompra,
            fechaOrdenCompra,
            statusOrdenCompra: !!numeroOrdenCompra ? true : false,
            usuarioId,
            clienteComId,
            comentario,
            proveedor: proveedoresContacto.length ? true : false,
            edp: edps.length ? true : false,
            ocin: ocines,
        });

        for (const proveedor of proveedoresContacto) {
            
            await ProveedorIngresoCom.create({
                ingresoComId: ingreso.dataValues.id,
                proveedorContactoComId: proveedor.id
            });

            if ( proveedor.ocin ) {

                for (const ocin of proveedor.ocin) {
                    
                    const ocinInsert = await OcinCom.create({
                        ocin
                    });

                    await ProveedorOcinIngresoCom.create({
                        proveedorComId: proveedor.id,
                        ocinComId: ocinInsert.dataValues.id,
                        ingresoComId: ingreso.dataValues.id,
                    });
                }
            }
        }

        for (const edp of edps) {

            const edpInsert = await EdpCom.create({
                codigo: edp.codigo
            });

            await IngresoEdpCom.create({
                ingresoComId: ingreso.dataValues.id,
                edpComId: edpInsert.dataValues.id,
            });
        }

        return res.status(200).json({ msg: 'Ingreso agregado correctamente' });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Error al crear ingreso, contactar a un administrador'});
    }

}

const getOvines = async ( req, res ) => {

    try {
        
        const { rol, usuarioId } = req.params;

        const offset = (parseInt(req.params.offset) || 0) * 20;

        let where = {};

        if ( rol != 1 ) {
            where.usuarioId = usuarioId;
        }

        const total = await IngresoCom.findAll({where});

        const ovines = await IngresoCom.findAll({
            where,
            include: [
                {
                    model: ClienteContactoCom,
                    include: [
                        {
                            model: ClienteEmpresaCom,                    
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Usuario
                }
            ],
            offset,
            limit: 20,
        });

        const data = [];

        for (const ovin of ovines) {

            const obj = ovin;
            
            if ( ovin.proveedor ) {
                const proveedorIngreso = await ProveedorIngresoCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include: [
                        {
                            model: ProveedorContactoCom,
                            include: {
                                model: Proveedor
                            }
                        }
                    ]
                });

                obj.dataValues.proveedorIngreso = proveedorIngreso;
            }

            if ( ovin.edp ) {

                const ingresoEdpCom = await IngresoEdpCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include: [
                        {
                            model: EdpCom
                        }
                    ]
                });

                obj.dataValues.ingresoEdp = ingresoEdpCom;
            }

            if ( ovin.ocin ) {
                const proveedorOcinIngresoCom = await ProveedorOcinIngresoCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include:{
                        model: OcinCom
                    }
                });

                obj.dataValues.proveedorOcinIngreso = proveedorOcinIngresoCom;

                for (const proveedor of obj.dataValues.proveedorIngreso) {
                    const ocinesRelacionadas = proveedorOcinIngresoCom.filter(ocin => ocin.proveedorComId == proveedor.proveedorContactoComId);
                    proveedor.dataValues.ocin = ocinesRelacionadas;
                }
            }

            data.push(obj)
        }

        return res.status(200).json({data, cantPag: Math.ceil(total.length / 20)});

    } catch (error) {
        console.error(error)
        return res.status(400).json({msg: 'Error al traer ovines'})
    }

}

const obtenerInformacionOvin = async ( req, res ) => {
    try {
        
        const { id } = req.params;

        const ovines = await IngresoCom.findAll({
            where: { id },
            include: [
                {
                    model: ClienteContactoCom,
                    include: [
                        {
                            model: ClienteEmpresaCom,                    
                            attributes: ['id', 'nombre']
                        }
                    ]
                },
                {
                    model: Usuario
                }
            ]
        });

        const data = [];

        for (const ovin of ovines) {

            const obj = ovin;
            
            if ( ovin.proveedor ) {
                const proveedorIngreso = await ProveedorIngresoCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include: [
                        {
                            model: ProveedorContactoCom,
                            include: {
                                model: Proveedor
                            }
                        }
                    ]
                });

                obj.dataValues.proveedorIngreso = proveedorIngreso;
            }

            if ( ovin.edp ) {

                const ingresoEdpCom = await IngresoEdpCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include: [
                        {
                            model: EdpCom
                        }
                    ]
                });

                obj.dataValues.ingresoEdp = ingresoEdpCom;
            }

            if ( ovin.ocin ) {
                const proveedorOcinIngresoCom = await ProveedorOcinIngresoCom.findAll({
                    where: {
                        ingresoComId: ovin.id
                    },
                    include:{
                        model: OcinCom
                    }
                });

                obj.dataValues.proveedorOcinIngreso = proveedorOcinIngresoCom;

                for (const proveedor of obj.dataValues.proveedorIngreso) {
                    const ocinesRelacionadas = proveedorOcinIngresoCom.filter(ocin => ocin.proveedorComId == proveedor.proveedorContactoComId);
                    proveedor.dataValues.ocin = ocinesRelacionadas;
                }
            }

            data.push(obj)
        }

        return res.status(200).json(data[0]);

    } catch (error) {
        console.error(error)
        return res.status(400).json({msg: 'Error al traer ovines'})
    }
}

const editarIngresoOvin = async ( req, res ) => {
    try {
        
        const { id } = req.params;
        const { ovin, fecha, tipo, descripcion, numeroGuiaDespacho, fechaGuiaDespacho, numeroOrdenCompra, fechaOrdenCompra, clienteComId, comentario, edps, ocines, proveedoresContacto } = req.body;

        const ingresoOvin = await IngresoCom.findByPk(id);

        if ( !ingresoOvin ) return res.status(400).json({msg: 'Error al encontrar OVIN'});

        ingresoOvin.ovin = ovin;
        ingresoOvin.fecha = fecha;
        ingresoOvin.tipo = tipo;
        ingresoOvin.descripcion = descripcion;
        ingresoOvin.numeroGuiaDespacho = numeroGuiaDespacho;
        ingresoOvin.fechaGuiaDespacho = fechaGuiaDespacho;
        ingresoOvin.numeroOrdenCompra = numeroOrdenCompra;
        ingresoOvin.fechaOrdenCompra = fechaOrdenCompra;
        ingresoOvin.statusOrdenCompra = !!numeroOrdenCompra ? true : false;
        ingresoOvin.clienteComId = clienteComId;
        ingresoOvin.comentario = comentario;
        ingresoOvin.proveedor = proveedoresContacto.length ? true : false;
        ingresoOvin.edp = edps.length ? true : false;
        ingresoOvin.ocin = ocines;

        await ingresoOvin.save();

        // obtiene todos los edps, compara y elimina o agrega segun corresponda
        const obtenerEdps = await IngresoEdpCom.findAll({
            where: {
                ingresoComId: id
            },
            include: [
                {
                    model: EdpCom
                }
            ]
        });

        // agrego los faltantes
        for (const edp of edps) {
            const existe = obtenerEdps.find(edpDb => edpDb.edpCom.codigo == edp.codigo);

            if ( !existe ){
                const edpInsert = await EdpCom.create({
                    codigo: edp.codigo
                });
    
                await IngresoEdpCom.create({
                    ingresoComId: id,
                    edpComId: edpInsert.dataValues.id,
                });
            }
        }

        //elimino las sobrantes
        for (const edpDb of obtenerEdps) {
            const existe = edps.find(edp => edpDb.edpCom.codigo == edp.codigo);

            if ( !existe ) {
                await IngresoEdpCom.destroy({
                    where: {
                        id: edpDb.id
                    }
                });

                await EdpCom.destroy({
                    where: {
                        id: edpDb.edpCom.id
                    }
                })
            }
        }

        ///////////////////////////////
        // obtengo proveedores del ingreso
        const obtenerProveedorIngreso = await ProveedorIngresoCom.findAll({
            where: {
                ingresoComId: id
            },
            include: [
                {
                    model: ProveedorContactoCom
                }
            ]
        });

        // agrego los nuevos
        for (const proveedorIngreso of proveedoresContacto) {
            const existe = obtenerProveedorIngreso.find(proveedor => proveedorIngreso.id == proveedor.proveedorContactoComId);

            if ( !existe ) {
                await ProveedorIngresoCom.create({
                    ingresoComId: id,
                    proveedorContactoComId: proveedorIngreso.id
                });

                if ( proveedorIngreso.ocin ) {

                    for (const ocin of proveedorIngreso.ocin) {
                        
                        const ocinInsert = await OcinCom.create({
                            ocin
                        });
    
                        await ProveedorOcinIngresoCom.create({
                            proveedorComId: proveedorIngreso.id,
                            ocinComId: ocinInsert.dataValues.id,
                            ingresoComId: id,
                        });
                    }
                }
            }
        }

        // elimino los sobrantes
        for (const proveedorIngresoDb of obtenerProveedorIngreso) {
            const existe = proveedoresContacto.find(proveedor => proveedor.id == proveedorIngresoDb.proveedorContactoComId);

            if ( !existe ) {
                await ProveedorIngresoCom.destroy({
                    where: {
                        id: proveedorIngresoDb.id
                    }
                });
            }
        }

        ///////////////////////////////
        // obtengo proveedores-ocines del ingreso
        const obtenerOcinIngresoProveedor = await ProveedorOcinIngresoCom.findAll({
            where: {
                ingresoComId: id
            },
            include: [
                {
                    model: OcinCom
                }
            ]
        });

        // agrego los nuevos
        for (const proveedorOcin of proveedoresContacto) {
            const ocinesProveedor = obtenerOcinIngresoProveedor.filter(ocinesDb => ocinesDb.proveedorComId == proveedorOcin.id);
            if ( !ocinesProveedor.length ) continue;
            for (const ocinProv of ocinesProveedor.ocin) {
                const ocin = proveedorOcin.ocin.find(ocin => ocin == ocinProv);

                if ( !ocin ) {
                    const ocinInsert = await OcinCom.create({
                        ocin: ocinProv
                    });

                    await ProveedorOcinIngresoCom.create({
                        proveedorComId: proveedorOcin.id,
                        ocinComId: ocinInsert.dataValues.id,
                        ingresoComId: id,
                    });
                }
            }
        }

        // elimino sobrantes
        for (const provOcinIngDb of obtenerOcinIngresoProveedor) {
            const provConOCIN = proveedoresContacto.find(prov => prov.id == provOcinIngDb.proveedorComId);

            if ( provConOCIN ) {
                const existe = provConOCIN.ocin.find(ocin => ocin == provOcinIngDb.ocinCom.ocin);

                if ( !existe ) {
                    await OcinCom.destroy({
                        where: {
                            id: provOcinIngDb.ocinCom.id
                        }
                    });

                    await ProveedorOcinIngresoCom.destroy({
                        where: {
                            id: provOcinIngDb.id
                        }
                    })
                }
            }
        }

        return res.status(200).json({msg: 'Edición completa'})

    } catch (error) {
        console.error(error);
        return res.status(400).json({msg: 'Error al guardar la edición del ingreso'});
    }
}

const pruebas = async ( req, res ) => {

    const { id } = req.params;

    const obtenerOcinIngresoProveedor = await ProveedorOcinIngresoCom.findAll({
        where: {
            ingresoComId: id
        },
        include: [
            {
                model: OcinCom
            }
        ]
    });

    console.log(obtenerOcinIngresoProveedor);

    return res.status(200).json(obtenerOcinIngresoProveedor);
}

export {
    obtenerOvin,
    nuevoIngresoCom,
    getOvines,
    obtenerInformacionOvin,
    pruebas,
    editarIngresoOvin
}