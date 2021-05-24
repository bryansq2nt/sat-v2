const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');


let countryList = async(req, res) =>{

    try {

        var errorResponse = new ErrorModel({ type: "Countries", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la información de los países.", instance: "countries/countryList" });

        await db.query('SELECT id_pais, descripcion, nacionalidad, continente FROM admi_pais', (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var countries = results.rows;
                res.status(200).json({
                    countries
                });
            }
        });
    } catch (error) {
        log('src/controllers/back', 'countries', 'countryList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }

};

module.exports = {
    countryList
}