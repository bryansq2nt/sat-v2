const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let zoneList = async(req, res) => {
    
    try {

        var errorResponse = new ErrorModel({ type: "Zone", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de zonas.", instance: "zone/zoneList" });

        await db.query('SELECT id_zona, nombre_zona, estado FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var zonaList = results.rows;
                return res.status(200).json({ zonaList });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'zone', 'zoneList', error, false, req, res);
    }
};

module.exports = {
    zoneList
}