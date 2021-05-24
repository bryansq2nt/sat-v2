const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

var errorResponse = new ErrorModel({ type: "Population-Type", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de tipos de población.", instance: "population/populationTypeList" });

let populationTypeList = async(req, res) => {
    try {
        await db.query(`SELECT id_poblacion, nombre_poblacion, estado
        FROM sat_tipo_poblacion WHERE estado = 1 ORDER BY id_poblacion ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var populationTypeList = results.rows;
                res.status(200).json({
                    populationTypeList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'population-type', 'populationTypeList', err, false, req, res);
    }
};


module.exports = {
    populationTypeList
}