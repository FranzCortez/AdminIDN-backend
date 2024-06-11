import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import EdpCom from "./EdpCom.js";
import IngresoCom from "./IngresoCom.js";

const IngresoEdpCom = db.define('ingresoEdpCom', {
});

IngresoEdpCom.belongsTo(IngresoCom, {foreignKey: 'ingresoComId'});
IngresoEdpCom.belongsTo(EdpCom, {foreignKey: 'edpComId'});

export default IngresoEdpCom;