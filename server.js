const express = require("express");
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
/*****************
      GET
*****************/
app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

// Getting a single phonebook entry
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

app.get("/info", (req, res) => {
  // using <br> to define a line break Express will set the default header
  // to text/html. If you want to use the newline char, then you need to
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
