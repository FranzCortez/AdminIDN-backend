import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const Proveedor = db.define('proveedorCom', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: true
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: true
    }
}, {
    timestamps: false
});

export default Proveedor;