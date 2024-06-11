import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const EdpCom = db.define('edpCom', {
    codigo: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true
    },
});

export default EdpCom;