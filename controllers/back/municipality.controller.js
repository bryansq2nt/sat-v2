const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let municipalityList = async (req, res) => {

    var errorResponse = new ErrorModel({ type: "Municipalities", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de municipios.", instance: "municipalities/municipalityList" });

    try {
        await db.query(`SELECT id_municipio, id_departamento, descripcion
        FROM admi_municipio
        WHERE est_reg = 'A'`, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }
            var municipalities = results.rows;
            return res.status(200).json({
                municipalities
            })
        }) 
    } catch (error) {
        log('src/controllers/back','municipality','municipalityList',error,true,req,res);
        return res.status(500).json(errorResponse.toJson());
    }
    
};

module.exports = {
    municipalityList
};