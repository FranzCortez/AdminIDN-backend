import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Factura = db.define('factura', {
    numeroFactura: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fechaFactura: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    numeroCompra: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaCompra: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    formaPago: {
        type: DataTypes.STRING,
        allowNull: true
    },
    monto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fechaPago: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
    },
    guiaDespacho: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaGuiaDespacho: {
        type: DataTypes.DATEONLY,
    },
    numeroNotaCredito: {
        type: DataTypes.STRING,
    },
    boletaPagado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
}); 


export default Factura;