import Factura from "../models/Factura.js";
import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;


// Crea una nueva factura, agregando la id de factura a una(s) herramienta(s)
const nuevaFactura = async (req, res) => {

    const { numeroFactura, fechaFactura, numeroCompra, fechaCompra, formaPago, monto, fechaPago, observaciones, estado, fechaGuiaDespacho, guiaDespacho, guardarOtines } = req.body;

    if( !numeroFactura ) {
        return res.status(500).json({ msg: 'Campos necesarios faltante' });
    }
    
    try {
        
        const factura = await Factura.create({
            numeroFactura,
            fechaFactura,
            numeroCompra,
            fechaCompra,
            formaPago,
            monto,
            fechaPago,
            observaciones,
            estado,
            fechaGuiaDespacho,
            guiaDespacho
        });
        
        await guardarOtines.forEach(async otin => {
            
            const herramienta = await Herramienta.findByPk(otin.id);

            herramienta.facturaId = factura.id;

            await herramienta.save();

        });

        return res.status(200).json({ msg: 'Factura agregada correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al crear la factura, intentelo de nuevo.' });
    }

}

// obtiene todas las facturas
const obtenerFacturas = async ( req, res) => {

    try {
        
        await actualizarEstado();
        
        const facturas = await Factura.findAll();

        // traer todos los ingresos asociados a 1 factura
        const herramientas = await Herramienta.scope('factura').findAll({
            where: { 
                facturaId: { [Op.not]: null } 
            },
            include: {
                model: ClienteContacto,
                attributes: ['nombre'],
                include: {
                    model: ClienteEmpresa,
                    attributes: ['id', 'nombre']
                }
            }
        });
        
        facturas.forEach((factura, index) => {

            let otines = '';
            
            const iguales = herramientas.filter(herramienta =>{

                if ( herramienta.facturaId === factura.id ) {
                    
                    if ( otines === '' ) {
                        otines = herramienta.otin;
                    } else {
                        otines = otines + ", " + herramienta.otin;
                    }

                    return herramienta;
                }

            });
            factura.dataValues.herramientas = iguales;
            factura.dataValues.otines = otines;
        });

        return res.status(200).json(facturas);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: 'Aún no existen Facturas' });
    }

}

// actualiza una factura 
const actualizarFactura = async (req, res) => {

    const { id } = req.params;

    const factura = await Factura.findByPk(id);

    if( !factura ) {
        return res.status(404).json({ msg: 'Error' });
    }

    const { numeroFactura, fechaFactura, numeroCompra, fechaCompra, formaPago, monto, fechaPago, observaciones, estado, fechaGuiaDespacho, guiaDespacho, guardarOtines } = req.body;

    if( !numeroFactura ) {
        return res.status(500).json({ msg: 'Campos necesarios faltante' });
    }
    
    try {
        
        factura.numeroFactura = numeroFactura;
        factura.fechaFactura = fechaFactura;
        factura.numeroCompra = numeroCompra;
        factura.fechaCompra = fechaCompra;
        factura.formaPago = formaPago;
        factura.monto = monto;
        factura.fechaPago = fechaPago;
        factura.observaciones = observaciones;
        factura.estado = estado;
        factura.fechaGuiaDespacho = fechaGuiaDespacho;
        factura.guiaDespacho = guiaDespacho;
        
        await factura.save();

        await guardarOtines.forEach(async otin => {
            
            const herramienta = await Herramienta.findByPk(otin.id);

            herramienta.facturaId = factura.id;

            await herramienta.save();

        });

        return res.status(200).json({ msg: 'Factura actualizada correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error al actualizar la factura, intentelo de nuevo.' });
    }

}

// actualiza el estado de una factura
const actualizarEstado = async () => {
    
    const facturas = await Factura.findAll();

    await facturas.forEach(async factura => {

        if ( await(factura.formaPago === 'Crédito' && factura.estado === 'Pendiente') ){

            const fechaLimite = await addDaysToDate(factura.fechaFactura, 30);
            
            const mora = await diffInDays(new Date(), fechaLimite)
            
            if ( mora > 0) {
                factura.estado = 'Vencido';
            }
            
        } else if ( await (factura.formaPago === 'Contado' && factura.estado === 'Pendiente') ) {
            
            const fechaLimite = await addDaysToDate(factura.fechaFactura, 1);
            
            const mora = await diffInDays(new Date(), fechaLimite)
        
            if ( mora > 0) {
                factura.estado = 'Vencido';
            }
        }

        await factura.save();
    });

}

function addDaysToDate(date, days){
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
}


const diffInDays = (x, y) => Math.floor((x - y) / (1000 * 60 * 60 * 24));

export {
    nuevaFactura,
    obtenerFacturas,
    actualizarFactura
}