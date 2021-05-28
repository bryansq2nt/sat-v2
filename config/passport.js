const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const md5 = require('md5');
const db = require('./db');
const log = require('@lib/catch-error');



module.exports = function(passport) {

     passport.serializeUser(function(user, done) {
        
        done(null, user);
    });

    passport.deserializeUser(function(user,done) {

        done(null, user);
    });

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            async(req, email, password, done) => {
                
                db.query("SELECT * FROM admins WHERE email = $1", [email],async(err,results)=>{
                    if(err){
                        console.log(err.stack);
                        return done(null, false, req.flash('error', err.stack));
                    }

                    if (!results.rows.length) {
                        return done(null, false, req.flash('login', 'Usuario o contraseña incorrectos'));
                    } else {
                      
                        if (!bcrypt.compareSync(password, results.rows[0].password)) {
                         
                            return done(null, false, req.flash('login', 'Usuario o contraseña incorrectos'));
                        }

                        const user = results.rows[0];
                        
                        return done(null, user, null);
                    }
                });
            
                
            })
    );

    passport.use(
        'login-user',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            async (req, email, password, done) => {

                db.query(`SELECT u.id_usuario, u.usuario, u.nombre, u.apellido, u.usuario, u.fec_nacimiento, 
                    u.correo, u.clave, u.estado_reg, u.id_perfil, up.descripcion AS perfil, ac.permiso_acceso_web
                    FROM usuario AS u
                    INNER JOIN perfil AS up ON up.id_perfil = u.id_perfil
                    INNER JOIN sat_accesos_usuario AS ac ON u.id_usuario = ac.id_usuario
                    WHERE u.correo = $1 AND u.estado_reg = 'A' AND ac.permiso_acceso_web = 1`, [email], async (err, results) => {
                    if (err) {
                        console.log(err.stack);
                        return done(null, false, req.flash('error', err.stack));
                    }else{
                        console.log('Filtro 1');
                        if (!results.rows.length) {
                            return done(null, false, req.flash('login', 'Usuario o contraseña incorrectos'));
                        } else {
                            console.log('Filtro 2');
                            var userPassword = md5(password);

                            if (userPassword != results.rows[0].clave) {
                                return done(null, false, req.flash('login', 'Usuario o contraseña incorrectos'));
                            } else {
                                console.log('paso la contrasena');
                                let user = results.rows[0];
                                user.authorizationModuls = []
                                
                                if( results.rows.length > 0){
                                    
                                    authorizationModuls = await db.query(`SELECT mu.id_modulo, m.nombre_modulo  
                                    FROM sat_permisos_modulos_usuario AS mu 
                                    INNER JOIN sat_modulos AS m ON mu.id_modulo = m.id_modulo 
                                    WHERE mu.id_usuario = $1 AND m.tipo_modulo = 2`,[user.id_usuario]);
                                    authorizationModuls = authorizationModuls.rows;
                                    
                                    if(authorizationModuls.length > 0){
                                        for(let i=0; i < authorizationModuls.length; i++){
                                            user.authorizationModuls.push(authorizationModuls[i].id_modulo); 
                                        }
                                    }
                                }

                                return done(null, user, null);
                            }
                        }
                    }
                });
            })
    );
};
