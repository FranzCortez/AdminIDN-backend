import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./routes/publicRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import clienteEmpresaRoutes from "./routes/clienteEmpresaRoutes.js";
import clienteContactoRoutes from "./routes/clienteContactoRoutes.js";
import TipoHerramienta from "./routes/TipoHerramientaRoutes.js";
import db from "./config/db.js";

//App
const app = express();

// Carpeta publica
app.use(express.static('public'));

// Habilitar lectura de datos
app.use( bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json());

// Habilitar cors
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, cb) => {
        //console.log(origin);
        
        const existe = whitelist.some( dominio =>  dominio === origin);
        
        if( existe) {
            cb(null, true);
        } else {
            cb(new Error('No permitido por CORS'));
        }
    }
}
app.use(cors(corsOptions));

// Conexion DB
try {
    await db.authenticate();
    db.sync();
    console.log("Conexion a la base de datos");
} catch (error) {
    console.log(error);
}

// Routing
app.use('/api', publicRoutes);
app.use('/api/cuentas', usuarioRoutes);
app.use('/api/empresas', clienteEmpresaRoutes);
app.use('/api/contactos', clienteContactoRoutes);
app.use('/api/tipo', TipoHerramienta);

// Puerto
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

app.listen( port, host, () => {
    console.log(`Server corriendo en el puerto ${port}`);
});