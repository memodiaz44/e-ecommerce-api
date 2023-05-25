const express = require("express");
const app = express();
const port = 5000;
const routes = require('./routes');

app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});