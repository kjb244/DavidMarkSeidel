'use strict';

const loggingUtil = require('./loggingUtil');
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
    idleTimeoutMillis: 3000
};
if(localLogin){
    config.ssl = false;
} else {
    config.ssl = { rejectUnauthorized: false};
}



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

    async runInsertUpdate(sql, parms = []) {
        return new Promise(async function (resolve, reject) {
            const client = new pg.Client(config);
            await client.connect();
            const res = await client.query(sql, parms);
            await client.end();
            resolve();
            });
        };

    async smsCountMonth(){
        const self = this;
        return new Promise(async function (resolve, reject) {
            const selectQuery = "select count(*) cnt from sms_count where to_char(curr_date_time, 'yyyymm') = to_char(now(), 'yyyymm')";
            const insertQuery = 'insert into sms_count (curr_date_time) values (now())';

            const client = new pg.Client(config);
            await client.connect();
            const res = await client.query(selectQuery, []);
            const rows = res.rows;
            const cnt = rows[0].cnt;
            loggingUtil.writeInfo('smsCountMonth',`success smsCount with count ${cnt}`);
            let prom;
            prom = self.runInsertUpdate(insertQuery);

            prom.then(async function () {
                await client.end();
                resolve(cnt);
            }).catch(async function () {
                await client.end();
                reject();
            });

        });
    };

    async emailCount(){
        const self = this;
        return new Promise(async function (resolve, reject) {
            const selectQuery = 'select coalesce(sum(count),0) cnt from email_count where curr_date = current_date';
            const insertQuery = 'insert into email_count (count) values (1)';
            const updateQuery = 'update email_count set count = count + 1 where curr_date = current_date';
            const client = new pg.Client(config);
            await client.connect();
            const res = await client.query(selectQuery, []);
            const rows = res.rows;
            const cnt = rows[0].cnt;
            loggingUtil.writeInfo('emailCount',`emailCount success with count ${cnt}`);
            let prom;
            if (cnt == 0) {
                prom = self.runInsertUpdate(insertQuery);
            } else {
                prom = self.runInsertUpdate(updateQuery);
            }
            prom.then(async function () {
                await client.end();

                resolve(cnt);
            }).catch(async function (e) {
                await client.end();
                loggingUtil.writeError('emailCount',`emailCount error`, JSON.stringify(e));
                reject();
            });

        });
    };


    async updateKeyByValue(key, value){
        key = key || '';
        return new Promise(async function (resolve, reject) {
            if (typeof value !== 'string') {
                reject();
            }
            const client = new pg.Client(config);
            loggingUtil.writeInfo('updateKeyByValue', `attempting to run updateKeyByValue for key ${key}`);

            await client.connect();
            const res = await client.query(`update key_value_storage set value = $1 where key = $2`, [value, key]);
            loggingUtil.writeInfo('updateKeyByValue', `success updatingKeyByValue with row count ${res.rowCount}`);

            await client.end();
            resolve(res.rowCount);
        });
    };

    async getValue(key){
        const client = new pg.Client(config);
        key = key || '';
        return new Promise(async function (resolve, reject) {
            await client.connect();
            const res = await client.query('select value from key_value_storage where key = $1', [key]);
            const rows = res.rows;
            const node = rows[0].value.replace(/''/g, "'");
            await client.end();
            resolve(node);
        })
    };

    async getLocalCache(){

        return new Promise(async function (resolve, reject) {
            const client = new pg.Client(config);

            try{

                await client.connect();
                const res = await client.query('select prop_key, prop_value from local_db_props', []);
                const rows = res.rows || [];
                const rtnObj = rows.reduce(function (accum, e) {
                    accum[e.prop_key] = e.prop_value;
                    return accum;
                }, {});
                await client.end();
                loggingUtil.writeInfo('getLocalCache', 'getLocalCache success')
                resolve(rtnObj);
            } catch(e){
                await client.end();
                loggingUtil.writeError('getLocalCache','getLocalCache error', JSON.stringify(e));
                reject();
            }

        })
    };




}


const dbUtilObj = new dbUtils();

module.exports = dbUtilObj;


