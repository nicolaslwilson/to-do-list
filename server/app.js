var express = require('express');
var app = express();
app.set("port", 5000);

app.use(express.static("server/public"));

app.listen(app.get("port"), function () {
  console.log("Listening on port", app.get("port"));
});
