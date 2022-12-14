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

            if ( herramienta.fechaGuiaDespacho === null ) {
                herramienta.fechaGuiaDespacho = fechaGuiaDespacho;
            }

            if ( herramienta.guiaDespacho === '-' || herramienta.guiaDespacho === '' ) {
                herramienta.guiaDespacho = guiaDespacho;
            }

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

        const { idEmpresa, estado, numeroFactura, fechaFactura, mes, year } = req.body;

        let where = {};

        if ( fechaFactura !== '' && fechaFactura ) {
            where.fechaFactura = {
                [Op.eq] : fechaFactura
            }
        }               

        if ( numeroFactura !== '' && numeroFactura ) {
            where.numeroFactura = {
                [Op.eq] : numeroFactura
            }
        }

        if ( estado !== '' && estado && estado !== 'Todos' ) {
            where.estado = {
                [Op.eq] : estado
            }
        }
        
        let facturas = await Factura.findAll({ 
            where,
            order: [[ 'numeroFactura', 'DESC' ]]
        });

        where = {};

        if ( idEmpresa !== '' && idEmpresa && idEmpresa !== '0' ) {
            
            where.clienteEmpresaId = {
                [Op.eq] : idEmpresa
            }

        }

        if ( mes !== '' && mes ) {
            
            facturas = facturas.filter( factura => factura.fechaFactura.split("-")[1] == mes)

        }

        if ( year !== '' && year ) {
            
            facturas = facturas.filter( factura => factura.fechaFactura.split("-")[0] == year)

        }

        // traer todos los ingresos asociados a 1 factura
        const herramientas = await Herramienta.scope('factura').findAll({
            where: { 
                facturaId: { [Op.not]: null } 
            },
            include: {
                model: ClienteContacto,
                where,
                attributes: ['nombre', 'clienteEmpresaId'],
                include: {
                    model: ClienteEmpresa,                    
                    attributes: ['id', 'nombre']
                }
            }
        });
        
        const facturaFiltro = [];

        facturas.forEach((factura) => {

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

            facturaFiltro.push(factura);
        });

        return res.status(200).json(facturaFiltro);

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

        const herramientaAntigua = await Herramienta.findAll({ where: { facturaId: factura.id } });

        await herramientaAntigua.forEach(async herramienta => {
            
            if ( !guardarOtines.find(otin => otin.id == herramienta.id) ){
                herramienta.facturaId = null;
                await herramienta.save();
            }

        });

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

        if ( factura.formaPago === 'Crédito' && factura.estado === 'Pendiente' ){

            const fechaLimite = await addDaysToDate(factura.fechaFactura, 30);
            
            const mora = await diffInDays(new Date(), fechaLimite)
            
            if ( mora > 0) {
                factura.estado = 'Vencido';
            }
            
        } else if ( factura.formaPago === 'Contado' && factura.estado === 'Pendiente' ) {
            
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

// crea una nota de credito
const notaCredito = async (req, res) => {

    const { id } = req.params;

    const factura = await Factura.findByPk(id);

    if ( !factura ) {
        return res.status(404).json({ msg: 'No existe Factura' });
    }

    factura.estado = 'Anulada';
    factura.numeroNotaCredito = req.body.numeroNotaCredito;

    const herramientas = await Herramienta.scope('factura').findAll({ where: { facturaId : id } });

    await herramientas.forEach(async herramienta => {
        herramienta.facturaId = null;
        await herramienta.save();
    });

    await factura.save();

    res.status(200).json({ msg: 'Factura anulada correctamente' });
}

// pagar una factura
const pagarFactura = async (req, res) => {

    const { id } = req.params;

    const factura = await Factura.findByPk(id);

    if ( !factura ) {
        return res.status(404).json({ msg: 'No existe Factura' });
    }

    factura.fechaPago = req.body.fechaPago;
    factura.estado = 'Pagado';
    
    await factura.save();

    return res.status(200).json({ msg: 'Factura pagada' });
}

// obtiene una factura en especifico
const obtenerFactura = async ( req, res) => {

    const { id } = req.params;

    const factura = await Factura.findByPk(id);

    // traer todos los ingresos asociados a 1 factura
    const herramientas = await Herramienta.scope('factura').findAll({
        where: { 
            facturaId: factura.id 
        },
        include: {
            model: ClienteContacto,
            attributes: ['nombre', 'clienteEmpresaId'],
            include: {
                model: ClienteEmpresa,
                attributes: ['id', 'nombre']
            }
        }
    });
    
    let otines = '';
        
    const iguales = herramientas.filter(herramienta =>{

        if ( otines === '' ) {
            otines = herramienta.otin;
        } else {
            otines = otines + ", " + herramienta.otin;
        }

        return herramienta;
    });

    factura.dataValues.herramientas = iguales;
    factura.dataValues.otines = otines;
    factura.dataValues.empresaId = factura.dataValues.herramientas[0].clienteContacto.clienteEmpresaId;

    return res.status(200).json(factura);

}

export {
    nuevaFactura,
    obtenerFacturas,
    actualizarFactura,
    notaCredito,
    pagarFactura,
    obtenerFactura
}