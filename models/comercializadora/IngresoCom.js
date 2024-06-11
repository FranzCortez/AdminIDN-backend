import { DataTypes } from "sequelize";
import db from "../../config/db.js";

import ClienteContactoCom from "./ClienteContactoCom.js";
import Usuario from "../Usuario.js";

const IngresoCom = db.define('ingresoCom', {
    ovin: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    numeroGuiaDespacho: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaGuiaDespacho: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    numeroOrdenCompra: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaOrdenCompra: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    statusOrdenCompra: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    proveedor: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    edp: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ocin: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
});

IngresoCom.belongsTo(ClienteContactoCom, {foreignKey: 'clienteComId'});
IngresoCom.belongsTo(Usuario, {foreignKey: 'usuarioId'});

export default IngresoCom;