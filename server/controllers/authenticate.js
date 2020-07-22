const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')



const findTokenFromDB = async req => {
    return new Promise((resolve, reject) => {
        const data = jwt.verify(req, "jwt@123")
        if("createdAt" in data) {
            resolve("verified")
        } else {
            reject("Error")
        }
    })
}

exports.authenticateUser = () => async (req, res, next) => {
    if (req.headers.auth) {
        const token = req.headers.auth
        const findByToken = await findTokenFromDB(token)
        if(findByToken==="verified") {
            next()
        } else {
            res.status(422).json("Error Token")
        }
    } else {
        res.status(422).json("provide token")

    }

}