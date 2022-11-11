import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Herramienta from "./Herramienta.js";

const Qr = db.define('qr', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mantencion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    timestamps: false
});

Qr.belongsTo(Herramienta);

export default Qr;