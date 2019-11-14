const jwt = require('jsonwebtoken')
const crypto = require('crypto')
module.exports = {
    signUp: (req, res) => {
        const user = {
            ...req.body,
            date: new Date()
        }
        user.password = crypto.createHash('md5').update(user.password).digest('hex')
        req
            .db
            .collection('users')
            .find(user.username)
            .toArray()
            .then(data => {
                if (data.length < 1) {
                    console.log(data)
                    req
                        .db
                        .collection('users')
                        .insertOne(user)
                        .then(user => res.json({ user }))
                        .catch(err => {
                            console.log(err)
                            return res.status(500).json({ message: 'Server error!' })
                        })
                } else {
                    return res.status(200).json({ message: 'Username is busy!!!'})
                } 
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ message: 'Server error!' })
            })
    },
    login: (req, res) => {
        const {username, password} = req.body
        const passwordHash = crypto.createHash('md5').update(password).digest('hex')
        req
            .db
            .collection('users')
            .find({"username": username, "password": passwordHash})
            .toArray()
            .then(data => {
                if (data.length < 1) {
                    return res.json({ message: 'Invalid username or password!'})
                }
                const token = jwt.sign({
                    id: data[0]._id
                }, 'david')
                return res.json({ token })
            })
    }     

}