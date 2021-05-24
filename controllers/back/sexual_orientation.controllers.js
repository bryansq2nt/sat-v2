const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let sexualOrientationList = async(req, res) => {

    try {
        
        var errorResponse = new ErrorModel({ type: "Sexual-Orientation", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de orientación sexual.", instance: "sexual_orientation/sexualOrientationList" });

        await db.query(`SELECT id_ori_sexual, descripcion FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var sexualOrientation = results.rows;
                return res.status(200).json({ sexualOrientation });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'sexual_orientation', 'sexualOrientationList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

module.exports = {
    sexualOrientationList
}
