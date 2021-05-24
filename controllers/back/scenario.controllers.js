const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let scenarioList = async(req, res) => {
    
    try {

        var errorResponse = new ErrorModel({ type: "Scenario", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Escenarios.", instance: "scenario/scenarioList" });

        await db.query('SELECT id_escenario, nombre_escenario FROM sat_escenario WHERE estado = 1 ORDER BY id_escenario ASC', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var scenarioList = results.rows;
                res.status(200).json({
                    scenarioList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'scenario', 'scenarioList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

module.exports = {
    scenarioList
}