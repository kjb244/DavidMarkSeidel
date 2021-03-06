'use strict';

const dbutils = require('./dbUtils.js');

const localLogin = !(process.env.SENDGRID_API_KEY || '').length;

class emailUtils{

    sendEmail(from, to, subject, bodyHtml){
        return new Promise((resolve, reject) => {
            if (localLogin) return resolve();
            const emailCountDay = dbutils.emailCount();
            emailCountDay.then(function(payload){
                console.log(payload);
                if(payload < 30){
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

    sendEmailContact(name, email, phone, comments, checkboxModel){
        comments = (comments || '').substr(0,6000);

        const checkboxModelStr = (checkboxModel || []).map((e) => {
           return `${e.name}: ${e.value === false ? 'unchecked': 'checked'}<br>`;
        }).join('');

        const htmlString = `<div><b>Name:</b> ${name}<br><br><b>Email:</b> ${email}<br><br><b>Phone:</b> ${phone}<br><br><b>Checkboxes:</b><br>${checkboxModelStr}<br><b>Comments:</b> ${comments}</div>`;

        return this.sendEmail(
                'weddingadmin@dms.com',
                process.env.EMAIL_TO,
                `Wedding Contact ${name}`,
                htmlString
            ) ;


    }


}

const emailUtilsObj = new emailUtils();
module.exports = emailUtilsObj;