import { DataTypes } from "sequelize";
import db from "../config/db.js";

const TipoHerramienta = db.define('tipoHerramienta', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    recomendacion: {
        type: DataTypes.TEXT,
        defaultValue: ''
    }
}, {
    timestamps: false,
    scopes: {
        soloNombre: {
            attributes: {
                exclude: ['descripcion', 'recomendacion']
            }
        }
    }
})

export default TipoHerramienta;