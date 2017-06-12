'use strict';
let sql_service = require('./modules/mysql_module');

let query = {
    title: '',
    description: '',
    category: 'Horror',
    actor: '',
    language: ''
}
let params = {
    title: 'ACE'
}

sql_service.search(params);
console.log('finish');