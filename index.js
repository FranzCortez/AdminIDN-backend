import express from "express";

import publicRoutes from "./routes/publicRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

//App
const app = express();

// Habilitar lectura de datos
app.use( express.urlencoded({ extended: true }));

// Carpeta publica
app.use(express.static('public'));

// Conexion DB
try {
    await db.authenticate();
    db.sync();
    console.log("Conexion a la base de datos");
} catch (error) {
    console.log(error);
}

// Routing
app.use('/', publicRoutes);
app.use('/api/cuentas', usuarioRoutes);

// Puerto
const port = process.env.PORT || 5000;

app.listen( port, () => {
    console.log(`Server corriendo en el puerto ${port}`);
});