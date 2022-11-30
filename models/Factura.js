import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Factura = db.define('factura', {
    numeroFactura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaFactura: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    numeroCompra: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaCompra: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    formaPago: {
        type: DataTypes.STRING,
        allowNull: false
    },
    monto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaPago: {
        type: DataTypes.DATEONLY,
    },
    observaciones: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
    },
    guiaDespacho: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaGuiaDespacho: {
        type: DataTypes.DATEONLY,
    },
    numeroNotaCredito: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false
}); 


export default Factura;