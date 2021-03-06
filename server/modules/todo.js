var express = require('express');
var pg = require('pg');
var router = express.Router();

//config object configures connection to database
var config = {
  database: 'chi', // name of database
  host: 'localhost', // where is your database
  port: '5432', // port for the database
  max: 10, // how many connections are allowed simultaneously
  idleTimeoutMilli: 30000 // 30 seconds to try to connect
};

var pool = new pg.Pool(config);

router.get('/', function (req, res) {
  // console.log('get /todo');
  pool.connect(function (errorConnectingToDatabase, db, done) {
    if(errorConnectingToDatabase) {
      console.log("Error connecting to the database.\n", errorConnectingToDatabase);
      res.sendStatus(500);
    }
    else {
      //Get All To Do Items, sort uncomplete tasks first
      db.query('SELECT * FROM "todoitems" ORDER BY "complete" ASC, "id" ASC;',
        function (queryError, result) {
          done(); //releases connection to pool
          if (queryError) {
            console.log("Error making query.\n", queryError);
            res.sendStatus(500);
          } else {
            // console.log(result);
            res.send(result.rows);
          }
        }
      );
    }
  });
});

router.delete('/delete/:id', function (req, res) {
  var id = req.params.id;
  // console.log('delete /todo/delete', id);
  pool.connect(function (errorConnectingToDatabase, db, done) {
    if(errorConnectingToDatabase) {
      console.log("Error connecting to the database.\n", errorConnectingToDatabase);
      res.sendStatus(500);
    }
    else {
      //Delete to do item with corresponding ID
      db.query('DELETE FROM "todoitems" WHERE "id" =$1 RETURNING "id", "text", "complete";',
        [id],
        function (queryError, result) {
          done(); //releases connection to pool
          if (queryError) {
            console.log("Error making query.\n", queryError);
            res.sendStatus(500);
          } else {
            // console.log(result);
            res.send(result);
          }
        }
      );
    }
  });
});

router.post('/add', function (req, res) {
  // console.log('in /todo/add', req.body);
  var toDoItem = req.body.toDoItem;
  pool.connect(function (errorConnectingToDatabase, db, done) {
    if(errorConnectingToDatabase) {
      console.log("Error connecting to the database.\n", errorConnectingToDatabase);
      res.sendStatus(500);
    }
    else {
      //Insert a new to do item with a complete value of false
      db.query('INSERT INTO "todoitems" ("text", "complete") VALUES ($1,$2) RETURNING "id", "text", "complete";',
        [toDoItem, false],
        function (queryError, result) {
          done(); //releases connection to pool
          if (queryError) {
            console.log("Error making query.\n", queryError);
            res.sendStatus(500);
          } else {
            // console.log(result);
            res.send(result);
          }
        }
      );
    }
  });
});

router.put('/complete', function (req, res) {
  // console.log('in /todo/complete', req.body);
  var id = req.body.id;
  pool.connect(function (errorConnectingToDatabase, db, done) {
    if(errorConnectingToDatabase) {
      console.log("Error connecting to the database.\n", errorConnectingToDatabase);
      res.sendStatus(500);
    }
    else {
      //Toggle complete status
      db.query('UPDATE "todoitems" SET "complete" = NOT "complete" WHERE "id" = $1 RETURNING "id", "text", "complete";',
        [id],
        function (queryError, result) {
          done(); //releases connection to pool
          if (queryError) {
            console.log("Error making query.\n", queryError);
            res.sendStatus(500);
          } else {
            // console.log(result);
            res.send(result);
          }
        }
      );
    }
  });
});

module.exports = router;
