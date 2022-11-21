import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Herramienta from "./Herramienta.js";

const Archivos = db.define('archivos', {
    rutaInforme: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rutaCotizacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rutaFotoGaleria: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rutaCertificado: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    scopes: {
        informe: {
            attributes: {
                exclude: ['rutaCotizacion', 'rutaFotoGaleria', 'rutaCertificado']
            }
        },
        cotizacion: {
            attributes: {
                exclude: ['rutaInforme', 'rutaFotoGaleria', 'rutaCertificado']
            }
        },
        fotoGaleria: {
            attributes: {
                exclude: ['rutaCotizacion', 'rutaInforme', 'rutaCertificado']
            }
        },
        certificado: {
            attributes: {
                exclude: ['rutaCotizacion', 'rutaFotoGaleria', 'rutaInforme']
            }
        }
    }
});

Archivos.belongsTo(Herramienta);

export default Archivos;