const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let aggressionTypeList = async(req, res) => {

    try {
        
        var errorResponse = new ErrorModel({ type: "Aggression Type", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de tipos de agresiones.", instance: "agression-type/aggressionTypeList" });

        await db.query(`SELECT id_tipo_agresion, nombre_agresion, ponderacion, estado
        FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var aggressionType = results.rows;
                return res.status(200).json({ aggressionType });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'aggression', 'aggressionTypeList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

module.exports = {
    aggressionTypeList
}
