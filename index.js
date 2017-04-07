var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	respond.send("index.html")
});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});