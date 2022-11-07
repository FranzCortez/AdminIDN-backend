import { DataTypes } from "sequelize";
import db from "../config/db.js";
import ClienteContacto from "./ClienteContacto.js";
import Herramienta from "./Herramienta.js";

const Cotizacion = db.define('cotizacion', {
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descuento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    iva: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    neto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    subtotal: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fechaEvaluacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fechaCotizacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    contenido: {
        type: DataTypes.JSON,
        allowNull: true
    },
    condiciones: {
        type: DataTypes.STRING,
        allowNull: true
    },
    plazoEntrega: {
        type: DataTypes.STRING,
        allowNull: true
    },
    garantia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otin: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    scopes: {
        archivo: {
            attributes: {
                exclude: ['descuento', 'total', 'iva', 'neto', 'subtotal', 'fechaEvaluacion', 'fechaCotizacion', 'condiciones', 'plazoEntrega', 'garantia', 'otin']
            }
        }
    }
});

Cotizacion.belongsTo(Herramienta);
Cotizacion.belongsTo(ClienteContacto);

export default Cotizacion;