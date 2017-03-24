//npm modules
var express = require('express');
var bodyParser = require('body-parser');

//myRoutes
var toDo = require('./modules/toDo.js');

//Create my server & set port.
var app = express();
app.set("port", 5000);

app.use(express.static("server/public"));
app.use(bodyParser({extended: true}));
app.use('/todo', toDo);

app.listen(app.get("port"), function () {
  console.log("Listening on port", app.get("port"));
});
