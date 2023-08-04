import { DataTypes } from "sequelize";
import db from "../config/db.js";

const CheckList = db.define('checkList', {

    titulo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prioridad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    de: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaSolicitud: {
        type: DataTypes.DATE,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaRespuesta: {
        type: DataTypes.DATE,
        allowNull: true
    },
    version: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

export default CheckList;