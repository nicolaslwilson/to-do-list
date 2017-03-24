var express = require('express');
var pg = require('pg');
var router = express.Router();

//config object configures connection to database
var config = {
  database: 'chi', // name of database
  host: 'localhost', // hwere is your database
  port: '5432', // port for the database
  max: 10, // how many connections are allowed simultaneously
  idleTimeoutMilli: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.post('/add', function (req, res) {
  console.log('in /todo/add', req.body);
  var toDoItem = req.body.toDoItem;
  pool.connect(function (errorConnectingToDatabase, db, done) {
    if(errorConnectingToDatabase) {
      console.log("Error connecting to the database.\n", errorConnectingToDatabase);//2nd param for educational use
      res.sendStatus(500);
    }
    else {
      //No error... then connected!
      //INSERT INTO "books" ("author", "title") VALUES ('Nic','Rules');
      db.query('INSERT INTO "todoitems" ("text", "complete") VALUES ($1,$2);',
        [toDoItem, false],
        function (queryError, result) {
          done(); //releases connection to pool
          if (queryError) {
            console.log("Error making query.\n", queryError); //2nd param for educational use
            res.sendStatus(500);
          } else {
            // console.log(result);
            res.sendStatus(201);
          }
        }
      );
    }
  });
});

module.exports = router;
