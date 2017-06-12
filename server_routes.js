'use strict';
let mysql = require('./modules/mysql_module');

function apiSearch(req, res) {
    const result = (data) => {
        res.json(data);
    }
    mysql.search(req.query, result);
}

function apiList(req, res) {
    const result = (data) => {
        res.json(data);
    }
    mysql.list(req.params.list, result);
}

module.exports = function(app) {

    app.route('/api/search')
        .get(apiSearch);

    app.route('/api/list/:list')
        .get(apiList);

    // app.route('/api/cars/:number')
    //     .get(carController.getCarById)
    //     .delete(carController.deleteCar);

    // route to handle all angular requests
    // app.get('*', function(req, res) {
    //     res.sendFile('index.html', { root: path.join(__dirname, '../Client') }); // load our public/index.html file
    // });
};