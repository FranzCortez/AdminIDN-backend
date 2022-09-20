import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Factura = db.define('factura', {
    numeroFactura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroCompra: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaCompra: {
        type: DataTypes.DATE,
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
    descuento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fechaPago: {
        type: DataTypes.DATE,
    },
    observaciones: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false
}); 


export default Factura;