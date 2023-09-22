import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import ClienteEmpresaCom from "./ClienteEmpresaCom.js";

const ClienteContactoCom = db.define('clienteContactoCom', {
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

ClienteContactoCom.belongsTo(ClienteEmpresaCom);

export default ClienteContactoCom;