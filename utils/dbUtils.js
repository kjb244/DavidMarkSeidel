'use strict';

const bcrypt = require('bcrypt');
const localLogin = !(process.env.PASSWORD || '').length;
const pg = require('pg');
const conStringLocal = "postgres://postgres:root@localhost:5432/postgres";
let conString = process.env.DATABASE_URL || conStringLocal;
conString = conString.replace('postgres://','');
let config = {
    user: conString.split('/')[0].split(':')[0],
    database: conString.split('/')[1],
    password: conString.split('/')[0].split(':')[1].split('@')[0],
    host: conString.split('@')[1].split(':')[0],
    port: 5432,
    max: 10,
    idleTimeoutMillis: 3000,
    ssl: localLogin ? false: true
};



class dbUtils{

    authenticateUser(username, password){


        return new Promise(function(resolve, reject){
           if(localLogin){
               resolve();
           }
           else{
               bcrypt.compare(password, process.env.PASSWORD, function(err, res) {
                   if(res === true){
                       resolve();
                   }
                   else{
                       reject();
                   }
               });

           }
        });


    }

    runInsertUpdate(sql, parms = []) {
        return new Promise(function (resolve, reject) {
            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query(sql, parms, function (err, res) {
                    done();
                    if (err) {
                        console.log(`error runInsertUpdate with error ${err}`);
                        reject();
                    }
                    else {
                        resolve();
                    }

                });
            });
        });
    };

    smsCountMonth(){
        const self = this;
        return new Promise(function(resolve, reject){
            const selectQuery = "select count(*) cnt from sms_count where to_char(curr_date_time, 'yyyymm') = to_char(now(), 'yyyymm')";
            const insertQuery = 'insert into sms_count (curr_date_time) values (now())';

            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query(selectQuery, [], function (err, res) {
                    done();
                    if (err) {
                        console.log(`error smsCount with error ${err}`);
                        reject();
                    }
                    else{
                        const rows = res.rows;
                        const cnt = rows[0].cnt;

                        console.log(`success smsCount with count ${cnt}`);
                        let prom;
                        prom = self.runInsertUpdate(insertQuery);

                        prom.then(function(){
                            resolve(cnt);
                        }).catch(function(){
                            reject();
                        });

                    }

                });
            });


        });
    };

    emailCount(){
        const self = this;
        return new Promise(function(resolve, reject){
            const selectQuery = 'select coalesce(sum(count),0) cnt from email_count where curr_date = current_date';
            const insertQuery = 'insert into email_count (count) values (1)';
            const updateQuery = 'update email_count set count = count + 1 where curr_date = current_date';

            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query(selectQuery, [], function (err, res) {
                    done();
                    if (err) {
                        console.log(`error emailCount with error ${err}`);
                        reject();
                    }
                    else{
                        const rows = res.rows;
                        const cnt = rows[0].cnt;

                        console.log(`success emailCount with count ${cnt}`);
                        let prom;
                        if(cnt == 0){
                            prom = self.runInsertUpdate(insertQuery);
                        }
                        else{
                            prom = self.runInsertUpdate(updateQuery);
                        }
                        prom.then(function(){
                            resolve(cnt);
                        }).catch(function(){
                            reject();
                        });

                    }

                });
            });


        });
    };


    updateKeyByValue(key, value){
        key = key || '';
        return new Promise(function(resolve, reject){
            if(typeof value !== 'string'){
                reject();
            }
            console.log(`attempting to run updateKeyByValue for key ${key}`);

            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query(`update key_value_storage set value = $1 where key = $2`, [value, key], function (err, res) {
                    done();
                    if (err) {
                        console.log(`error updatingKeyByValue with error ${err}`);
                        reject();
                    }
                    else{
                        console.log(`success updatingKeyByValue with row count ${res.rowCount}`);
                        resolve(res.rowCount);
                    }

                });
            });

        });
    };

    getValue(key){
        key = key || '';
        return new Promise(function(resolve, reject) {
            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {
                client.query('select value from key_value_storage where key = $1', [key], function (err, res) {
                    done();
                    if (err) {
                        reject();
                    } else {
                        const rows = res.rows;
                        const node = rows[0].value.replace(/''/g,"'");
                        resolve(node);
                    }
                });
            });
        })
    };

    getLocalCache(){
        return new Promise(function(resolve, reject){
            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {
                client.query('select prop_key, prop_value from local_db_props', function (err, res) {
                    done();
                    if (err) {
                        reject();
                    } else {
                        const rows = res.rows || [];
                        const rtnObj = rows.reduce(function(accum, e){
                            accum[e.prop_key] = e.prop_value;
                            return accum;
                        },{});
                        resolve(rtnObj);
                    }
                });
            });
        })
    };




}


const dbUtilObj = new dbUtils();

module.exports = dbUtilObj;


