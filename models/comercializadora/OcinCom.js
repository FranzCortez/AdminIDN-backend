import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const OcinCom = db.define('ocinCom', {
    ocin: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true
    },
});

export default OcinCom;