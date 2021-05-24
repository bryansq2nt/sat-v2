const db = require('@config/db');
const log = require('@lib/catch-error');

let usersList = async(req, res) =>{
    try {
        
        await db.query(`SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.usuario, u.fec_nacimiento, u.correo, u.clave, u.estado_reg, u.id_perfil, up.descripcion AS perfil
        FROM usuario AS u
        INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
        WHERE u.id_perfil > 1`,(err, results)=>{
            if(err){
                log('src/controllers/front', 'users', 'usersList', err, false, req, res);
            }else{
                var users = results.rows;
                res.render('users/users_list', {users});
            }
        });
        
    } catch (error) {
        log('src/controllers/front', 'users', 'usersList', error, false, req, res);
    }
};

let getById = async(req, res) =>{
    const { id_usuario } = req.params;
    try {
        
        let userAuthorization = await db.query(`SELECT acc.id_usuario, acc.permiso_acceso_app, 
        acc.permiso_acceso_web, acc.id_rol_permisos, app.nombre_permiso
        FROM sat_accesos_usuario AS acc
        INNER JOIN sat_rol_app_permisos AS app ON app.id_rol_permisos = acc.id_rol_permisos
        WHERE acc.id_usuario = $1`, [id_usuario]);
        userAuthorization = userAuthorization.rows[0];

        let dataAuthorization = await db.query('SELECT id_rol_permisos, nombre_permiso FROM sat_rol_app_permisos WHERE estado = 1 ORDER BY id_rol_permisos ASC');
        dataAuthorization = dataAuthorization.rows;

        let moduleAppAutorization = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 1 ORDER BY id_modulo ASC');
        moduleAppAutorization = moduleAppAutorization.rows;

        let moduleWebAutorization = await db.query('SELECT id_modulo, nombre_modulo FROM sat_modulos WHERE tipo_modulo = 2 ORDER BY id_modulo ASC');
        moduleWebAutorization = moduleWebAutorization.rows;

        await db.query(`SELECT u.id_usuario, u.usuario, u.nombre,
                        u.apellido, u.correo, u.id_perfil,
                        p.descripcion
                        FROM usuario AS u
                        INNER JOIN perfil AS p ON p.id_perfil = u.id_perfil
                        WHERE u.id_usuario = $1`, [id_usuario], (err, results) => {
            if (err) {
                log('src/controllers/front', 'users', 'getById', err, false, req, res);
            } else {
                var SIGIuser = results.rows[0];
                res.render('users/users_authotization', { SIGIuser, dataAuthorization, userAuthorization, moduleAppAutorization, moduleWebAutorization});
            }
        });

    } catch (error) {
        log('src/controllers/front', 'users', 'getById', error, false, req, res);
    }

};

let usersAuthotization = async (req, res) => {
    const { id_usuario, permiso_acceso_app, permiso_acceso_web, id_rol_permisos, id_modulo_app, id_modulo_web} =  req.body;
    
    try {

        var cod_usu_ing = req.user.id_usuario;
        var cod_usu_mod = req.user.id_usuario;
    
        await db.query(`INSERT INTO sat_accesos_usuario(
            id_usuario, permiso_acceso_app, permiso_acceso_web, id_rol_permisos, 
            cod_usu_ing, cod_usu_mod)
            VALUES ($1, $2, $3, $4, $5, $6)`, [id_usuario, permiso_acceso_app, permiso_acceso_web, id_rol_permisos, cod_usu_ing, cod_usu_mod], async (err, results)=>{
                if(err){
                    log('src/controllers/front', 'users', 'usersAuthotization', err, false, req, res);
                }else{
                    //var Useraccess = results.rows[0];
                    if(permiso_acceso_app == 1){
                        if(id_modulo_app != undefined){

                            for (let i = 0; i < id_modulo_app.length; i++) {
                                await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                                    id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                                    VALUES ($1, $2, $3, $4)`,[id_usuario, id_modulo_app[i], cod_usu_ing, cod_usu_mod]);               
                            }
                        }
                    }
            
                    if(permiso_acceso_web == 1) {
                        if (id_modulo_web != undefined) {

                            for (let i = 0; i < id_modulo_app.length; i++) {
                                await db.query(`INSERT INTO sat_permisos_modulos_usuario(
                                id_usuario, id_modulo, cod_usu_ing, cod_usu_mod)
                                VALUES ($1, $2, $3, $4)`, [id_usuario, id_modulo_web[i], cod_usu_ing, cod_usu_mod]);
                            }
                        }
                    }

                    req.flash('warning', 'Registro actualizado correctamente');
                    res.redirect('/api-sat/users-list');
                }
        });
    } catch (error) {
        log('src/controllers/front', 'users', 'usersAuthotization', error, false, req, res);
    }
};

let updateUsersAuthotization = async (req, res) =>{
    const { id_usuario } = req.params;
    const { permiso_app, opc_alerta_temprana, opc_atencion_crisis, opc_dashboard, permiso_web, opc_administracion, opc_catalogos, opc_dashboard_web, 
        permiso_ver_app, permiso_editar_app, permiso_ver_web, permiso_editar_web} =  req.body;

        var val_permiso_app = permiso_app;
        var val_opc_alerta_temprana = opc_alerta_temprana;
        var val_opc_atencion_crisis = opc_atencion_crisis;
        var val_opc_dashboard = opc_dashboard;
        var val_permiso_web = permiso_web;
        var val_opc_administracion = opc_administracion;
        var val_opc_catalogos = opc_catalogos;
        var val_opc_dashboard_web = opc_dashboard_web;
        var val_permiso_ver_app = permiso_ver_app;
        var val_permiso_editar_app = permiso_editar_app;
        var val_permiso_ver_web = permiso_ver_web;
        var val_permiso_editar_web = permiso_editar_web;

        // console.log('##########################################');
        // console.log('permiso app', val_permiso_app);
        // console.log('opc_temprana', val_opc_alerta_temprana);
        // console.log('opc_crisis', val_opc_atencion_crisis);
        // console.log('opc_dashboard', val_opc_dashboard);
        // console.log('val_permiso_web', val_permiso_web);
        // console.log('opc_administracion', val_opc_administracion);
        // console.log('opc_catalogos', val_opc_catalogos);
        // console.log('opc_dashboard_web', val_opc_dashboard_web);
        // console.log('permiso_ver_app', val_permiso_ver_app);
        // console.log('permiso_editar_app', val_permiso_editar_app);
        // console.log('permiso_ver_web', val_permiso_ver_web);
        // console.log('permisos_editar_web', val_permiso_editar_web);
        // console.log('##########################################');
        // console.log('##########################################');

        if(val_permiso_app == undefined){
            val_permiso_app = 0;
        }
    
        if(val_opc_alerta_temprana == undefined){
            val_opc_alerta_temprana = 0;
        }

        if(val_opc_atencion_crisis == undefined){
            val_opc_atencion_crisis = 0;
        }

        if(val_opc_dashboard == undefined){
            val_opc_dashboard = 0;
        }

        if(val_permiso_web == undefined){
            val_permiso_web = 0;
        }
    
        if(val_opc_administracion == undefined){
            val_opc_administracion = 0;
        }
        
        if(val_opc_catalogos == undefined){
            val_opc_catalogos = 0;
        }

        if(val_opc_dashboard_web == undefined){
            val_opc_dashboard_web = 0;
        }

        if (val_permiso_ver_app == undefined){
            val_permiso_ver_app = 0;
        }
        
        if(val_permiso_editar_app == undefined){
            val_permiso_editar_app = 0;
        }

        if(val_permiso_ver_web == undefined){
            val_permiso_ver_web = 0;
        }

        if(val_permiso_editar_web == undefined){
            val_permiso_editar_web = 0;
        }

        var fecha_mod_reg = new Date().toLocaleString();
        var cod_usu_ing = req.user.id_usuario;
        var cod_usu_mod = req.user.id_usuario;

        // console.log('permiso app', val_permiso_app);
        // console.log('opc_temprana', val_opc_alerta_temprana);
        // console.log('opc_crisis', val_opc_atencion_crisis);
        // console.log('opc_dashboard', val_opc_dashboard);
        // console.log('val_permiso_web', val_permiso_web);
        // console.log('opc_administracion', val_opc_administracion);
        // console.log('opc_catalogos', val_opc_catalogos);
        // console.log('opc_dashboard_web', val_opc_dashboard_web);
        // console.log('permiso_ver_app', val_permiso_ver_app);
        // console.log('permiso_editar_app', val_permiso_editar_app);
        // console.log('permiso_ver_web', val_permiso_ver_web);
        // console.log('permisos_editar_web', val_permiso_editar_web);
     
        try {

            await db.query(`UPDATE sat_permisos_usuarios
            SET permiso_app=$1, opc_alerta_temprana=$2, opc_atencion_crisis=$3, opc_dashboard=$4, 
            permiso_web=$5, opc_administracion=$6, opc_catalogos=$7, opc_dashboard_web=$8, fecha_mod_reg=$9, 
            cod_usu_ing=$10, cod_usu_mod=$11, permiso_ver_app=$12, permiso_editar_app=$13, permiso_ver_web=$14, 
            permiso_editar_web=$15
            WHERE id_usuario = $16`,[val_permiso_app, val_opc_alerta_temprana, val_opc_atencion_crisis, val_opc_dashboard, val_permiso_web, val_opc_administracion, val_opc_catalogos, val_opc_dashboard_web, fecha_mod_reg, cod_usu_ing, cod_usu_mod, 
                val_permiso_ver_app, val_permiso_editar_app, val_permiso_ver_web, val_permiso_editar_web, id_usuario], (err, results)=> {
                    if(err){
                        log('src/controllers/front', 'users', 'updateUsersAuthotization', err, false, req, res);
                    }else{
                        req.flash('warning', 'Permisos actualizado correctamente');
                        res.redirect('/api-sat/users-list');
                    }
                });   
        } catch (error) {
            log('src/controllers/front', 'users', 'updateUsersAuthotization', error, false, req, res);
        }
};

let userProfile = async(req, res) =>{
    return res.render('users/users_profile');
};

module.exports = {
    usersList,
    getById,
    usersAuthotization,
    updateUsersAuthotization,
    userProfile
}