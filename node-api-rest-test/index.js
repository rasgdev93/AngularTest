const express = require("express");
const app = express();
var cors = require('cors');
const cron = require('node-cron');
app.use(cors())
const bodyParser = require('body-parser');
const Request = require("request"); 
var MongoClient = require('mongodb').MongoClient


  var whitelist = ['http://localhost:4200', 'http://localhost:4400']
  var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }
    } else {
      corsOptions = { origin: false }
    }
    callback(null, corsOptions)
  }

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/add',cors(corsOptionsDelegate), function(req, res, next) {
    Request.get("https://hn.algolia.com/api/v1/search_by_date?query=nodejs", (findErr, response, body) => {
        if (findErr) throw findErr;
         var bodyJson = JSON.parse(body)
         MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true , useUnifiedTopology: true }, (err, db) => {
            if (err) throw err;
            var dbo = db.db("nodeDB");
            dbo.collection('news').insertMany(bodyJson["hits"], function (findErr, result) {
                if (findErr) throw findErr;
                res.status(200).send('ok');
                db.close();
            });
        });
    });
});

    var getDataTask = cron.schedule('0 */1 * * *', () => {
        Request.get("https://hn.algolia.com/api/v1/search_by_date?query=nodejs", (findErr, response, body) => {
                if (findErr) throw findErr;
                 var bodyJson = JSON.parse(body)
                 MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true , useUnifiedTopology: true }, (err, db) => {
                    if (err) throw err;
                    var dbo = db.db("nodeDB");
                    dbo.collection('news').insertMany(bodyJson["hits"], function (findErr, result) {
                        if (findErr) throw findErr;
                        res.status(200).send(result);
                        db.close();
                    });
                });
            });
        });
    
    app.get('/news',cors(corsOptionsDelegate), function(req, res, next) {
        MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true , useUnifiedTopology: true }, (err, db) => {
            if (err) throw err;
            var dbo = db.db("nodeDB");
            var sortByDate = { created_at: -1 };
            dbo.collection("news").find().sort(sortByDate).toArray(function(err, result) {
                if (err) throw err;
                res.status(200).send(result);
            });
        });
    });

    app.post('/delete', cors(corsOptionsDelegate), function(req, res, next) {
        MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true , useUnifiedTopology: true }, (err, db) => {
          if(err) throw res.status(400).send("error bd")
          var dbo = db.db('nodeDB');
          dbo.collection('news').findOneAndDelete({story_id:req.body.id},(err,data)=>{
            if(err) throw res.status(400).send('error bd')
            res.status(200).send(data)  
            db.close()
          });
        });
      });

    app.listen(3000, () => {
        console.log("El servidor está inicializado en el puerto 3000");
        getDataTask.start();
    });