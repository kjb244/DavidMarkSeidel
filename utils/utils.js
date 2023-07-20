'use strict';

const dbutils = require('./dbUtils.js');
const request = require('request');
const memoryCache = require('memory-cache');

class Utils{

    isLocal(){
        return !(process.env.SENDGRID_API_KEY || '').length;
    }

    sendSms(phone, textString){
        return new Promise((resolve, reject) => {
            if (this.isLocal()){
                return resolve();
            }
            const smsCountMonth = dbutils.smsCountMonth();
            smsCountMonth.then(function(payload) {
                console.log('about to make call to send sms')
                if (payload < 20){
                    const countryCode = '+1';
                    const requestObj = {
                        headers: {
                            'content-type' : 'application/x-www-form-urlencoded',
                            'Accepts': 'application/json'
                        },
                        url:  `${process.env.BLOWERIO_URL || memoryCache.get('BLOWERIO_URL')}/messages`,
                        form: {
                            to: `${countryCode}${phone}`,
                            message: textString
                        }
                    };

                    request.post(requestObj, function(error, response, body){
                        if (!error && response.statusCode == 201)  {
                            console.log('SMS Message sent!');
                            resolve();
                        } else {
                            const apiResult = JSON.parse(body);
                            console.log('SMS Error was: ' + apiResult.message);
                            reject();
                        }
                    })
                }
                else {
                    console.log('Sms max capacity reached');
                    return resolve();
                }

            })
        });
    }


    sendEmail(from, to, subject, bodyHtml){
        return new Promise((resolve, reject) => {
            const emailCountDay = dbutils.emailCount();
            emailCountDay.then(function(payload){
                if(payload < 30){
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY || memoryCache.get('SENDGRID_API_KEY'));
                    const msg = {
                        to: to,
                        from: from,
                        subject: subject,
                        html: bodyHtml
                    };
                    console.log(`about to make email call ${subject}`);
                    sgMail.send(msg).then(()=> {
                        console.log(`email call successful ${subject}`);
                        resolve();
                    }).catch((error) => {
                        console.log(`email call error ${error}`)
                        reject();
                    })
                }
                else{
                    reject();
                }

            })

        });

    }

    sendSmsContact (name, email, phone, comments, checkboxModel){

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


        const htmlString = `<div><b>Name:</b> ${name}<br><br>
                            <b>Email:</b> ${email}<br><br>
                            <b>Phone:</b> ${phone}<br><br>
                            <b>Checkboxes:</b><br>${checkboxModelStr}<br><br>
                            <b>Comments:</b> ${comments}</div>`;

        return this.sendEmail(
            process.env.EMAIL_TO || memoryCache.get('EMAIL_TO'),
                process.env.EMAIL_TO || memoryCache.get('EMAIL_TO'),
                `Wedding Contact ${name}`,
                htmlString
            ) ;


    }


}

const ut = new Utils();
module.exports = ut;