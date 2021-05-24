const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let participantQualityList = async(req, res) => {
    try {

        var errorResponse = new ErrorModel({ type: "Participant Quality", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Calidad de Clasificación de Crisis.", instance: "crisis-classification-quality/classificationQualityList" });

        await db.query(`SELECT id_calidad_participa, nombre_calidad_participa, estado
        FROM sat_calidad_clasificacion_participa WHERE estado = 1 ORDER BY id_calidad_participa ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var participantQualityList = results.rows;
                res.status(200).json({
                    participantQualityList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'participant-quality', 'participantQualityList', err, false, req, res);
    }
};


module.exports = {
    participantQualityList
}