const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');

let criterionList = async(req, res) => {

    try {
        await db.query(`SELECT c.id_tema, t.nombre_tema, sb.nombre_subtema, c.id_sit_conflictiva, sc.nombre_sit_conflictiva, c.id_criterio, c.nombre_criterio, c.estado
        FROM sat_criterio AS c
        INNER JOIN sat_temas AS t ON c.id_tema = t.id_tema 
        INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = c.id_sit_conflictiva
        INNER JOIN sat_subtemas AS sb ON sb.id_subtema = sc.id_subtema 
        ORDER BY c.id_criterio DESC`, (err, results)=>{
            if(err){
                log('src/controllers/front', 'criterion', 'criterionList', err, false, req, res);
            }else{
                var criterions = results.rows;
                return res.render('criterion/criterio_list', { criterions });
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'criterion', 'criterionList', error, false, req, res);
    }
};

let viewCreateCriterion = async(req, res)=>{

    try {
     
    let topic = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas 
    WHERE estado = 1`);
    topic = topic.rows;

    let subtopic = await db.query(`SELECT id_subtema, nombre_subtema FROM sat_subtemas
    WHERE estado = 1`);
    subtopic = subtopic.rows;

    let conflictSituation = await db.query(`SELECT id_situacion_conflictiva, nombre_sit_conflictiva
    FROM sat_situacion_conflictiva`);
    conflictSituation = conflictSituation.rows;

    return res.render('criterion/criterio_create', {topic, subtopic, conflictSituation});

    } catch (error) {
        log('src/controllers/front', 'criterion', 'viewCreateCriterion', error, false, req, res);
    }

};

let createCriterion = async (req, res) => {
    const { nombre_criterio, id_tema, id_situacion_conflictiva, estado } = req.body;
    
    var cod_usu = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_criterio(
            nombre_criterio, id_tema, id_sit_conflictiva, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5, $6)`, [nombre_criterio, id_tema, id_situacion_conflictiva, cod_usu, cod_usu, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'conflict-situation', 'createAggressionType', err, false, req, res);
            } else {
                req.flash('success', 'Registro creado correctamente');
                return res.redirect('/api-sat/criterion-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'createAggressionType', error, false, req, res);
    }
};

let getById = async (req, res) => {
    const { id_criterio } = req.params;
    try {


        let topic = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas 
        WHERE estado = 1`);
        topic = topic.rows;

        let subtopic = await db.query(`SELECT id_subtema, nombre_subtema FROM sat_subtemas
        WHERE estado = 1`);
        subtopic = subtopic.rows;

        let conflictSituation = await db.query(`SELECT id_situacion_conflictiva, nombre_sit_conflictiva
        FROM sat_situacion_conflictiva`);
        conflictSituation = conflictSituation.rows;

        await db.query(`SELECT c.id_tema, t.nombre_tema, sb.nombre_subtema, c.id_sit_conflictiva, sc.nombre_sit_conflictiva, c.id_criterio, c.nombre_criterio, c.estado
        FROM sat_criterio AS c
        INNER JOIN sat_temas AS t ON c.id_tema = t.id_tema 
        INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = c.id_sit_conflictiva
        INNER JOIN sat_subtemas AS sb ON sb.id_subtema = sc.id_subtema
        WHERE c.id_criterio = $1`, [id_criterio],
            (err, results) => {
                if (err) {
                    log('src/controllers/front', 'conflict-situation', 'getById', err, false, req, res);
                } else {
                    var criterion = results.rows[0];
                    return res.render('criterion/criterio_edit', { criterion, topic, subtopic, conflictSituation });
                }
            });
    } catch (error) {
        log('src/controllers/front', 'conflict-situation', 'getById', error, false, req, res);
    }
};

let updateCriterion = async (req, res)=>{
    
    const { id_criterio } = req.params;
    const { nombre_criterio, id_tema, id_situacion_conflictiva, estado } = req.body;
    
    console.log(id_criterio);
    console.log(nombre_criterio);
    console.log(id_tema);
    console.log('-------', id_situacion_conflictiva);
    console.log(estado);

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu = req.user.id_usuario;

    try {

        await db.query(`UPDATE sat_criterio
        SET nombre_criterio=$1, id_tema=$2, id_sit_conflictiva=$3, fecha_mod_reg=$4, cod_usu_ing=$5, cod_usu_mod=$6, estado=$7
        WHERE id_criterio=$8`, [nombre_criterio, id_tema, id_situacion_conflictiva, fecha_mod_reg, cod_usu, cod_usu, estado, id_criterio], (err, results)=>{
            if(err){
                log('src/controllers/front', 'criterion', 'updateCriterion', err, false, req, res);
             }else{
                req.flash('warning', 'Registro actualizado correctamente');
                return res.redirect('/api-sat/criterion-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'criterion', 'updateCriterion', error, false, req, res);
    }

};

module.exports = {
    criterionList,
    viewCreateCriterion,
    createCriterion,
    getById,
    updateCriterion
}
