import { DataTypes } from "sequelize";
import db from "../config/db.js";

const TipoHerramienta = db.define('tipoherramienta', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        defaultValue: ''
    }
}, {
    timestamps: false,
    scopes: {
        soloNombre: {
            attributes: {
                exclude: ['descripcion']
            }
        }
    }
})

export default TipoHerramienta;