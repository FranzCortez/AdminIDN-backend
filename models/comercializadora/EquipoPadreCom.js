import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const EquipPadreCom = db.define('equipoPadreCom', {

    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

export default EquipPadreCom;