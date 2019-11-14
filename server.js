require('./bot.js');
// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/github', function(req, res) {
  res.redirect(process.env.GITHUB)
});

app.get('/favicon', async function(req, res) {
  var host = req.query.host;
  var port = req.query.port;
  var Favicons = require('./bot.js').Favicons
  var data = await Favicons.findOne({ where: { host: host } });
  data = data.favicon
  //data = data.replace(/^data:image\/png;base64,/, '');
  
  fs.writeFile(__dirname + '/favicon.png', data, 'base64', function(err) {
    if (err) throw err;
    res.sendFile(__dirname + '/favicon.png');
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
