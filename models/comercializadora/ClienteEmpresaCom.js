import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const ClienteEmpresaCom = db.define( 'clienteEmpresaCom', {
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
        defaultValue: true
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

export default ClienteEmpresaCom;