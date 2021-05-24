const db = require('@config/db');

let viewIndex = async(req, res) => {

    let modulesApp= await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 1 ORDER BY id_modulo ASC');
    modulesApp = modulesApp.rows;
    //console.log(modulesApp);
    //console.log('***********************************');
    let modulesWeb = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
    modulesWeb = modulesWeb.rows;

    var id_usuario = req.user.id_usuario;

    let autorizacionAppModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
    FROM sat_permisos_modulos_usuario AS pu
    INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
    WHERE pu.id_usuario = $1 AND m.tipo_modulo = 1`, [id_usuario]);
    autorizacionAppModulsUser = autorizacionAppModulsUser.rows;
    //console.log(autorizacionAppModulsUser);
    //console.log('***********************************');
    let autorizacionWebModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
    FROM sat_permisos_modulos_usuario AS pu
    INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
    WHERE pu.id_usuario = $1 AND m.tipo_modulo = 2`, [id_usuario]);
    autorizacionWebModulsUser = autorizacionWebModulsUser.rows;
    

    var AutorizacionModulsAppUser = [];
    var modulsAppNotAutorizesUser = [];
 

        
        var id_modulo;
        var nombre_modulo;
        var checked;

    for (let i = 0; i < autorizacionAppModulsUser.length; i++) {
        //console.log( i + '#### '+ autorizacionAppModulsUser[i].id_modulo);
        for (let j = 0; j < modulesApp.length; j++) {
            //console.log( j + '**** '+ modulesApp[j].id_modulo);
             if (autorizacionAppModulsUser[i].id_modulo != modulesApp[j].id_modulo) {
                //console.log(autorizacionAppModulsUser[i].id_modulo+ ' ---- ' +modulesApp[j].id_modulo);
                id_modulo = modulesApp[j].id_modulo;
                nombre_modulo = modulesApp[i].nombre_modulo;
                checked = 'checked';
                modulsAppNotAutorizesUser.push({ id_modulo: id_modulo, nombre_modulo: nombre_modulo, checked: checked });
            }
        }
    }

    //DELETE ITEM

    for (let i = 0; i < autorizacionAppModulsUser.length; i++) {
        //console.log( i + '#### '+ autorizacionAppModulsUser[i].id_modulo);
        for (let j = 0; j < modulsAppNotAutorizesUser.length; j++) {
            //console.log( j + '**** '+ modulesApp[j].id_modulo);
            if (autorizacionAppModulsUser[i].id_modulo == modulsAppNotAutorizesUser[j].id_modulo) {
                //modulsAppNotAutorizesU`ser.splice(i,j);
            }else{
                console.log(autorizacionAppModulsUser[i].id_modulo+ ' ---- ' +modulsAppNotAutorizesUser[j].id_modulo);
            }
        }
    }


    var ObjModulUser = {
        ModulosAutorizados:AutorizacionModulsAppUser,
        modulosNoAutorizados:modulsAppNotAutorizesUser
    };
    
    //console.log(modulsAppNotAutorizesUser);
    var year = new Date().getFullYear();  
    return res.render('home/home',{user: req.user, year});

};

module.exports = {
    viewIndex
}