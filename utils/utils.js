'use strict';

const AWS = require('aws-sdk');
const dbutils = require('./dbUtils.js');
const request = require('request');
const memoryCache = require('memory-cache');

class Utils{

    isLocal(){
        return !(process.env.SENDGRID_API_KEY || '').length;
    }

    async sendSms(phone, textString){
        return new Promise(async (resolve, reject) => {
            if (this.isLocal()) {
                //return resolve();
            }
            const smsCountMonth = dbutils.smsCountMonth();
            smsCountMonth.then(function (payload) {
                console.log('about to make call to send sms')
                if (payload < 20) {
                    const countryCode = '+1';
                    const requestObj = {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Accepts': 'application/json'
                        },
                        url: `${process.env.BLOWERIO_URL || memoryCache.get('BLOWERIO_URL')}/messages`,
                        form: {
                            to: `${countryCode}${phone}`,
                            message: textString
                        }
                    };

                    request.post(requestObj, function (error, response, body) {
                        if (!error && response.statusCode == 201) {
                            console.log('SMS Message sent!');
                            resolve();
                        } else {
                            const apiResult = JSON.parse(body);
                            console.log('SMS Error was: ' + apiResult.message);
                            reject();
                        }
                    })
                } else {
                    console.log('Sms max capacity reached');
                    return resolve();
                }
            })
        });
    }


    async sendEmail(bodyHtml){
        return new Promise((resolve, reject) => {
            const emailCountDay = dbutils.emailCount();
            emailCountDay.then(async function (payload) {
                if (payload < 30) {
                    AWS.config.update({
                        region: 'us-east-1',
                        accessKeyId: process.env.SNS_ACCESS_KEY || memoryCache.get('SNS_ACCESS_KEY'),
                        secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY  || memoryCache.get('SNS_SECRET_ACCESS_KEY')
                    });
                    try {
                        const sns = new AWS.SNS();
                        const params = {
                            Message: bodyHtml,
                            Subject: 'Wedding Officiant Lead',
                            TopicArn: process.env.SNS_EMAIL_TOPIC_ARN || memoryCache.get('SNS_EMAIL_TOPIC_ARN')
                        };
                        await sns.publish(params).promise();
                        console.log(`email call successful`);
                        resolve();
                    } catch (e) {
                        console.log(`email call error`, e)
                        reject();
                    }

                }

            })

        });

    }

    async sendSmsContact (name, email, phone, comments, checkboxModel){

        const checkboxModelStr = (checkboxModel || []).reduce((accum, e) => {
            if (e.value === true) {
                accum.push(`${e.name}: ${e.value}, `);
            }
            return accum;
        }, []).join('').slice(0,-2);

        const commentsSanitized = comments.replace(/[^\w\s]/g,'');

        const smsString = `Wedding Officiant Lead\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCheckboxes: ${checkboxModelStr}\nComments: ${commentsSanitized || 'none'}`
            .trim().substr(0,160);


        return this.sendSms(
          process.env.DAVID_SEIDEL_PHONE || memoryCache.get('DAVID_SEIDEL_PHONE'),
          smsString
        );
    }

    sendEmailContact(name, email, phone, comments, checkboxModel){
        comments = (comments || '').substr(0,6000);

        const checkboxModelStr = (checkboxModel || []).reduce((accum, e) => {
            if (e.value === true){
                accum += `${e.name}: ${e.value}<br>`
            }
            return accum;
        },'').slice(0,-4);


        const htmlString = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCheckboxes: ${checkboxModelStr}\nComments: ${comments}`;

        return this.sendEmail(htmlString) ;


    }


}

const ut = new Utils();
module.exports = ut;