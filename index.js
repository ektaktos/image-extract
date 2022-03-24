const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.get('/', (req, res) => {
  res.send('hello world');
});

// Wildcard to match unfound route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route does not exist' });
});

app.set('port', 5000);
app.listen(5000, () => {
  console.log(`Listening on ${config.port}`);
});

module.exports = { app };
