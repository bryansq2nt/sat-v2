const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let sourceTypeList = async(req, res) => {
    try {

        var errorResponse = new ErrorModel({ type: "source-type", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener los tipos de fuentes.", instance: "source-type/sourceTypeList" });

        await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente, estado FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC ', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var sourceTypeFonts = results.rows;
                res.status(200).json({
                    sourceTypeFonts
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'source-type', 'sourceTypeList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};


module.exports = {
    sourceTypeList
}