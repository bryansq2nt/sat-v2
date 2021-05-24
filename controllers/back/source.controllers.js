const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let sourceList = async(req, res) => {
    
    try {

        var errorResponse = new ErrorModel({ type: "source", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de fuentes.", instance: "source/sourceList" });

        await db.query(`SELECT id_tipo_fuente::numeric, id_fuente::numeric, nombre_fuente
        FROM sat_fuente 
        WHERE estado = 1
        ORDER BY id_fuente ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var sourceList = results.rows;
                res.status(200).json({
                    sourceList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'source', 'sourceList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};


module.exports = {
    sourceList
}