const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')

module.exports = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized!' })
    }
    jwt.verify(token, 'david', (err, token) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!'})
        }
        
        const id = new ObjectId(token.id)
        req
            .db
            .collection('users')
            .find({"_id":id})
            .toArray()
            .then(data => {
                if (data.length < 1) {
                    return res.status(401).json({ message: 'Unauthorized!'})
                }
                req.user = {...data}
                return next()
            })
    })
}
    