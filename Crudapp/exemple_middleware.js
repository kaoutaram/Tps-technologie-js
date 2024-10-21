const express = require('express');
const app = express();
const PORT = 3000;
//exemple1:Logger Middleware 
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();  
});
app.get('/', (req, res) => {
  res.send('Page d\'accueil');
});
app.get('/about', (req, res) => {
  res.send('À propos');
});
//exemple2:Authentification Middleware
app.use((req, res, next) => {
    req.isAuthenticated = () => {
      return false; 
    };
    next();
  });
  app.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(403).send('Non autorisé');
    }
    next(); 
  });
  
  app.get('/private', (req, res) => {
    res.send('Page privée accessible uniquement aux utilisateurs authentifiés');
  });
  
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
