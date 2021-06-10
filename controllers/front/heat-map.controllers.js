const db = require('@config/db');
const log = require('@lib/catch-error');

let getHeatMap = async(req, res) =>{
    try {
        return res.render('heat-map/heat_map');   
    } catch (error) {
        log('src/controllers/front', 'heat-map', 'getHeatMap', error, false, req, res);
    }
};

module.exports = {
    getHeatMap
}