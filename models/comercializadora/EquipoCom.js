import { DataTypes } from "sequelize";
import db from "../../config/db.js";

import ClienteEmpresaCom from "./ClienteEmpresaCom.js";

const EquipoCom = db.define('equipoCom', {

    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    valor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    urlImagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    urlQr: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    scopes: {
        informe: {
            soloNombre: {
                exclude: ['marca', 'modelo', 'descripcion', 'stock', 'valor', 'urlImagen', 'urlQr', 'ClienteEmpresaComId']
            }
        },
    }
});

EquipoCom.belongsTo(ClienteEmpresaCom);

export default EquipoCom;