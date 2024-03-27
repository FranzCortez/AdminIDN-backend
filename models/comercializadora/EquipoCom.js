import { DataTypes } from "sequelize";
import db from "../../config/db.js";

import ProveedorCom from './ProveedorCom.js';
import EquipPadreCom from "./EquipoPadreCom.js";

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
    codigo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numeroSerie: {
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
    tipo: {
        type: DataTypes.STRING,
        allowNull: true
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
                exclude: ['marca', 'modelo', 'descripcion', 'stock', 'valor', 'urlImagen', 'urlQr', 'equipoPadreComId', 'proveedorComId']
            }
        },
    }
});

EquipoCom.belongsTo(EquipPadreCom);
EquipoCom.belongsTo(ProveedorCom);

export default EquipoCom;