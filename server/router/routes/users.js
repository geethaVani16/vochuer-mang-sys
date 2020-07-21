'use strict';
const jwt = require('jsonwebtoken')





module.exports = (app, db) => {

  /*public Function*/
  const UserExists = async (email) => {
    return new Promise((resolve, reject) => {
      db.users.findOne({
        where: {
          email: email
        }
      })
        .then((list) => {
          if (list === null) {
            resolve(false)
          }
          else
            resolve(true)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }


  const findUserCREDExists = async (email, password) => {
    console.log(email, password)
    return new Promise((resolve, reject) => {
      db.users.findOne({
        where: {
          password: password,
          email: email
        }
      })
        .then((list) => {
          if (list === null) {
            resolve("Email or Password is Incorrect")
          } else {
            resolve(list.dataValues)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const createUserInDB = async req => {
    return new Promise((resolve, reject) => {

      db.users.create(req)
        .then(list => {
          resolve(list)
        })
        .catch(error => {
          reject(error)
          // Ooops, do some error-handling
        })
    })
  }

  const genarateJWT = async req => {
    return new Promise((resolve, reject) => {
      const username = req.useremail
      const tokenData = {
        username: username,
        createdAt: Number(new Date())
      }
      const data = jwt.sign(tokenData, "jwt@123")
      resolve(data)
    })
  }


  const updateUserinDB = async (id, req) => {
    const body = {
      tokens: req
    }
    return new Promise((resolve, reject) => {
      db.users.update(
        body,
        {
          where:
            { userid: id },
          returning: true,
          raw: true
        })
        .then(list => {
          console.log(list[1], "in update")
          const data = list[1][0].tokens
          resolve(data[data.length - 1])
        })
        .catch(error => {
          reject(error)
          // Ooops, do some error-handling
        })
    })
  }


  // GET all users
  app.get('/users', (req, res) => {
    db.users.findAll()
      .then(users => {
        res.json(users);
      });
  });

  // GET one owner by id
  app.get('/owner/:id', (req, res) => {
    const id = req.params.id;
    db.users.find({
      where: { id: id }
    })
      .then(owner => {
        res.json(owner);
      });
  });

  // POST single owner
  app.post('/users/create', async (req, res) => {
    const email = req.body.email
    const doesUserExits = await UserExists(email)
    if (!doesUserExits) {
      const createUser = await createUserInDB(req.body)
      res.status(200).json(createUser)
    } else {
      res.status(422).json("Already have an account please login")
    }
  });

  app.post('/users/login', async (req, res) => {
    const { email, password } = req.body
    const findUserCred = await findUserCREDExists(email, password)
    if (findUserCred) {
      console.log(findUserCred, "findUserCred")
      const userTokenData = findUserCred.tokens
      const genarateToken = await genarateJWT(req.body)
      userTokenData.push(genarateToken)
      const updateUserWithToken = await updateUserinDB(findUserCred.userid, findUserCred.tokens)
      res.status(200).json(updateUserWithToken)
    } else {
      res.status(422).json("Already have an account please login")
    }

  })
};