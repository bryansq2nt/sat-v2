const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let classificationQualityList = async(req, res) => {
    try {

        var errorResponse = new ErrorModel({ type: "Crisis Classification Quality", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Calidad de Clasificación de Crisis.", instance: "crisis-classification-quality/classificationQualityList" });

        await db.query(`SELECT id_calidad_crisis, nombre_calidad_crisis, estado
        FROM sat_calidad_clasificacion_crisis WHERE estado = 1 ORDER BY id_calidad_crisis ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var crisisQualityList = results.rows;
                return res.status(200).json({ crisisQualityList });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'crisis-classification-quality', 'classificationQualityList', err, false, req, res);
    }
};

module.exports = {
    classificationQualityList
}