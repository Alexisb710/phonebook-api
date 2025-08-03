const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = 8000;

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return String(Math.floor(Math.random() * 1000 + 5));
};

/*****************
    POST
*****************/
// to access the data that is sent, we need the Express json-parser that we
// can use with app.use(express.json())

// MIDDLEWARE //////////
// custom morgan token
morgan.token("data", function (req) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
// app.use(morgan(":data"));
// combine the output of tiny with data so it can show in one line:
// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :data")
// );

///////////////////////

app.post("/api/persons", (req, res) => {
  // let body = req.body;
  let { name, number } = req.body;
  // optional chaining to trim whitespace
  name = name?.trim();
  number = number?.trim();

  // check if name property is missing
  if (!name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
  // check if number property is missing
  if (!number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  // check if duplicate names
  if (
    phonebook.find((person) => person.name.toLowerCase() === name.toLowerCase())
  ) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(), // the function can produce duplicates eventually. Solution in future
    name,
    number,
  };

  phonebook = phonebook.concat(person);

  res.json(person);
});

/*****************
    GET
*****************/
app.get("/", (req, res) => {
  res.send(`<h2>Hello, to use this phonebook api use/append the following to the URL:</h2>
            <strong>/api/persons</strong> -> to show the list of all persons in the phonebook<br>
            <strong>/api/persons/:id</strong> -> to show information about a specific person by id<br>
            <strong>/api/persons/:name</strong> -> to show information about a specific person by name<br>
            <strong>/info</strong> -> to get general information about the phonebook api`);
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

// Getting a single phonebook entry by id
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === id);

  // If an entry for the given id is not found, the server has to respond with a status 404
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Getting a single phonebook entry by name
app.get("/api/persons/:name", (req, res) => {
  const personName = decodeURIComponent(req.params.name).toLowerCase();
  const person = phonebook.find(
    (person) => person.name.toLowerCase() === personName
  );

  // If an entry for the given name is not found, the server has to respond with a status 404
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  // using <br> to define a line break Express will set the default header
  // to 'text/html'. If you want to use the newline char, then you need to
  // set the Content-Type to text/plain with res.set('Content-Type', 'text/plain')
  res.send(
    `Phonebook has info for ${phonebook.length} people<br> ${new Date()}`
  );
});

/*****************
    DELETE
*****************/
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);

  // If the deletion succeeded, all we should return is a 204 status code
  res.status(204).end();
});

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server is running on port ${PORT}...`)
);
