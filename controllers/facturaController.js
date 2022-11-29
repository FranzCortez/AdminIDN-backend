import Factura from "../models/Factura.js";
import Herramienta from "../models/Herramienta.js";

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

export {
    nuevaFactura
}