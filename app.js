'use strict';
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');

let sql_service = require('./modules/mysql_module');
var routes = require('./server_routes');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.use('/', express.static(path.join(__dirname, './')));

routes(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening to port ' + port)
});