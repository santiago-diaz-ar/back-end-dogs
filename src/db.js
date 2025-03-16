require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;


/* const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
); */

/* const sequelize = new Sequelize(
    `postgresql://dogs_rnkr_user:0cUYo1VRvXatD06UF9XhPI597r3EpLgB@dpg-cv1qqqd2ng1s738jvgp0-a.oregon-postgres.render.com/dogs_rnkr`,
    {  
      logging: false,  
      native: false,  
      dialectOptions: {  
        ssl: {  
          require: true,  
          rejectUnauthorized: false // Esto puede ser necesario en algunos entornos de nube.  
        }  
      },  
    }  
); */

const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs_rnkr`,
    {
        logging: false,
        native: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: { // Agrega o modifica el objeto pool
            acquire: 90000, // 60 segundos (o más si es necesario)
            max: 10, // Ajusta según tus necesidades
            min: 0,
            idle: 10000
        }
    }
);


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Dogs, Temperaments } = sequelize.models;

// Aca vendrian las relaciones
Dogs.belongsToMany(Temperaments, { through: "dogs_temperaments" }); // relacion de muchos a muchos
Temperaments.belongsToMany(Dogs, { through: "dogs_temperaments" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
