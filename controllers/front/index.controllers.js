const db = require('@config/db');

let viewIndex = async(req, res) => {

    //Get List of App Modules
    let modulesApp= await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 1 ORDER BY id_modulo ASC');
    modulesApp = modulesApp.rows;

    //Get List of Web Modules
    let modulesWeb = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
    modulesWeb = modulesWeb.rows;

    //User Id in Session
    var id_usuario = req.user.id_usuario;

    //Get List of User Modules (APP)
    let autorizacionAppModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
    FROM sat_permisos_modulos_usuario AS pu
    INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
    WHERE pu.id_usuario = $1 AND m.tipo_modulo = 1`, [id_usuario]);
    autorizacionAppModulsUser = autorizacionAppModulsUser.rows;

    //Get List of User Modules (WEB)
    let autorizacionWebModulsUser = await db.query(`SELECT pu.id_usuario, pu.id_modulo, m.nombre_modulo, m.tipo_modulo, pu.estado
    FROM sat_permisos_modulos_usuario AS pu
    INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
    WHERE pu.id_usuario = $1 AND m.tipo_modulo = 2`, [id_usuario]);
    autorizacionWebModulsUser = autorizacionWebModulsUser.rows;
    
    var modulsAppAndUser = [];
    var idModules = [];
    var listModuls = [];
  
    for (let j = 0; j < autorizacionAppModulsUser.length; j++) { //recorrer la lista de modulos asignados al usuario.
        for (let i = 0; i < modulesApp.length; i++) { //recorrer la lista de los modulos de la aplicacion.
            if (modulesApp[i].id_modulo != autorizacionAppModulsUser[j].id_modulo) { //Comparar los modulos de la aplicacion y el usuario. Se obtendran una lista de los modulos de la aplicacion que sean distintos en cada Iteracion o rrecorrido.
                var id_modulo = modulesApp[i].id_modulo; //Obtener los ids de los modulos de aplicacion que han sido distinto en casa recorrido o iteración.              
                var getUserModules = await db.query(`SELECT pu.id_modulo 
                FROM sat_permisos_modulos_usuario AS pu
                INNER JOIN sat_modulos AS m ON m.id_modulo = pu.id_modulo
                WHERE pu.id_modulo = $1 AND pu.id_usuario = $2`, [id_modulo, id_usuario]);
                getUserModules = getUserModules.rows[0]; // Buscar y Obtener los ids de modulos que han sido autorizados al usuario.
                
                if (getUserModules != undefined) {
                    idModules.push(getUserModules.id_modulo); //Si la variable getUserModules (List Moduls) no obtiene un valor indefinido. Entonces los ids pertencen a los modulos que el usuario está autorizado y se guardan en el arreglo idModules
                } else {
                    idModules.push(id_modulo); //Si la variable obtiene un valor indefinido, entonces los ids pertecen a los modulos que el usuario no está autorizado y se guardan en el arreglo idModules.  
                }

                for (k = 0; k < idModules.length; k++) { //Se recorre la lista de ids de los modulos de la aplicacion y los ids de los modulos al usuario usuario 
                    if (listModuls.sort().indexOf(idModules[k]) === -1) { //si encuentra un Id repetido lo elimina. 
                        listModuls.push(idModules[k]); //el arreglo listModulsApp[] guardará la lista de ids de los modulos de aplicacion no autorizados y de los modulos autorizados al usuario.  
                    }
                }
            }
        }
    }

    for (let l = 0; l < listModuls.length; l++) {
        var checked;
        let getmodulesApp= await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE id_modulo = $1',[listModuls[l]]);
        getmodulesApp = getmodulesApp.rows[0];

        modulsAppAndUser.push({id_modulo:getmodulesApp.id_modulo, nombre_modulo:getmodulesApp.nombre_modulo});
    }
    
    console.log(modulsAppAndUser);

    var year = new Date().getFullYear();  
    return res.render('home/home',{user: req.user, year});

};

module.exports = {
    viewIndex
}