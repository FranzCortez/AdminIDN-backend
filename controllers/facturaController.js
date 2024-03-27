import Factura from "../models/Factura.js";
import Herramienta from "../models/Herramienta.js";
import ClienteContacto from "../models/ClienteContacto.js";
import ClienteEmpresa from "../models/ClienteEmpresa.js";
import Sequelize from "sequelize";
import TipoHerramienta from "../models/TipoHerramienta.js";
import FacturaIngreso from "../models/FacturaIngreso.js";
const Op = Sequelize.Op;
const fn = Sequelize.fn;


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

        if ( guardarOtines.length > 0 ) {

            await guardarOtines.forEach(async otin => {
                
                const herramienta = await Herramienta.findByPk(otin.id);
    
                await FacturaIngreso.create({
                    herramientumId: herramienta.id,
                    facturaId: factura.dataValues.id
                });
    
                herramienta.facturaId = factura.dataValues.id;
    
                if ( herramienta.fechaGuiaDespacho === null ) {
                    herramienta.fechaGuiaDespacho = fechaGuiaDespacho;
                }
    
                if ( herramienta.guiaDespacho === '-' || herramienta.guiaDespacho === '' ) {
                    herramienta.guiaDespacho = guiaDespacho;
                }
    
                await herramienta.save();
    
            });
        } else {
            await FacturaIngreso.create({
                herramientumId: null,
                facturaId: factura.dataValues.id
            });
        }
                

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

        const offset = idEmpresa !== '' && idEmpresa && idEmpresa !== '0' ? 0 : (parseInt(req.params.offset) || 0) * 20;
        
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

        let enlaceFacturaHerramienta = await FacturaIngreso.findAll({
            offset,
            include: [
                {
                    model: Factura,
                    where,
                },
                {
                    model: Herramienta,
                    include: [
                        {
                            model: ClienteContacto,
                            where: idEmpresa !== '' && idEmpresa && idEmpresa !== '0' ? { clienteEmpresaId: { [Op.eq] : idEmpresa } } : {},
                            attributes: ['nombre', 'clienteEmpresaId', 'correo', 'telefono'],
                            include: {
                                model: ClienteEmpresa,                    
                                attributes: ['id', 'nombre']
                            }
                        },
                        {
                            model: TipoHerramienta,
                            attributes: ['nombre']
                        }
                    ]
                }
            ],
            limit: !!(idEmpresa !== '' && idEmpresa && idEmpresa !== '0') || !!(mes !== '' && mes) || !!(year !== '' && year) ? 100000 : 20,
            order: [[ 'facturaId', 'DESC' ]]
        })

        // console.log(JSON.stringify(enlaceFacturaHerramienta[0], null, 2))
        // console.log(enlaceFacturaHerramienta.length)

        // FILTROS 
        enlaceFacturaHerramienta = await enlaceFacturaHerramienta.map( enlace => {

            if ( enlace.factura != null ){

                const nuevoObjFactura = {
                    id: enlace.factura.id,
                    numeroFactura: enlace.factura.numeroFactura,
                    fechaFactura: enlace.factura.fechaFactura,
                    numeroCompra: enlace.factura.numeroCompra,
                    fechaCompra: enlace.factura.fechaCompra,
                    formaPago: enlace.factura.formaPago,
                    monto: enlace.factura.monto,
                    fechaPago: enlace.factura.fechaPago,
                    observaciones: enlace.factura.observaciones,
                    estado: enlace.factura.estado,
                    guiaDespacho: enlace.factura.guiaDespacho,
                    fechaGuiaDespacho: enlace.factura.fechaGuiaDespacho,
                    numeroNotaCredito: enlace.factura.numeroNotaCredito,
                    boletaPagado: enlace.factura.boletaPagado
                };

                nuevoObjFactura.herramientas = enlace.herramientum == null ? null : {
                    id: enlace.herramientum?.id,
                    otin: enlace.herramientum?.otin,
                    nombre: enlace.herramientum?.nombre,
                    marca: enlace.herramientum?.marca,
                    fecha: enlace.herramientum?.fecha,
                    comentario: enlace.herramientum?.comentario,
                    modelo: enlace.herramientum?.modelo,
                    numeroSerie: enlace.herramientum?.numeroSerie,
                    numeroInterno: enlace.herramientum?.numeroInterno,
                    numeroGuiaCliente: enlace.herramientum?.numeroGuiaCliente,
                    guiaDespacho: enlace.herramientum?.guiaDespacho,
                    fechaGuiaDespacho: enlace.herramientum?.fechaGuiaDespacho,
                    activo: enlace.herramientum?.activo,
                    usuario: enlace.herramientum?.usuario,
                    facturaId: enlace.herramientum?.facturaId,
                    tipoHerramientaId: enlace.herramientum?.tipoHerramientaId,
                    clienteContactoId: enlace.herramientum?.clienteContactoId,
                    clienteContacto: {
                        nombre: enlace.herramientum?.clienteContacto.nombre,
                        clienteEmpresaId: enlace.herramientum?.clienteContacto.clienteEmpresaId,
                        correo: enlace.herramientum?.clienteContacto.correo,
                        telefono: enlace.herramientum?.clienteContacto.telefono,
                        clienteEmpresa: {
                            id: enlace.herramientum?.clienteContacto.clienteEmpresa.id,
                            nombre: enlace.herramientum?.clienteContacto.clienteEmpresa.nombre
                        }
                    },
                    tipoHerramientum: {
                        nombre: enlace.herramientum?.tipoHerramientum.nombre
                    }
                };

                if ( idEmpresa !== '' && idEmpresa && idEmpresa !== '0' ) {
                    
                    if ( enlace.herramientum != null ) {
                        return nuevoObjFactura;
                    }
                    
                } else {
                    return nuevoObjFactura;
                }
            }
        });
       
        
        enlaceFacturaHerramienta = enlaceFacturaHerramienta.filter(notNull => typeof notNull !== 'undefined')
        
        // if ( mes !== '' && mes ) {
        //     enlaceFacturaHerramienta = enlaceFacturaHerramienta.filter( factura => factura.fechaFactura.split("-")[1] == mes)
        // }

        // if ( year !== '' && year ) {
            
        //     enlaceFacturaHerramienta = enlaceFacturaHerramienta.filter( factura => factura.fechaFactura.split("-")[0] == year)

        // }

        enlaceFacturaHerramienta = enlaceFacturaHerramienta.reduce((acumulador, elemento) => {
            const existente = acumulador.find((item) => item.numeroFactura === elemento.numeroFactura);
          
            if (existente) {
              // Si ya existe un elemento con el mismo "id", agrégalo a su subarreglo
              existente.herramientas.push(elemento.herramientas);
              existente.infoOtines.push(elemento.herramientas);

              let otinNueva = elemento.herramientas.otin;

              existente.otines = existente.otines + ', ' + otinNueva;

            } else {
                // console.log(JSON.stringify(elemento, null, 2))
              // Si no existe, crea un nuevo elemento con el subarreglo
              acumulador.push({ ...elemento, herramientas: !elemento.herramientas ? null : [ elemento.herramientas ], infoOtines: !elemento.herramientas ? null : [ elemento.herramientas ], otines: elemento.herramientas?.otin });
            }
          
            return acumulador;
        }, []);
        
        return res.status(200).json(enlaceFacturaHerramienta);

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

        const enlazeAntiguo = await FacturaIngreso.findAll({ where: { facturaId: factura.id } });

        await enlazeAntiguo.forEach(async herramienta => {
            
            if ( !guardarOtines.find(otin => otin.id == herramienta.herramientumId) ){
                await herramienta.destroy();
            }

        });

        await guardarOtines.forEach(async otin => {
            
            await FacturaIngreso.create({
                facturaId: factura.id,
                herramientumId: otin.id
            })

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
            
            if ( mora >= -1) {
                factura.estado = 'Vencido';
            }
            
        } else if ( factura.formaPago === 'Contado' && factura.estado === 'Pendiente' ) {
            
            const fechaLimite = await addDaysToDate(factura.fechaFactura, 1);
            
            const mora = await diffInDays(new Date(), fechaLimite)
        
            if ( mora >= -1) {
                factura.estado = 'Vencido';
            }
        } else if ( factura.estado === 'Pendiente' ) {

            const fechaLimite = await addDaysToDate(factura.fechaFactura, 1);
            
            const mora = await diffInDays(new Date(), fechaLimite)
        
            if ( mora >= -1) {
                factura.estado = 'Vencido';
            } 
            
        }

        await factura.save();
    });

    return;
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

    const facturaingreso = await FacturaIngreso.findAll({ where: { facturaId: id } });
    console.log(facturaingreso, id)
    await facturaingreso.forEach(async fh => {
        fh.herramientumId = null;
        await fh.save();
    });

    await factura.save();

    const otines = await Herramienta.findAll({ where: { facturaId: id } });

    if ( otines.length ) {
        for (const otin of otines) {
            otin.facturaId = null;
            await otin.save();
        }
    }

    return res.status(200).json({ msg: 'Factura anulada correctamente' });
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

    try {

        const { id } = req.params;

        const enlaceFacturaHerramienta = await FacturaIngreso.findAll({
            where: {
                facturaId: id
            },
            include: [
                {
                    model: Factura
                },
                {
                    model: Herramienta,
                    attributes: ['otin', 'id', 'clienteContactoId']
                }
            ],
        })

        const empresa = await ClienteContacto.findByPk(enlaceFacturaHerramienta[0].herramientum.clienteContactoId);

        const nuevoObjFactura = {
            id: enlaceFacturaHerramienta[0].factura.id,
            numeroFactura: enlaceFacturaHerramienta[0].factura.numeroFactura,
            fechaFactura: enlaceFacturaHerramienta[0].factura.fechaFactura,
            numeroCompra: enlaceFacturaHerramienta[0].factura.numeroCompra ,
            fechaCompra: enlaceFacturaHerramienta[0].factura.fechaCompra,
            formaPago: enlaceFacturaHerramienta[0].factura.formaPago ,
            monto: enlaceFacturaHerramienta[0].factura.monto ,
            fechaPago: enlaceFacturaHerramienta[0].factura.fechaPago ,
            observaciones: enlaceFacturaHerramienta[0].factura.observaciones,
            estado: enlaceFacturaHerramienta[0].factura.estado ,
            guiaDespacho: enlaceFacturaHerramienta[0].factura.guiaDespacho,
            fechaGuiaDespacho: enlaceFacturaHerramienta[0].factura.fechaGuiaDespacho,
            numeroNotaCredito: enlaceFacturaHerramienta[0].factura.numeroNotaCredito,
            boletaPagado: enlaceFacturaHerramienta[0].factura.boletaPagado,
            empresaId: empresa.clienteEmpresaId,
            guardarOtines: {
                otinLabel: '',
                otines: [],
                ids: []
            }
        };

        enlaceFacturaHerramienta.forEach( enlace => {

            nuevoObjFactura.guardarOtines.otinLabel + ', ' + enlace.herramientum.otin
            nuevoObjFactura.guardarOtines.ids.push(enlace.herramientum.id);
            nuevoObjFactura.guardarOtines.otines.push(enlace.herramientum.otin);

        });

        return res.status(200).json(nuevoObjFactura);

    } catch (error) {
        return res.status(404);
    }

}

const numeroFactura = async (req, res) => {

    const factura = await Factura.findAll({
        limit: 1,
        order: [ [ 'id', 'DESC' ]]
    });
    
    return res.status(200).json({ numero: factura[0].numeroFactura});

}

const cantFactura = async (req, res) => {
    
    try {
        const cant = await Factura.findAll({});
        
        return res.status(200).json({cantPag: Math.ceil(cant.length / 20)});
    } catch (error) {
        return res.status(404).json({msg: 'ERROR'});
    }

}

const infoFact = async (req, res) => {

    try {
        const factura = await Factura.findOne({ where: { numeroFactura: req.params.nFactura } })

        return res.status(200).json(factura);

    } catch (error) {
        return res.status(404);
    }

}

const boletaAutomatica = async (req, res) => {

    try {
        
        const { empresa, estado } = req.body;

        let where = {};
        
        if ( estado === 0 || estado === '0' ) {
            where.estado = {
                [Op.eq] : 'Vencido'
            }
        } else if ( estado === '1' ) {
            where.estado = {
                [Op.eq] : 'Pendiente'
            }
        } else {
            where = {
                [Op.or]: [
                    { estado: 'Pendiente' },
                    { estado: 'Vencido' }
                ]
            }
        }

        const facturas = await Factura.findAll({ 
            where,
            order: [[ 'id', 'DESC' ]]
        });

        where = {};

        if ( empresa !== '' && empresa && empresa !== '0' ) {
            
            where.clienteEmpresaId = {
                [Op.eq] : empresa
            }

        }

        const id = [];

        facturas.forEach( factura => id.push(factura.id) );

        const allFacturasHerramienta = await FacturaIngreso.findAll({
            where: {
                facturaId: {
                    [Op.or]: id
                }
            }
        })
        
        const idHerramienta = allFacturasHerramienta.map(enlace => enlace.herramientumId)

        // traer todos los ingresos asociados a 1 factura
        const herramientas = await Herramienta.scope('factura').findAll({
            where: { 
                id: {
                    [Op.or]: idHerramienta
                }
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

            const mismaFactura = [];
            const infoOtin = [];

            allFacturasHerramienta.forEach( fh => {
                if ( factura.id === fh.facturaId ) {
                    mismaFactura.push(herramientas.find(herramienta => herramienta.id == fh.dataValues.herramientumId));
                }
            });
            mismaFactura.forEach(herramienta => {
                infoOtin.push(herramienta);
            });

            const nombres = mismaFactura.map(objeto => objeto.otin);
            const otines = nombres.join(', ');

            if( infoOtin.length > 0 ) {
                factura.dataValues.herramientas = infoOtin;
                factura.dataValues.otines = otines;
    
                facturaFiltro.push(factura);
            }

        });

        return res.status(200).json(facturaFiltro);

    } catch (error) {
        return res.status(404).json({ msg: 'Error!'});
    }
}

const marcarPagadas = async (req, res) => {

    try {
        
        const facturas = await Factura.findAll({
            where: {
                id: {
                    [Op.or]: req.body
                }
            }
        });


        facturas.forEach(async factura => {

            factura.boletaPagado = true;
            await factura.save();
        });

        return res.status(200).json({ msg: 'Boleta de pago generada' });

    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: 'No se pudo generar el comprobante de pago' });
    }

}

// obtener facturas por mes y año
const obtenerFacturaMesAño = async (req, res) => {

    try {

        const { mes, año } = req.body;

        const facturas = await Factura.findAll({ 
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fechaFactura')), mes),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fechaFactura')), año),
                ],
            },
            attributes: ['id', 'fechaFactura', 'monto', 'numeroFactura', 'estado']
        });

        if ( facturas.length === 0 ) {
            return res.status(200).json(facturas);
        }

        const id = [];
        
        facturas.forEach(factura => id.push(factura.id));

        const allFacturasHerramienta = await FacturaIngreso.findAll({
            where: {
                facturaId: {
                    [Op.or]: id
                }
            }
        })
        
        const idHerramienta = allFacturasHerramienta.map(enlace => enlace.herramientumId)

        const herramientas = await Herramienta.findAll({
            where: {
                id: {
                    [Op.or]: idHerramienta
                }
            },
            attributes: ['id', 'otin', 'clienteContactoId', 'facturaId'],
            include: {
                model: ClienteContacto,
                attributes: ['nombre', 'clienteEmpresaId'],
                include: {
                    model: ClienteEmpresa,                    
                    attributes: ['id', 'nombre']
                }
            }
        });
        
        const datos = [];

        facturas.forEach((factura) => {

            const mismaFactura = [];
            const infoOtin = [];

            allFacturasHerramienta.forEach( fh => {
                if ( factura.id === fh.facturaId && factura.estado != 'Anulada' ) {
                    mismaFactura.push(herramientas.find(herramienta => herramienta.id == fh.dataValues.herramientumId));
                }
            });
            mismaFactura.forEach(herramienta => {
                infoOtin.push(herramienta);
            });

            const nombres = mismaFactura.map(objeto => objeto.otin);
            const otines = nombres.join(', ');

            if( infoOtin.length > 0 ) {
                factura.dataValues.herramientas = infoOtin;
                factura.dataValues.otines = otines;
    
                datos.push(factura);
            }

        });
        
        return res.status(200).json(datos);
        
    } catch (error) {
        console.log(error);
        return res.status(400).json( { msg: 'No se encontro factura en el mes' } );
    }
}

// obtiene todas las facturas que se pagaron en ese mes y año
const obtenerIngresoMesAño = async (req, res) => {

    try {

        const { mes, año } = req.body;

        const facturas = await Factura.findAll({ 
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('fechaPago')), mes),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fechaPago')), año),
                ],
                estado: {
                    [Op.eq] : 'Pagado'
                }
            },
            attributes: ['id', 'fechaFactura', 'monto', 'numeroFactura']
        });

        if ( facturas.length === 0 ) {
            return res.status(200).json(facturas);
        }

        const id = [];
        
        facturas.forEach(factura => id.push(factura.id));
        
        const allFacturasHerramienta = await FacturaIngreso.findAll({
            where: {
                facturaId: {
                    [Op.or]: id
                }
            }
        })
        
        const idHerramienta = allFacturasHerramienta.map(enlace => enlace.herramientumId)


        const herramientas = await Herramienta.findAll({
            where: {
                id: {
                    [Op.or]: idHerramienta
                }
            },
            attributes: ['id', 'otin', 'clienteContactoId', 'facturaId'],
            include: {
                model: ClienteContacto,
                attributes: ['nombre', 'clienteEmpresaId'],
                include: {
                    model: ClienteEmpresa,                    
                    attributes: ['id', 'nombre']
                }
            }
        });
        
        const datos = [];

        facturas.forEach((factura) => {
            const mismaFactura = [];
            const infoOtin = [];

            allFacturasHerramienta.forEach( fh => {
                if ( factura.id === fh.facturaId ) {
                    mismaFactura.push(herramientas.find(herramienta => herramienta.id == fh.dataValues.herramientumId));
                }
            });
            mismaFactura.forEach(herramienta => {
                infoOtin.push(herramienta);
            });

            const nombres = mismaFactura.map(objeto => objeto.otin);
            const otines = nombres.join(', ');

            if( infoOtin.length > 0 ) {
                factura.dataValues.herramientas = infoOtin;
                factura.dataValues.otines = otines;
    
                datos.push(factura);
            }

        });
        
        return res.status(200).json(datos);
        
    } catch (error) {
        console.log(error);
        return res.status(400).json( { msg: 'No se encontro factura en el mes' } );
    }
}

export {
    nuevaFactura,
    obtenerFacturas,
    actualizarFactura,
    notaCredito,
    pagarFactura,
    obtenerFactura,
    actualizarEstado,
    numeroFactura,
    cantFactura,
    infoFact,
    boletaAutomatica,
    marcarPagadas,
    obtenerFacturaMesAño,
    obtenerIngresoMesAño
}