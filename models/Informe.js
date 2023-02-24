import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Herramienta from "./Herramienta.js";

const Informe = db.define('informe', {
    nombreCliente : {
        type: DataTypes.STRING
    },
    fechaEvaluacion: {
        type: DataTypes.DATEONLY
    },
    fechaCotizacion: {
        type: DataTypes.DATEONLY
    },
    condiciones: {
        type: DataTypes.STRING
    },
    plazoEntrega: {
        type: DataTypes.STRING
    },
    garantia: {
        type: DataTypes.STRING
    },
    gastos: {
        type: DataTypes.STRING
    },
    contenido: {
        type: DataTypes.JSON
    },
    descuento: {
        type: DataTypes.INTEGER
    },
    tecnico: {
        type: DataTypes.STRING
    },
    fechaInfo: {
        type: DataTypes.DATEONLY
    },
    falla: {
        type: DataTypes.STRING
    },
    cuadroA: {
        type: DataTypes.JSON
    },
    cuadroB : {
        type: DataTypes.JSON
    },
    fallaText: {
        type: DataTypes.TEXT
    },
    conclusion: {
        type: DataTypes.TEXT
    },
    recomendacion: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,
    scopes: {
        conclusion : {
            attributes: {
                exclude: ['fechaEvaluacion', 'fechaCotizacion', 'condiciones', 'plazoEntrega', 'garantia', 'gastos', 'contenido', 'descuento', 'tecnico', 'fechaInfo', 'falla', 'cuadroA', 'cuadroB', 'fallaText', 'recomendacion']
            }
        }
    }
});

Informe.belongsTo(Herramienta);

export default Informe;