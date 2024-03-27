import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import Proveedor from "./ProveedorCom.js";

const ProveedorContactoCom = db.define('proveedorContactoCom', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

ProveedorContactoCom.belongsTo(Proveedor);

export default ProveedorContactoCom;