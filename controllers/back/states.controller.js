const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let getList = async (req, res) => {

    var errorResponse = new ErrorModel({ type: "States", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de departamentos.", instance: "states/getList" });

    try {
        await db.query(`SELECT id_departamento, zona_depto, descripcion
        FROM admi_departamento
        WHERE est_reg = 'A'`, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }
            var states = results.rows;
            return res.status(200).json({
                states
            })
        }) 
    } catch (error) {
        log('src/controllers/back','states','getList',error,true,req,res);
        return res.status(500).json(errorResponse.toJson());
    }
   
};

module.exports = {
    getList
};