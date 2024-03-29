import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ClienteEmpresa = db.define('clienteEmpresa',{
    rut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        default: true
    }
}, {
    timestamps: false,
    scopes: {
        nombre: {
            attributes: {
                exclude: ['rut', 'razonSocial', 'direccion']
            }
        }
    }
});

export default ClienteEmpresa;