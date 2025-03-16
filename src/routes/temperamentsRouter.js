require("dotenv").config();
const { API_KEY } = process.env;
const { Router } = require("express");
const axios = require("axios");
const { Temperaments } = require("../db");

const rootRouter = Router();

const url = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;

rootRouter.get("/", async (req, res) => {
    try {
        // Obtener datos de la API
        const TemperApi = await axios.get(url);
        // Validar la respuesta de la API
        if (!TemperApi.data || !Array.isArray(TemperApi.data)) {
            return res.status(500).send("Error al obtener datos de la API");
        }
        // Procesar temperamentos
        const temperaments = TemperApi.data
            .map((dog) => dog.temperament)
            .filter(Boolean) // Eliminar temperamentos nulos o vacíos
            .join(",")
            .split(",")
            .map((t) => t.trim());
        // Guardar temperamentos en la base de datos
        const uniqueTemperaments = [...new Set(temperaments)]; // Eliminar duplicados
        await Promise.all(
            uniqueTemperaments.map((name) => Temperaments.findOrCreate({ where: { name } }))
        );
        // Obtener todos los temperamentos de la base de datos
        const Alltempers = await Temperaments.findAll();

        return res.status(200).send(Alltempers);
    } catch (error) {
        console.error("Error al procesar temperamentos:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

module.exports = rootRouter;


/* require("dotenv").config();
const { API_KEY } = process.env;
const { Router } = require("express"); // para definir rutas
// algunos veneficios de Router - Modularizar(mdulos separados) - Reutilizacion del codigo - Escalabilidad (dividir la logica)
const axios = require("axios"); // para hacer peticiones
const { Temperaments } = require("../db"); // me traigo en modelo

const rootRouter = Router();

const url = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;

rootRouter.get("/", async (req, res) => {
  const TemperApi = await axios.get(url);
  const Tempers = TemperApi.data.map((dog) => dog.temperament);
  const TemperArr = Tempers.toString().split(","); //convierto todo en string luego lo coloco en un arr
  //borro los temperamentos que no tengan nada
  const arreglo = TemperArr.filter((e) => e);
  arreglo.forEach((t) => {
    //trim quito espacion al final y comienzo del string
    const t2 = t.trim();
    //busco, si esta no creo, si no esta creo el temper en el modelo Temper
    Temperaments.findOrCreate({
      where: { name: t2 },
    });
  });

  const Alltempers = await Temperaments.findAll();

  return res.status(200).send(Alltempers);
});

module.exports = rootRouter;
 */