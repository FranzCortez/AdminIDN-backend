import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import ClienteEmpresa from "./ClienteEmpresa.js";

const Usuario = db.define('usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    hooks:{
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(12);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {
        eliminarPass: {
            attributes: {
                exclude: ['password', 'createdAt' , 'updatedAt']
            }
        }
    }
});


Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Usuario.belongsTo(ClienteEmpresa);

export default Usuario;