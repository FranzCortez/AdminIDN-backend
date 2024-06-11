import { DataTypes } from "sequelize";
import db from "../../config/db.js";
import ProveedorContactoCom from "./ProveedorContactoCom.js";
import IngresoCom from "./IngresoCom.js";

const ProveedorIngresoCom = db.define('proveedorIngresoCom', {
});

ProveedorIngresoCom.belongsTo(IngresoCom, {foreignKey: 'ingresoComId'});
ProveedorIngresoCom.belongsTo(ProveedorContactoCom, {foreignKey: 'proveedorContactoComId'});

export default ProveedorIngresoCom;