import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Efecto = db.define('efecto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false
    }
});

export default Efecto;