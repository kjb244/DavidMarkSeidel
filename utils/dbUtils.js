'use strict';

const pg = require('pg');
const conStringLocal = "postgres://postgres:sdf!@localhost:5432/wedding";
const conString = process.env.DATABASE_URL || conStringLocal;
let client = null;


class dbUtils{


}


const dbUtilObj = new dbUtils();

module.exports = dbUtilObj;