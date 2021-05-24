const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let administrativeUnitsList = async(req, res) =>{
    try {

        var errorResponse = new ErrorModel({ type: "Administrative-Units", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de tipos de agresiones.", instance: "administrative-units/administrativeUnitsList" });

        await db.query(`SELECT id_unidad_administrativa, nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero
        FROM sat_unidad_administrativa WHERE estado = 1`,(err,results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var administrativeUnits = results.rows;
                return res.status(200).json({ administrativeUnits });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'administrative-units', 'administrativeUnitsList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

let SsenAnalysisAdministrativeUnit = async (req, res) => {
    const { nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, estado} = req.body;
    
    var cod_usu_ing = req.user.id_usuario;
    var cod_usu_mod = req.user.id_usuario;

    try {
        await db.query(`INSERT INTO sat_unidad_administrativa(
            nombre_unidad, correo_prinicipal, correo_secundario, 
            correo_tercero, cod_usu_ing, cod_usu_mod, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, [nombre_unidad, correo_prinicipal, correo_secundario, correo_tercero, cod_usu_ing, cod_usu_mod, estado], (err, results) => {
            if (err) {
                log('src/controllers/front', 'administrative-units', 'createAdministrativeUnit', err, false, req, res);
            } else {
                req.flash('success', 'Registro creada correctamente');
                return res.redirect('/api-sat/administrative-units-list');
            }
        });   
    } catch (error) {
        log('src/controllers/front', 'administrative-units', 'createAdministrativeUnit', error, false, req, res);
    }
};


module.exports = {
    administrativeUnitsList,
    SsenAnalysisAdministrativeUnit
}