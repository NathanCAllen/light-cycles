var json_string = '{"vehicles":[],"passengers":[]}'
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/index')
});


app.post('/submit', function(request, response){
	response.send(json_string)
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});