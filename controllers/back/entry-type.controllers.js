const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let entryTypeList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Entry-Type", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Tipos de Entradas.", instance: "entry-type/entryTypeList" });

        await db.query(`SELECT id_entrada, nombre_entrada, estado
        FROM sat_tipo_entrada WHERE estado = 1 ORDER BY id_entrada ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var entryTypeList = results.rows;
                res.status(200).json({
                    entryTypeList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'entry-type', 'entryTypeList', error, false, req, res);
    }
};

module.exports = {
    entryTypeList
}