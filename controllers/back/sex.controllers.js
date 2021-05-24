const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let sexList = async(req, res) => {
    
    try {

        var errorResponse = new ErrorModel({ type: "Sex", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de sexos.", instance: "sex/sexList" });

        await db.query('SELECT id_sexo, nombre_sexo, estado FROM sat_sexo WHERE estado = 1 ORDER BY id_sexo ASC', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var sexList = results.rows;
                res.status(200).json({
                    sexList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'sex', 'sexList', error, false, req, res);
    }
};


module.exports = {
    sexList
}