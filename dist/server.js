var express = require('express');
var app = express();

//Set port to use
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist'));

// Always send index.html
function sendIndex(req, res, next) {
  res.sendFile('index.html', { root: __dirname + "/dist/"});
}

app.all('/*', sendIndex);
  
app.listen(port, function(){
  console.log(__dirname);
  console.log("Server running on " + port);
});