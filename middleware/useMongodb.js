const {MongoClient} = require('mongodb')
module.exports = (callback) => {
    MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (err, client) => {
        if (err) {
            return console.log(err)
        }
        console.log('mongodb successfully connected')

        callback(client)
    })
}