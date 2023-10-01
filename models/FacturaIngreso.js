// IMPORTANTE
/**
 * Esta tabla fue creada mucho tiempo despues de que el sistema estuviera en funcionamiento
 * y se dio la situacion que una OTIN podia tener mas de 1 factura (nuevo requerimiento)
 * se puede crear correctamente con sequelize con un belongsTo, pero como la BD ya esta poblada
 * es mas facil crear esta que partir de 0
 */

import { DataTypes } from "sequelize";
import db from "../config/db.js";

import Factura from "./Factura.js";
import Herramienta from "./Herramienta.js";

const FacturaIngreso = db.define('facturaingreso', {
    cantidadFactura: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

FacturaIngreso.belongsTo(Factura);
FacturaIngreso.belongsTo(Herramienta);

export default FacturaIngreso;