//Set Up Express: run the server using app.listen
const express = require('express');
const app = express();
app.use(express.json());



//Create a POST Endpoint: This will allow us to add items to a local variable.
let items = [];

app.post('/items', (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).send(item);
});

//Create a GET Endpoint: This will allow us to retrieve all items.
app.get('/items', (req, res) => {
    res.send(items);
  });
// Create a GET Endpoint by ID: This will allow us to get a specific item.
  app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item non trouvé');
    res.send(item);
  });
//Create a PUT Endpoint: This will allow us to update an existing item.
app.put('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item non trouvé');
  
    item.name = req.body.name;
    res.send(item);
  });
//Create a DELETE Endpoint: This will allow us to delete an item.
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Item non trouvé');

  const deletedItem = items.splice(index, 1);
  res.send(deletedItem);
});


    

app.listen(3000, () => {
    console.log('Serveur lancé sur le port 3000');
  });