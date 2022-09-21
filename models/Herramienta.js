import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Factura from "./Factura.js";
import ClienteContacto from "./ClienteContacto.js";
import TipoHerramienta from "./TipoHerramienta.js";

const Herramienta = db.define('herramienta', {
    otin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '-'
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    comentario: {
        type: DataTypes.TEXT,
        defaultValue: '-'
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroIntero: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    numeroGuiaCliente: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    guiaDespacho: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    fechaGuiaDespacho: {
        type: DataTypes.DATE
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    scopes: {
        herramienta: {
            attributes: {
                exclude: ['fecha', 'numeroInterno', 'numeroGuiaCliente', 'guiaDespacho', 'fechaGuiaDespacho']
            }
        },
        ingreso: {
            attributes: {
                exclude: ['nombre', 'marca', 'modelo', 'descripcion', 'comentario']
            }
        }
    }
});

Herramienta.belongsTo(Factura);
Herramienta.belongsTo(TipoHerramienta);
Herramienta.belongsTo(ClienteContacto);

export default Herramienta;