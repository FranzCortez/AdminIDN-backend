import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Herramienta from "./Herramienta.js";

const Preinforme = db.define('preinforme',{

    falla: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tecnico: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    timestamps: false,
    scopes: {
        falla: {
            attributes: {
                exclude: ['tecnico']
            }
        },
        tecnico: {
            attributes: {
                exclude: ['falla']
            }
        }
    }
});

Preinforme.belongsTo(Herramienta);

export default Preinforme;