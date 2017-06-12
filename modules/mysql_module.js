'use strict';
const mysql = require('mysql');
const con_data = require('../con_data.json');

// records per page
const rpp = 50;

let connection = mysql.createConnection(con_data);

let last_run = {};

let select_query =
    `select flist.title, flist.description, flist.category, film.release_year, lang.name as language, flist.length, flist.rating, flist.actors 
    from film
    inner join nicer_but_slower_film_list as flist on film.film_id = flist.FID
    inner join language as lang on lang.language_id = film.language_id where `;

let count_query =
    `select count(film.film_id) as rowsnum 
    from film
    inner join nicer_but_slower_film_list as flist on film.film_id = flist.FID
    inner join language as lang on lang.language_id = film.language_id where `;

exports.init = () => {

}

exports.search = (query, callback) => {
    if (typeof query.page !== 'undefined') {
        handlePaging(query.page, callback);
    } else {
        handleFirst(query, callback);
    }
}

exports.list = (list, callback) => {
    let query = '';
    switch (list) {
        case 'categories':
            query = 'select distinct category.name as name from category;';
            break;
        case 'languages':
            query = 'select distinct language.name as name from language;';
            break;
        case 'actors':
            query = 'select distinct concat(actor.first_name, \' \', actor.last_name) as name from actor;';
            break;
    }
    connection.query(query, function(error, results) {
        if (error) throw error;
        console.log(`${results.length} ${list} are selected`);
        return callback(results)
    });
}

function handlePaging(page, callback) {
    page = parseInt(page, 10);
    let limit = ` limit ${(page-1) * rpp},${rpp}`;
    connection.query(last_run.sql + limit, function(error, results, fields) {
        if (error) throw error;
        console.log(`${results.length} results are selected`);
        return callback(results)
    });
}

function handleFirst(params, callback) {
    let limit = ' limit ' + rpp;
    let cond = buildConditions(params);
    if (cond.where == '1') return callback({ results: [] });
    last_run = {};
    last_run.sql = connection.format(select_query + cond.where, cond.values);
    connection.query(count_query + cond.where, cond.values, function(error, results) {
        if (error) throw error;
        last_run.total_rows = results[0].rowsnum;
        last_run.pages = Math.ceil(last_run.total_rows / rpp);
        connection.query(select_query + cond.where + limit, cond.values, function(error, results, fields) {
            if (error) throw error;
            console.log(`${results.length} results are selected`);
            return callback({ results, pages: last_run.pages, total: last_run.total_rows })
        });
    });
}

function buildConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.title !== 'undefined' && params.title !== '') {
        conditions.push("flist.title LIKE ?");
        values.push(`%${params.title}%`);
    }

    if (typeof params.desc !== 'undefined' && params.desc !== '') {
        conditions.push("flist.description LIKE ?");
        values.push(`%${params.desc}%`);
    }

    if (typeof params.category !== 'undefined' && params.category !== '') {
        conditions.push("flist.category LIKE ?");
        values.push(`%${params.category}%`);
    }

    if (typeof params.actor !== 'undefined' && params.actor !== '') {
        conditions.push("flist.actors LIKE ?");
        values.push(`%${params.actor}%`);
    }

    if (typeof params.language !== 'undefined' && params.language !== '') {
        conditions.push("lang.name LIKE ?");
        values.push(`%${params.language}%`);
    }

    return {
        where: conditions.length ?
            conditions.join(' AND ') : '1',
        values: values
    };
}