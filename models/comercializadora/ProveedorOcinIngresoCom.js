import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import OcinCom from "./OcinCom.js";
import ProveedorContactoCom from "./ProveedorContactoCom.js";
import IngresoCom from "./IngresoCom.js";

const ProveedorOcinIngresoCom = db.define('proveedorOcinIngresoCom', {
});

ProveedorOcinIngresoCom.belongsTo(IngresoCom, {foreignKey: 'ingresoComId'});
ProveedorOcinIngresoCom.belongsTo(ProveedorContactoCom, {foreignKey: 'proveedorComId'});
ProveedorOcinIngresoCom.belongsTo(OcinCom, {foreignKey: 'ocinComId'});

export default ProveedorOcinIngresoCom;