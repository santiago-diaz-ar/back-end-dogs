require("dotenv").config();
const { API_KEY } = process.env;
const { Router } = require("express");
const axios = require("axios");
const { Dogs, Temperaments } = require("../db");

const rootRouter = Router();

const url = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;

const dogAllApi = async () => {
  const api = await axios.get(url);
  const apiDataInfo = api.data.map((dog) => {
    let temperArray = [];
    if (dog.temperament) {
      temperArray = dog.temperament.split(", "); //retorno el temper en un arr
    }
    let heightArr = [];
    if (dog.height.metric) {
      heightArr = dog.height.metric.split(" - ");
    }
    let weightArr = [];
    if (dog.weight.metric) {
      weightArr = dog.weight.metric.split(" - ");
    }
    return {
      id: dog.id,
      name: dog.name,
      height: heightArr,
      weight: weightArr,
      temperaments: temperArray,
      life_span: dog.life_span,
      image: dog.image.url,
    };
  });
  return apiDataInfo;
};

const dogAllDB = async () => {
  return await Dogs.findAll({
    include: {
      model: Temperaments,
      attributes: ["name"],
      /*  through: {
        attributes: [], //trae mediante los atributos del modelo
      }, */
    },
  });
};

const dogDbApi = async () => {
  const dogsDb = await dogAllDB();
  const recorro = dogsDb.map((e) => e.toJSON().id);
  console.log(recorro);

  const dogsApi = await dogAllApi();

  const dogsAllDbApi = [...dogsDb, ...dogsApi];
  return dogsAllDbApi;
};

//todo: LLAMADO A TODOS LOS DOGS O DOGS POR NOMBRE
rootRouter.get("/", async (req, res) => {
  //esta ruta la uso para dos rutas la de allDogs y la del name
  const { name } = req.query;
  const dogsAll = await dogDbApi();
  if (typeof name === "string" && name) {
    //todo: Busqueda por iniciales
    // const results = dogsAll.filter(
    //   (item) => item.name.toLowerCase().startsWith(name.toLowerCase()) // Filtrar elementos cuyo nombre comienza con la inicial de búsqueda (insensible a mayúsculas y minúsculas)
    // );
    // if (results.length) {
    //   return res.status(200).send(results);
    // } else {
    //   const unico = Math.random();
    //   return res.status(200).send([
    //     {
    //       id: unico,
    //       name: "No existe perro",
    //       height: ["Null"],
    //       weight: ["Null"],
    //       temperaments: ["Null"],
    //       life_span: "Null",
    //       image: "Null",
    //     },
    //   ]);
    // }
    //
    //todo: Busqueda por nombre exacto
    //   const dog = dogsAll.filter((dog) =>
    //   dog.name.toLowerCase().includes(name.toLowerCase())
    // );
    // if (dog.length) {
    //   return res.status(200).send(dog);
    // }
    //
    //todo:  Busqueda no exacta, sirve igual que la exacta y las por iniciales y por alguna letra igual en su texto
    const buscadorFunct = (name, dogsAll) => {
      //me permite buscar el name en minuscula o mayuscula, o si la busqueda no es exacta
      const regex = new RegExp(name, "i"); // busco no exacta
      return dogsAll.filter((dog) => regex.test(dog.name));
    };
    const buscador = buscadorFunct(name, dogsAll);
    //console.log(buscador);
    if (buscador.length) res.status(200).send(buscador);
    else {
      const unico = Math.random();
      return res.status(200).send([
        {
          id: unico,
          name: "No existe perro",
          height: ["Null"],
          weight: ["Null"],
          temperaments: ["Null"],
          life_span: "Null",
          image: "Null",
        },
      ]);
    }
  } else {
    return res.status(200).send(dogsAll);
  }
});

//todo: LLAMADO AL ID
rootRouter.get("/:idRaza", async (req, res) => {
  //trae un dog por su id
  const { idRaza } = req.params;
  const dogsAll = await dogDbApi();
  const dog = dogsAll.filter((dog) => dog.id == idRaza);
  if (dog.length) {
    return res.status(200).send(dog);
  } else {
    const unico = Math.random();
    return res.status(200).send([
      {
        id: unico,
        name: "No existe perro",
        height: ["Null"],
        weight: ["Null"],
        temperaments: ["Null"],
        life_span: "Null",
        image: "Null",
      },
    ]);
  }
});

//todo: CREAR PERRO
rootRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      max_height,
      min_height,
      max_weight,
      min_weight,
      life_span,
      temperaments,
      image,
    } = req.body;

    //todo: total altura
    const AllHeight = [];

    const parseo1 = parseInt(max_height);
    const parseo2 = parseInt(min_height);
    AllHeight.push(parseo1, parseo2);

    //total peso
    const AllWeight = [];
    const parseo3 = parseInt(max_weight);
    const parseo4 = parseInt(min_weight);
    AllWeight.push(parseo3, parseo4);
    //creacion del dog en la db.

    //paso a numero la esperanza de vida
    const parseo5 = parseInt(life_span);
    const dog = await Dogs.create({
      name,
      height: AllHeight,
      weight: AllWeight,
      life_span: parseo5,
      image: image
        ? image
        : "https://thumbs.dreamstime.com/b/línea-gruesa-de-icono-caricatura-animal-perro-con-cara-corta-dibujo-en-fondo-blanco-165171464.jpg",
    });

    const asociatedTemper = await Temperaments.findAll({
      where: {
        name: temperaments,
      },
    });

    dog.addTemperaments(asociatedTemper);

    if (dog) res.status(201).send("Raza creada con exito en la base de datos");
    //
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

//todo DELETE
rootRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const prueba = Dogs.destroy({
    where: {
      id: id,
    },
  });

  (await prueba) > 0 ? res.send("exito") : res.send("fallo");
});

module.exports = rootRouter;
