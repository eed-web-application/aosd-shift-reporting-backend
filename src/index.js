const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3001

const reliability_model = require('./reliability_model.js')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 
  next();
});
app.get('/shiftdata', (req, res) => {
  //res.status(200).send('Hello World!');
  reliability_model
  .getShiftCal()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/shiftdata', (req,res) => {
  console.log("POSTing new Shift Calendar.");
  reliability_model
  .createShiftCal(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/shiftdata/:id', (req,res) => {
  console.log("DELETEing Shift Calendar.");
  reliability_model
  .deleteShiftCal(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/programdata', (req, res) => {
  reliability_model
  .getProgram()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/beamdest', (req, res) => {
  reliability_model
  .getBeamDest()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/beamdest', (req,res) => {
  console.log("ADDing new beam destination.");
  reliability_model
  .createBeamDest(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/beamdest/:id', (req,res) => {
  console.log("DELETEing beam destination.");
  reliability_model
  .deleteBeamDest(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/accelsystem', (req, res) => {
  reliability_model
  .getAccelSystem()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/accelsystem', (req,res) => {
  console.log("ADDing new Accel System.");
  reliability_model
  .createAccelSystem(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/accelsystem/:id', (req,res) => {
  console.log("DELETEing Accel System.");
  reliability_model
  .deleteAccelSystem(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})