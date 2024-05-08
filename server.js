// Carga del módulo express
const express = require("express");
const app = express();

// Configuración del servidor para escuchar en el puerto 3000
app.listen(3000, () => console.log("Your app listening on port 3000"));

// Importación de las funciones desde el archivo 'functions.js'
const {
  HATEOAS,
  HATEOASV2,
  orderValues,
  joya,
  fieldsSelect,
  filtroCategory,
} = require("./functions");

// Ruta GET para obtener todas las joyas con HATEOAS
app.get("/api/v1/joyas", (req, res) => {
  res.send({
    joyas: HATEOAS(),
  });
});

// Ruta GET para obtener joyas con opciones de ordenamiento y paginación
app.get("/api/v2/joyas", (req, res) => {
  if (req.query.values == "asc") return res.send(orderValues("asc"));
  if (req.query.values == "desc") return res.send(orderValues("desc"));
  if (req.query.page) {
    const page = parseInt(req.query.page);
    const start = page * 2 - 2;
    const end = start + 2;
    return res.send({ joyas: HATEOASV2().slice(start, end) });
  }
  res.send({
    joyas: HATEOASV2(),
  });
});
//http://localhost:3000/api/v2/joyas?values=desc
//http://localhost:3000/api/v2/joyas?values=asc
//http://localhost:3000/api/v2/joyas?page=2

// Ruta GET para obtener una joya por su ID
app.get("/joya/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.send({
    joya: joya(id)[0],
  });
});
// http://localhost:3000/joya/3


// Ruta GET para obtener una joya por su ID con campos seleccionados
app.get("/api/v2/joya/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (req.query.fields)
    return res.send(fieldsSelect(joya(id)[0], req.query.fields));
  joya(id)[0]
    ? res.send({
        joya: joya(id)[0],
      })
    : res.send({
        error: "404 Not Found",
        message: "No existe una joya con ese ID",
      });
});
// /api/v2/joya/1?fields=name,category,value

// Ruta GET para obtener todas las joyas de una categoría
app.get("/api/v2/Category/:category", (req, res) => {
  const category = req.params.category;
  res.send({
    cant: filtroCategory(category).length,
    joyas: filtroCategory(category),
  });
});
// api/v2/Category/aros
