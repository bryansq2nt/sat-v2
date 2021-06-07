const db = require('@config/db');

let viewIndex = async(req, res) => {
     
    var year = new Date().getFullYear();
    return res.render('home/home',{user: req.user, year});

};

module.exports = {
    viewIndex
}