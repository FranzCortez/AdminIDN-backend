import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Herramienta from "./Herramienta.js";

const FotoGaleria = db.define('fotogaleria', {
    archivos: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

FotoGaleria.belongsTo(Herramienta);

export default FotoGaleria;