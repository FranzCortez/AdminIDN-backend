import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Factura from "./Factura.js";
import ClienteContacto from "./ClienteContacto.js";
import TipoHerramienta from "./TipoHerramienta.js";

const Herramienta = db.define('herramienta', {
    otin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    comentario: {
        type: DataTypes.TEXT,
        defaultValue: '-'
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroSerie: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    numeroInterno: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    numeroGuiaCliente: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    guiaDespacho: {
        type: DataTypes.STRING,
        defaultValue: '-'
    },
    fechaGuiaDespacho: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    salida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    archivoSalida: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    scopes: {
        filtro: {
            attributes: {
                exclude: ['descripcion', 'comentario', 'numeroGuiaCliente']
            }
        },
        otin: {
            attributes: {
                exclude: ['descripcion', 'comentario', 'numeroGuiaCliente', 'nombre', 'marca', 'modelo', 'numeroInterno', 'tipoHerramientumId', 'clienteContactoId', 'fecha', 'numeroSerie', 'facturaId']
            }
        },
        factura: {
            attributes: {
                exclude: ['descripcion', 'comentario', 'tipoHerramientumId']
            }
        }
    }
});

Herramienta.belongsTo(Factura);
Herramienta.belongsTo(TipoHerramienta, {foreignKey: 'tipoHerramientaId'});
Herramienta.belongsTo(ClienteContacto);

export default Herramienta;