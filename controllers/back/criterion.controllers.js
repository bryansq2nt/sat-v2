const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let criterionList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Criterion", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de criterios.", instance: "criterio/criterionList" });

        await db.query(`SELECT id_tema::numeric, id_sit_conflictiva::numeric, id_criterio::numeric, nombre_criterio
        FROM sat_criterio
        WHERE estado = 1 
        ORDER BY id_criterio DESC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var Criterion = results.rows;
                res.status(200).json({
                    Criterion
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'criterion', 'criterionList', error, false, req, res);
    }
};


module.exports = {
    criterionList
}
