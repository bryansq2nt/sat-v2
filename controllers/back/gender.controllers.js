const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let genderList = async(req, res) => {
    
    try {

        var errorResponse = new ErrorModel({ type: "Gender", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de generos.", instance: "gender/genderList" });

        await db.query('SELECT id_genero, nombre_genero, estado FROM sat_genero WHERE estado = 1 ORDER BY id_genero ASC', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var genderList = results.rows;
                res.status(200).json({
                    genderList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'gender', 'genderList', error, false, req, res);
    }
};


module.exports = {
    genderList
}