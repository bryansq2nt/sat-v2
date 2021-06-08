const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let topicList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Topic", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de temas.", instance: "topic/topicList" });

        await db.query(`SELECT id_tema::numeric, nombre_tema, estado
        FROM sat_temas WHERE estado = 1 
        ORDER BY id_tema ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var topicsList = results.rows;
                res.status(200).json({
                    topicsList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'topic', 'topicList', error, false, req, res);
    }
};

module.exports = {
    topicList
}
