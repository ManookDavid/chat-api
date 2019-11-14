module.exports = {
    info: (req, res) => {
        const data = {...req.user}
        delete data.password
        delete data.date
        return res.json({ data })
    }
}