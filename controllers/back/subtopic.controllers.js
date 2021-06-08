const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let subtopicList = async(req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Subtopic", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de subtemas.", instance: "subtopic/subtopicList" });

        await db.query(`SELECT id_subtema::numeric, id_tema::numeric, nombre_subtema
        FROM sat_subtemas 
        WHERE estado = 1 ORDER BY id_subtema ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var subtopicsList = results.rows;
                res.status(200).json({
                    subtopicsList
                });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'subtopic', 'subtopicList', error, false, req, res);
    }
};



module.exports = {
    subtopicList
}
