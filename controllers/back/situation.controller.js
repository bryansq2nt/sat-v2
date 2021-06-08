const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let conflictSituationList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Conflict Situation", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de situacion conflictiva.", instance: "situacion/conflictSituationList" });

        await db.query(`SELECT id_situacion_conflictiva::numeric, id_subtema::numeric, nombre_sit_conflictiva
        FROM sat_situacion_conflictiva 
        WHERE estado = 1
        ORDER BY id_situacion_conflictiva ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var SituationsList = results.rows;
                res.status(200).json({
                    SituationsList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'conflict-situation', 'conflictSituationList', error, false, req, res);
    }
};


module.exports = {
    conflictSituationList
}
