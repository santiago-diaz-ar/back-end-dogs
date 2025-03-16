const { Router } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dogsRouter = require("./dogsRouter");
const tempRouter = require("./temperamentsRouter");

const router = Router();

router.use(express.json()); // parceo todo a json
router.use(morgan("dev")); // morgan para que se vea sea mas legible en la consola
router.use(cors()); // cors es un mecanismo que permite a un servidor HTTP especificar qué dominios o aplicaciones externas tienen permiso para acceder a sus recursos en un navegador we

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/dogs", dogsRouter);
router.use("/temperaments", tempRouter);

module.exports = router;
