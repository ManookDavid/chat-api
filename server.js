const express = require('express')
const morgan = require('morgan')
const mime = require('mime')
const cors = require('cors')
const multer = require('multer')
const useMongodb = require('./middleware/useMongodb')
const authController = require('./controllers/authController')
const useAuth = require('./middleware/useAuth')
const userController = require('./controllers/userController')

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'storage/'),
        filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    })
})

useMongodb(client => {
    const app = express()
    app.use(express.json())
    app.use(morgan('dev'))
    app.use(cors())
    app.use('/files', express.static('storage'))
    app.use((req, res, next) => {
        req.db = client.db('chat')
        next()
    })
    //login and signup
    app.post('/api/users', authController.signUp)
    app.get('/api/users', authController.login)
    //user
    app.use((req, res) => {
        app.get('/api/user', useAuth(req, res, () => userController.info))
    })
    //files
    app.post('/api/file', upload.single('file'), (req, res) => res.json({path: req.file.path}))
    app.listen(4000, () => console.log('localhost:4000'))
})