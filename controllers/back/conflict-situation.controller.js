const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let conflictSituationList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Conflict Situation", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de conflictos.", instance: "conflict-situation/conflictSituationList" });

        await db.query(`SELECT id_situacion_conflicto, nombre_conflicto, ponderacion
        FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var conflictSituation = results.rows;
                return res.status(200).json({ conflictSituation });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'conflict-situation', 'conflictSituationList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

module.exports = {
    conflictSituationList
}
