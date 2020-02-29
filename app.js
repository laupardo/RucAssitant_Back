/**
 * La dependencia de express
 */
const express = require("express");
/**
 * Middleware que nos permite ver las peticiones REST
 */
//const morgan = require("morgan");
/**
 * Sistema de plantillas utilziado
 */
const engine = require("ejs-mate");

/**
 * Passport para la identificación
 */
const passport = require("passport");

/**
 * Importamos passport para que la aplicación lo conozca
 */

const flash = require("connect-flash");
/**
 * Este modulo nos permite manejar sesiones desde nodejs
 */
const session = require("express-session");
/**
 * Variable que contendrá el puerto donde se deplegará la aplicación
 * Para evitar confliictos con Heroku u otras aplicaciones de despliegue
 * Primero se valida la existencia de la constante global sino se va al puerto 3000
 */
const port = process.env.PORT || 3000;
/**
 * ----Routes-----
 */
const indexRouter = require("./routes/index");
const botiquinRouter = require("./routes/botiquin.js");
const revisionRouter = require("./routes/revision");
const authenticationRouter = require("./routes/authentication");

const bodyParser = require("body-parser");
/**
 * Nos permite obtener parámetros enviados por el path
 */
const path = require("path");

/**
 * Dependencia al archivo que hace todo el manejo de la base de datos
 */
const { init } = require("./db");

/**
 * Inicialización de la aplicación
 */
const app = express();

//Middlewares

/**
 * Este middleware nos permite ver las peticiones REST en consola
 * es especialmente útil para la etapa de desarrollo
 */
//app.use(morgan("dev"));

/**
 * Esta configuración nos permite recibir los datos desde el cliente
 * Recibe un objeto con los atributos a modificar. En este caso el extended
 * en false nos indica que no recibiremos archivos pesados como imagenes o documentos
 */
app.use(express.urlencoded({ extended: false }));

app.use(flash());
/**
 * Le decimos a la aplicación que usará el modulo que nos permite manejar sesiones
 */
app.use(
  session({
    secret: "rucBackSession",
    resave: false,
    saveUninitialized: false,
  }),
);

/**
 * Este método se encarga de inicializar passport para poder usarlo
 */
app.use(passport.initialize());
/**
 * Esto nos permite manejar sesiones desde passport
 */
app.use(passport.session());

require("./config/passport/local-auth");
//Settings
/**
 * Esta linea nos permite decirle a express donde están los views que tiene que renderizar
 */
app.set("views", path.join(__dirname, "public", "views"));
/**
 * Le configuramos el sistema de plantillas que vamos a utilizar
 */
app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

/**
 * Se configuran los paths de la aplicación
 */
app.use("/", indexRouter);
app.use("/botiquin", botiquinRouter);
app.use("/revision", revisionRouter);
app.use("/authentication", authenticationRouter);

init().then(() => {
  app.listen(port, function() {});
});

module.exports = app;
