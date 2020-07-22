'use strict';
const cryptoRandomString = require('crypto-random-string');
const verify = require('../../controllers/authenticate')
const moment = require("moment")



module.exports = (app, db) => {

  const checkEmailInDB = async (email, voucher_name) => {
    return new Promise((resolve, reject) => {
      db.vouchers.findOne({
        where: {
          assigned_email: email,
          voucher_name: voucher_name
        }
      })
        .then((list) => {
          if (list === null) {
            resolve("invalid voucher")
          } else {
            resolve(list.dataValues)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }




  // GET one pet by id
  app.post('/vouchers/filter', (req, res) => {
    const {assigned_email,time,status}=req.body
    db.vouchers.find({
      where: { 
        assigned_email: assigned_email,
        status:status ||""
       }
    })
      .then(list => {
        res.json(list);
      });
  });

  // POST single pet
  app.post('/vouchers/create', verify.authenticateUser(), (req, res) => {
    const prefix = "VCD"
    const suffix = cryptoRandomString({ length: 10 })
    const voucher_name = prefix + suffix
    const voucher_pin = cryptoRandomString({ length: 5 })
    const body = {
      voucher_name,
      voucher_pin,
      status:active
    }
    db.vouchers.create(body)
      .then(list => {
        res.json(list);
      });
  });


  const updateVoucher = async (id, body) => {

    return new Promise((resolve, reject) => {
      db.vouchers.update(
        body,
        {
          where:
            { id: id },
          returning: true,
          raw: true
        })
        .then(list => {
          console.log(list, "in update")
          const data = list[1]
          resolve(data)
        })
        .catch(error => {
          reject(error)
          // Ooops, do some error-handling
        })
    })
  }



  app.post('/reedem', async (req, res) => {
    console.log("kkkk")
    const { voucher_name, assigned_email, voucher_pin } = req.body
    if (assigned_email) {
      const checkEmailExists = await checkEmailInDB(assigned_email, voucher_name)
      if (checkEmailExists) {
        const voucherCreatedDate = checkEmailExists.created_at
        const validTillDate = moment(voucherCreatedDate).add(24, 'hours')
        if (validTillDate < voucherCreatedDate && checkEmailExists.voucher_applied_time < valid_voucher_applied_time && checkEmailExists.limit <= 5) {
          res.status(422).json("coupon expires")
        } else {
          
          const body = {
            voucher_applied_time: moment().format("DD-MM-YYYY hh.mm.ss"),
            limit: checkEmailExists.limit - 1,
            status:"partially redeemed"
          }
          console.log(body)
          const updateCoupon = await updateVoucher(checkEmailExists.id, body)
          res.status(200).json(updateCoupon)
        }


      } else {
        res.status(422).json("Invalid Voucher")
      }
    } else {
      res.status(422).json("Provide Pin")
    }





    

  });





};