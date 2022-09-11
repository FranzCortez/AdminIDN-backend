import { DataTypes } from "sequelize";
import db from "../config/db.js";
import ClienteEmpresa from "./ClienteEmpresa.js";

const ClienteContacto = db.define('clienteContacto', {
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
}, {
    timestamps: false
});

ClienteContacto.belongsTo(ClienteEmpresa);

export default ClienteContacto;