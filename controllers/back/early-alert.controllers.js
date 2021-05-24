const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let earlyAlertsList = async(req, res) => {

    try {
        
        var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Alertas Tempranas.", instance: "early-alert/earlyAlertsList" });

        await db.query(`SELECT id_alerta_temprana, id_tipo_fuente, id_fuente, nombre_medio_prensa, paginas_prensa, 
        fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, 
        nombre_programa_radio, fecha_emision_radio, nombre_red_social, url_red_social, 
        fecha_pub_red_social, pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, 
        telefono_colectivo, nombre_organismo, nombre_contacto_organismo, telefono_organismo, 
        datos_organismo, nombre_mensajeria, nombre_contacto_mensajeria, contacto_mensajeria, 
        datos_mensajeria, otras_detalle, otras_adicionales, fecha_hechos, fecha_futura_hechos, 
        fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona, descripcion_hechos, 
        id_derecho, id_escenario, id_tematica_relacionada, id_sub_tematica, antecedentes_hecho, 
        poblacion_afectada, contraparte, perfil_actor, id_grupo_vulnerable, demanda_solicitud, 
        poblacion_ninos, poblacion_ninas, poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, 
        poblacion_mujer_mayor, cantidad_aproximada, id_fase_conflicto, id_tipo_alerta, id_accion_pddh, 
        estado_modulo
        FROM sat_alerta_temprana
        ORDER BY id_alerta_temprana ASC`, (err, results)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json(errorResponse.toJson());
            }else{
                var earlyAlerts = results.rows;
                return res.status(200).json({ earlyAlerts });
            }
        });   
    } catch (error) {
        log('src/controllers/back', 'earlt-alert', 'earlyAlertsList', error, true, req, res);
        return res.status(500).json(errorResponse.toJson());
    }
};

let createEarlyAlert = async (req, res) => {
    const { id_tipo_fuente, id_fuente, nombre_medio_prensa, paginas_prensa, fecha_publicacion_prensa, fotografia_prensa,
        nombre_medio_radio, canal_radio, nombre_programa_radio, fecha_emision_radio, nombre_red_social, url_red_social,
        fecha_pub_red_social, pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo,
        nombre_organismo, nombre_contacto_organismo, telefono_organismo, datos_organismo, nombre_mensajeria,
        nombre_contacto_mensajeria, contacto_mensajeria, datos_mensajeria, otras_detalle, otras_adicionales,
        fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona,
        descripcion_hechos, id_derecho, id_escenario, id_tematica_relacionada, id_sub_tematica, antecedentes_hecho,
        poblacion_afectada, contraparte, perfil_actor, id_grupo_vulnerable, demanda_solicitud, poblacion_ninos,
        poblacion_ninas, poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor,
        cantidad_aproximada, id_fase_conflicto, id_tipo_alerta, id_accion_pddh, fecha_ing_reg, fecha_mod_reg,
        estado_modulo } = req.body;


    var cod_usu_ing = req.user.user_id;
    var cod_usu_mod = req.user.user_id;

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar crear la Alerta.", instance: "early-alert/createEarlyAlert" });

    try {
        await db.query(`INSERT INTO sat_alerta_temprana(
            id_tipo_fuente, id_fuente, nombre_medio_prensa, paginas_prensa, fecha_publicacion_prensa, fotografia_prensa, 
            nombre_medio_radio, canal_radio, nombre_programa_radio, fecha_emision_radio, nombre_red_social, url_red_social, 
            fecha_pub_red_social, pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, 
            nombre_organismo, nombre_contacto_organismo, telefono_organismo, datos_organismo, nombre_mensajeria, 
            nombre_contacto_mensajeria, contacto_mensajeria, datos_mensajeria, otras_detalle, otras_adicionales, 
            fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona, 
            descripcion_hechos, id_derecho, id_escenario, id_tematica_relacionada, id_sub_tematica, antecedentes_hecho, 
            poblacion_afectada, contraparte, perfil_actor, id_grupo_vulnerable, demanda_solicitud, poblacion_ninos, 
            poblacion_ninas, poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor, 
            cantidad_aproximada, id_fase_conflicto, id_tipo_alerta, id_accion_pddh, fecha_ing_reg, fecha_mod_reg, 
            cod_usu_ing, cod_usu_mod, estado_modulo)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 
                    $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, 
                    $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60)`,
            [id_tipo_fuente, id_fuente, nombre_medio_prensa, paginas_prensa, fecha_publicacion_prensa, fotografia_prensa,
                nombre_medio_radio, canal_radio, nombre_programa_radio, fecha_emision_radio, nombre_red_social, url_red_social,
                fecha_pub_red_social, pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo,
                nombre_organismo, nombre_contacto_organismo, telefono_organismo, datos_organismo, nombre_mensajeria,
                nombre_contacto_mensajeria, contacto_mensajeria, datos_mensajeria, otras_detalle, otras_adicionales,
                fecha_hechos, fecha_futura_hechos, fecha_reporte, 62, id_departamento, id_municipio, id_tipo_zona,
                descripcion_hechos, id_derecho, id_escenario, id_tematica_relacionada, id_sub_tematica, antecedentes_hecho,
                poblacion_afectada, contraparte, perfil_actor, id_grupo_vulnerable, demanda_solicitud, poblacion_ninos,
                poblacion_ninas, poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor,
                cantidad_aproximada, id_fase_conflicto, id_tipo_alerta, id_accion_pddh, fecha_ing_reg, fecha_mod_reg,
                cod_usu_ing, cod_usu_mod, 0], (err, results) => {
                    if (err) {
                      errorResponse.detail = err.message;
                        return res.status(500).json(errorResponse.toJson());
                    } else {

                        var earlyAlerts = results.rows[0];
                        return res.status(201).json({
                            earlyAlerts
                        });
                    }
                });
    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'createConflictPhase', error, false, req, res);
    }
};

let getById = async (req, res)=>{
    const { id_alerta_temprana } = req.params;
    try {
        
      try {

        var early_alert_country = await db.query(`SELECT descripcion FROM sat_alerta_temprana AS sat INNER JOIN admi_pais AS p ON p.id_pais = sat.id_pais 
        WHERE sat.id_alerta_temprana = $1`, [id_alerta_temprana]);
        early_alert_country = early_alert_country.rows;
        
        var early_alert_municipality = await db.query(`SELECT m.descripcion FROM sat_alerta_temprana AS at INNER JOIN admi_municipio AS m ON m.id_municipio = at.id_municipio
        WHERE at.id_alerta_temprana = $1`, [id_alerta_temprana]);
        early_alert_municipality = early_alert_municipality.rows[0]; 

        var early_alert_state = await db.query(`SELECT d.descripcion FROM sat_alerta_temprana AS at INNER JOIN admi_departamento AS d ON d.id_departamento = at.id_departamento
        WHERE at.id_alerta_temprana = $1`, [id_alerta_temprana]);
        early_alert_state = early_alert_state.rows[0];

        var early_alert_zone = await db.query(`SELECT z.nombre_zona FROM sat_alerta_temprana AS sat INNER JOIN sat_zonas AS z ON z.id_zona = sat.id_tipo_zona 
        WHERE sat.id_alerta_temprana = 1`, [id_alerta_temprana]);
        early_alert_zone = early_alert_zone.rows[0];
            

        var scenario = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenario ORDER BY id_escenario ASC');
        scenario = scenario.rows;
    
        var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
        typeZone = typeZone.rows;
    
        var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer FROM admi_municipio WHERE est_reg = 'A'`);
        var municipality = municipality.rows;
    
        var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
        state = state.rows;
        
        var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
        vulnerableGroup = vulnerableGroup.rows;
    
        var conflictSituation = await db.query(`SELECT id_situacion_conflicto::integer AS answer_id, nombre_conflicto AS answer FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
        conflictSituation = conflictSituation.rows;
    
        var aggresionType = await db.query(`SELECT id_tipo_agresion::integer AS answer_id, nombre_agresion AS answer FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
        aggresionType = aggresionType.rows;
  
        var law = await db.query(`SELECT id_cat_derecho::integer AS answer_id, descripcion AS answer FROM admi_cat_derecho WHERE est_reg = 'A'`);
        law = law.rows;
    
        //Prensa Escrita
        var newspapers = {
            section_id: 1,
            dependent: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: 1,
            section_title: "Prensa escrita",
            questions: [
              {
                question_id: "titulo_noticia",
                required: 1,
                question_type: "open",
                question: "Titulo de la noticia"
              },
              {
                question_id: "nombre_medio_prensa",
                question_type: "open",
                question: "Nombre del medio"
              },
              {
                question_id: "paginas_prensa",
                question_type: "open",
                question: "Páginas"
              },
              {
                question_id: "autor_prensa",
                question_type: "open",
                required: 1,
                question: "Autor/a"
              },
              {
                question_id: "fecha_publicacion_prensa",
                question_type: "date",
                question: "Fecha de publicación"
              },
              {
                question_id: "fotografia_prensa",
                question_type: "image",
                question: "Fotografía"
              }
            ]
        }
    
        //Radio Tv
        var radioAndTv =  {
          section_id: 2,
          dependent: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: 2,
          section_title: "Radio/TV",
          questions: [
            {
              question_id: "nombre_medio_radio",
              question_type: "open",
              question: "Nombre del medio"
            },
            {
              question_id: "canal_radio",
              question_type: "open",
              question: "Canal/Emisora"
            },
            {
              question_id: "nombre_programa_radio",
              question_type: "open",
              question: "Nombre del programa"
            },
            {
              question_id: "fecha_emision_radio",
              question_type: "date_time",
              question: "Fecha y Hora de emisión"
            }
          ]
        }
    
        //Social Media
        var socialMedia = {
            section_id: 3,
            dependent_multiple: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: [3,4],
            section_title: "Redes sociales/medios digitales",
            questions: [
              {
                question_id: "titulo_redes",
                required: 1,
                question_type: "open",
                question: "Titulo de la noticia"
              },
              {
                question_id: "nombre_red_social",
                question_type: "open",
                question: "Nombre de la red o medio"
              },
              {
                question_id: "url_red_social",
                question_type: "open",
                question: "URL"
              },
              {
                question_id: "fecha_pub_red_social",
                question_type: "date",
                question: "Fecha de publicación"
              },
              {
                question_id: "pantalla_red_social",
                question_type: "image",
                question: "Captura de pantalla"
              }
            ]
        }
    
        //Colectivos
        var collectives = {
            section_id: 4,
            dependent_multiple: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: [5,6,7],
            section_title: "Colectivos",
            questions: [
              {
                question_id: "nombre_colectivo",
                question_type: "open",
                question: "Nombre colectivo"
              },
              {
                question_id: "nombre_contacto_colectivo",
                question_type: "open",
                question: "Nombre contacto"
              },
              {
                question_id: "telefono_colectivo",
                question_type: "open",
                question: "Teléfono contacto"
              }
            ]
        }
    
        //Organizacion Internacionales  
        var internationalOrganization = {
            section_id: 5,
            dependent_multiple: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: [12,13,16],
            section_title: "Organizaciones internacionales",
            questions: [
              {
                question_id: "nombre_organismo",
                question_type: "open",
                question: "Nombre Organización"
              },
              {
                question_id: "nombre_contacto_organismo",
                question_type: "open",
                question: "Nombre contacto"
              },
              {
                question_id: "correo_organismo",
                required: 1,
                question_type: "open",
                question: "Correo"
              },
              {
                question_id: "telefono_organismo",
                required: 1,
                question_type: "open",
                question: "Teléfono contacto"
              },
              {
                question_id: "datos_organismo",
                required: 1,
                question_type: "open",
                question: "Datos adicionales"
              }
            ]
        }
    
        //Sistema de mensajeria
        var messagingSystem = {
            section_id: 6,
            dependent: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: 14,
            section_title: "Sistemas de mensajería",
            questions: [
              {
                question_id: "nombre_mensajeria",
                question_type: "open",
                question: "Nombre mensajeria"
              },
              {
                question_id: "nombre_contacto_mensajeria",
                question_type: "open",
                question: "Nombre contacto"
              },
              {
                question_id: "contacto_mensajeria",
                question_type: "open",
                question: "Contacto"
              },
              {
                question_id: "datos_mensajeria",
                question_type: "open",
                question: "Datos adicionales"
              },
              {
                question_id: "fotografia_mensajeria",
                question_type: "image",
                question: "Captura de pantalla"
              }
            ]
        }
    
        //Insituciones Gubernamentales
        var governmentInstitutions =  {
            section_id: 66,
            dependent_multiple: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: [8,9,10,11],
            section_title: "Instituciones Gubernamentales",
            questions: [
              {
                question_id: "nombre_inst_gub",
                question_type: "open",
                required: 1,
                question: "Nombre Organización"
              },
              {
                question_id: "contacto_inst_gub",
                question_type: "open",
                required: 1,
                question: "Nombre contacto"
              },
              {
                question_id: "correo_inst_gub",
                question_type: "open",
                required: 1,
                question: "Correo"
              },
              {
                question_id: "telefono_inst_gub",
                required: 1,
                question_type: "open",
                question: "Teléfono Contacto"
              },
              {
                question_id: "datos_inst_gub",
                required: 1,
                question_type: "open",
                question: "Datos Adicionales"
              }
            ]
        }
    
        //Otras
        var other = {
            section_id: 7,
            dependent: 1,
            dependent_section_id: 0,
            dependent_question_id: "id_fuente",
            dependent_answer: 15,
            section_title: "Otras",
            questions: [
              {
                question_id: "otras_detalle",
                question_type: "open",
                question: "Detalle"
              },
              {
                question_id: "otras_adicionales",
                question_type: "open",
                question: "Datos adicionales"
              }
            ]
        }
    
        //Información relacionada al hecho
        var factInformation = {
            section_id: 8,
            section_title: "Información relacionada al hecho/situación/problema",
            bold_title: 1,
            questions: [
              {
                question_id: "fecha_hechos",
                question_type: "date_time_before",
                question: "Fecha y hora del hecho/Situación/Problema"
              },
              {
                question_id: "fecha_futura_hechos",
                question_type: "switch",
                question: "Fecha Futura"
              },
              {
                question_id: "fecha_reporte",
                dependent: 1,
                dependent_section_id: 8,
                dependent_question_id: "fecha_futura_hechos",
                dependent_answer: true,
                question_type: "date_after",
                question: "Fecha de reporte del hecho/Situación/Problema"
              }
            ]
        }
        
        //Lugar especifico del hecho
        var specificPlace = {
            section_id: 9,
            section_title: "Lugar específico del hecho/Situación/Problema",
            questions: [
              {
                question_id: "id_pais",
                enabled: 0,
                question_type: "open",
                question: "Pais",
                answer: early_alert_country
              },
              {
                question_id: "id_departamento",
                question_type: "state",
                question: "Departamento",
                answers: early_alert_state
              },
              {
                question_id: "id_municipio",
                question_type: "closed",
                question: "Municipio",
                answers: early_alert_municipality
              },
              {
                question_id: "id_tipo_zona",
                question_type: "closed",
                question: "Tipo de Zona",
                answers: early_alert_zone
              },
              {
                question_id: "descripcion_hechos",
                question_type: "area",
                question: "Breve descripción del hecho/Situación/Problema",
                limit: 500
              },
              {
                question_id: "id_derecho",
                question_type: "closed",
                question: "Derecho",
                answers: law
              },
              {
                question_id: "id_escenario",
                question_type: "closed",
                question: "Escenario",
                answers: scenario
              },
              {
                question_id: "id_sub_tematica",
                question_type: "closed",
                question: "Sub Temática",
                answers: []
              },
              {
                question_id: "antecedentes_hecho",
                question_type: "area",
                question: "Antecedente del hecho/Situación/Problema"
              }
            ]
        }
    
        //Partes Involucradas Directamente
        var partiesInvolved = {
            section_id: 11,
            section_title: "Partes involucradas directamente",
            questions: [
              {
                question_id: "poblacion_afectada",
                question_type: "open",
                question: "Población afectada"
              },
              {
                question_id: "contraparte",
                question_type: "open",
                question: "Contraparte"
              },
              {
                question_id: "perfil_actor",
                question_type: "open",
                question: "Perfil de actores"
              },
              {
                question_id: "id_grupo_vulnerable",
                required: 1,
                question_type: "closed_multiple",
                question: "Grupos en condición de vulnerabilidad",
                answers: vulnerableGroup
              },
              {
                question_id: "demanda_solicitud",
                question_type: "area",
                question: "Demanda o solicitud de la población afectada a las autoridades competentes",
                hint: "Escriba aqui..."
              },
              {
                question_id: "postura_autoridades",
                question_type: "area",
                question: "Postura de las autoridades y/o contrapartes",
                hint: "Escriba aqui..."
              }
            ]
        }
    
        //Población afectada Indeterminada/Determinada ****************
        var affectedPopulation = {
            section_id: 12,
            section_title: "Población afectada Indeterminada/Determinada",
            bold_title: 1,
            questions: []
        }
    
        //Poblacion Determinada
        var determinedPopulation = {
            section_id: 13,
            section_title: "Población determinada",
            questions: [
              {
                question_id: "poblacion_ninos",
                question_type: "numeric",
                question: "Niños"
              },
              {
                question_id: "poblacion_ninas",
                question_type: "numeric",
                question: "Niñas"
              },
              {
                question_id: "adolecentes_mujeres",
                required: 1,
                question_type: "numeric",
                question: "Adolecentes Mujeres"
              },
              {
                question_id: "adolecentes_hombres",
                required: 1,
                question_type: "numeric",
                question: "Adolecentes Hombres"
              },
              {
                question_id: "poblacion_hombres",
                question_type: "numeric",
                question: "Hombres"
              },
              {
                question_id: "poblacion_mujeres",
                question_type: "numeric",
                question: "Mujeres"
              },
              {
                question_id: "poblacion_hombre_mayor",
                question_type: "numeric",
                question: "Hombres adulto mayor"
              },
              {
                question_id: "poblacion_mujer_mayor",
                question_type: "numeric",
                question: "Mujeres adulto mayor"
              }
      
            ]
        }
    
        //Poblacion Determinada
        var numberPopulationDetermined =  {
            section_id: 14,
            section_title: "Población indeterminada",
            questions: [
              {
                question_id: "cantidad_aproximada",
                question_type: "numeric",
                question: "Cantidad aproximada"
              }
            ]
        }
    
        //Valoracion de Fase de Conflicto
        var conflictPhaseAssessment =  {
            section_id: 15,
            section_title: "Valoración de fase del conflicto",
            questions: [
              {
                question_id: "id_tipo_agresion", //89
                required: 1,
                question_type: "switch",
                question: "¿Se ha producido algún tipo de agresión?"
              },
              {
                question_id: "id_tipo_agresion",
                required: 1,
                dependent: 1,
                dependent_section_id: 15,
                dependent_question_id: "id_tipo_agresion",//89
                dependent_answer: true,
                question_type: "closed_multiple",
                question: "Tipo de agresión",
                answers: aggresionType
              },
              {
                question_id: "dialogo_conflicto",
                required: 1,
                question_type: "switch",
                question: "¿Existe disposición al diálogo?"
              },
              {
                question_id: "medida_conflicto",
                required: 1,
                question_type: "switch",
                question: "¿Se ha expresado/anunciado la realización de algún tipo de medida de presión?"
              },
              {
                question_id: "dialogo_roto_conflicto",
                required: 1,
                question_type: "switch",
                question: "¿Se rompió dialogo?"
              },
              {
                question_id: "crisis_conflicto",
                required: 1,
                question_type: "switch",
                question: "¿Hubo crisis?"
              },
      
              {
                question_id: "id_fase_conflicto",
                required: 1,
                question_type: "closed",
                question: "Situación actual del conflicto",
                answers: conflictSituation
              },
              {
                question_id: "cant_persona_involucrada",
                required: 1,
                question_type: "switch",
                question: "¿A disminuido la cantidad de personas involucradas?"
              }
            ]
        }
    
        // ---------2
        var  sections = [];
        
        // --------- 3
        var array_questions = []; 
        
        //---------- 4
        var argumentesArrayQuestionsOb1 = {
            question_id: "id_tipo_fuente",
            required: 1,
            question_type: "source_type",
            question: "Tipo de Fuente",
            answers: sourceType
        }
    
        var argumentsArrayQuestionObj2 = {
            question_id: "id_fuente",
            required: 1,
            question_type: "closed",
            question: "Fuente",
            answers: []
          }
    
        array_questions.push(argumentesArrayQuestionsOb1, argumentsArrayQuestionObj2);
        
        //---------- 5
        var arguments_sections = {
            section_id: 0,
            questions:array_questions
        }
        sections.push(arguments_sections, newspapers, radioAndTv, socialMedia, collectives, internationalOrganization, messagingSystem,
            governmentInstitutions, other, factInformation, specificPlace, partiesInvolved, affectedPopulation, determinedPopulation,
            numberPopulationDetermined, conflictPhaseAssessment);
        //1
        var formEarlyAlert = {
            form_id: 0,
            sections: sections
        }
    
        return res.status(200).json({
            form: formEarlyAlert
        })
        
      } catch (error) {
         log('src/controllers/back', 'early-alert', 'geEarlyAlertList', error, true, req, res);
      }
  
      
    } catch (error) {
        log('src/controllers/back', 'early-alert', 'getById', error, false, req, res);
    }
};

let updateEarlyAlert = async (req, res)=>{
    
    const { id_alerta_temprana } = req.params;
    const { nombre_accion, estado } = req.body;

    var cod_usu_ing = req.user.cod_usu_ing;
    var cod_usu_mod = req.user.cod_usu_mod;
    var fecha_mod_reg = new Date().toLocaleString();

    try {

        await db.query(`UPDATE sat_accion_pddh
        SET nombre_accion=$1, fecha_mod_reg=$2, estado=$3
        WHERE id_accion_pddh = $4`, [nombre_accion, fecha_mod_reg, estado, id_accion_pddh], (err, results)=>{
            if(err){
                log('src/controllers/front', 'actions-pddh', 'updateActionPDDH', err, false, req, res);
             }else{
                req.flash('warning', 'Tipo de fuente actualizado correctamente');
                return res.redirect('/api-sat/actions-pddh-list');
            }
        });   

    } catch (error) {
        log('src/controllers/front', 'actions-pddh', 'updateActionPDDH', error, false, req, res);
    }

};

let geEarlyAlertList = async(req, res)=>{
    
    try {

      var sourceType = await db.query('SELECT id_tipo_fuente::integer AS answer_id, nombre_tipo_fuente AS answer FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
      sourceType = sourceType.rows;
  
      var source = await db.query('SELECT id_fuente::integer AS answer_id, nombre_fuente AS answer FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
      source = source.rows;
  
      var scenario = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenario ORDER BY id_escenario ASC');
      scenario = scenario.rows;
  
      var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
      typeZone = typeZone.rows;
  
      var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer FROM admi_municipio WHERE est_reg = 'A'`);
      var municipality = municipality.rows;
  
      var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
      state = state.rows;
      
      var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
      vulnerableGroup = vulnerableGroup.rows;
  
      var conflictSituation = await db.query(`SELECT id_situacion_conflicto::integer AS answer_id, nombre_conflicto AS answer FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
      conflictSituation = conflictSituation.rows;
  
      var aggresionType = await db.query(`SELECT id_tipo_agresion::integer AS answer_id, nombre_agresion AS answer FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
      aggresionType = aggresionType.rows;

      var law = await db.query(`SELECT id_cat_derecho::integer AS answer_id, descripcion AS answer FROM admi_cat_derecho WHERE est_reg = 'A'`);
      law = law.rows;
  
      //Prensa Escrita
      var newspapers = {
          section_id: 1,
          dependent: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: 1,
          section_title: "Prensa escrita",
          questions: [
            {
              question_id: "titulo_noticia",
              required: 1,
              question_type: "open",
              question: "Titulo de la noticia"
            },
            {
              question_id: "nombre_medio_prensa",
              question_type: "open",
              question: "Nombre del medio"
            },
            {
              question_id: "paginas_prensa",
              question_type: "open",
              question: "Páginas"
            },
            {
              question_id: "autor_prensa",
              question_type: "open",
              required: 1,
              question: "Autor/a"
            },
            {
              question_id: "fecha_publicacion_prensa",
              question_type: "date",
              question: "Fecha de publicación"
            },
            {
              question_id: "fotografia_prensa",
              question_type: "image",
              question: "Fotografía"
            }
          ]
      }
  
      //Radio Tv
      var radioAndTv =  {
        section_id: 2,
        dependent: 1,
        dependent_section_id: 0,
        dependent_question_id: "id_fuente",
        dependent_answer: 2,
        section_title: "Radio/TV",
        questions: [
          {
            question_id: "nombre_medio_radio",
            question_type: "open",
            question: "Nombre del medio"
          },
          {
            question_id: "canal_radio",
            question_type: "open",
            question: "Canal/Emisora"
          },
          {
            question_id: "nombre_programa_radio",
            question_type: "open",
            question: "Nombre del programa"
          },
          {
            question_id: "fecha_emision_radio",
            question_type: "date_time",
            question: "Fecha y Hora de emisión"
          }
        ]
      }
  
      //Social Media
      var socialMedia = {
          section_id: 3,
          dependent_multiple: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: [3,4],
          section_title: "Redes sociales/medios digitales",
          questions: [
            {
              question_id: "titulo_redes",
              required: 1,
              question_type: "open",
              question: "Titulo de la noticia"
            },
            {
              question_id: "nombre_red_social",
              question_type: "open",
              question: "Nombre de la red o medio"
            },
            {
              question_id: "url_red_social",
              question_type: "open",
              question: "URL"
            },
            {
              question_id: "fecha_pub_red_social",
              question_type: "date",
              question: "Fecha de publicación"
            },
            {
              question_id: "pantalla_red_social",
              question_type: "image",
              question: "Captura de pantalla"
            }
          ]
      }
  
      //Colectivos
      var collectives = {
          section_id: 4,
          dependent_multiple: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: [5,6,7],
          section_title: "Colectivos",
          questions: [
            {
              question_id: "nombre_colectivo",
              question_type: "open",
              question: "Nombre colectivo"
            },
            {
              question_id: "nombre_contacto_colectivo",
              question_type: "open",
              question: "Nombre contacto"
            },
            {
              question_id: "telefono_colectivo",
              question_type: "open",
              question: "Teléfono contacto"
            }
          ]
      }
  
      //Organizacion Internacionales  
      var internationalOrganization = {
          section_id: 5,
          dependent_multiple: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: [12,13,16],
          section_title: "Organizaciones internacionales",
          questions: [
            {
              question_id: "nombre_organismo",
              question_type: "open",
              question: "Nombre Organización"
            },
            {
              question_id: "nombre_contacto_organismo",
              question_type: "open",
              question: "Nombre contacto"
            },
            {
              question_id: "correo_organismo",
              required: 1,
              question_type: "open",
              question: "Correo"
            },
            {
              question_id: "telefono_organismo",
              required: 1,
              question_type: "open",
              question: "Teléfono contacto"
            },
            {
              question_id: "datos_organismo",
              required: 1,
              question_type: "open",
              question: "Datos adicionales"
            }
          ]
      }
  
      //Sistema de mensajeria
      var messagingSystem = {
          section_id: 6,
          dependent: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: 14,
          section_title: "Sistemas de mensajería",
          questions: [
            {
              question_id: "nombre_mensajeria",
              question_type: "open",
              question: "Nombre mensajeria"
            },
            {
              question_id: "nombre_contacto_mensajeria",
              question_type: "open",
              question: "Nombre contacto"
            },
            {
              question_id: "contacto_mensajeria",
              question_type: "open",
              question: "Contacto"
            },
            {
              question_id: "datos_mensajeria",
              question_type: "open",
              question: "Datos adicionales"
            },
            {
              question_id: "fotografia_mensajeria",
              question_type: "image",
              question: "Captura de pantalla"
            }
          ]
      }
  
      //Insituciones Gubernamentales
      var governmentInstitutions =  {
          section_id: 66,
          dependent_multiple: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: [8,9,10,11],
          section_title: "Instituciones Gubernamentales",
          questions: [
            {
              question_id: "nombre_inst_gub",
              question_type: "open",
              required: 1,
              question: "Nombre Organización"
            },
            {
              question_id: "contacto_inst_gub",
              question_type: "open",
              required: 1,
              question: "Nombre contacto"
            },
            {
              question_id: "correo_inst_gub",
              question_type: "open",
              required: 1,
              question: "Correo"
            },
            {
              question_id: "telefono_inst_gub",
              required: 1,
              question_type: "open",
              question: "Teléfono Contacto"
            },
            {
              question_id: "datos_inst_gub",
              required: 1,
              question_type: "open",
              question: "Datos Adicionales"
            }
          ]
      }
  
      //Otras
      var other = {
          section_id: 7,
          dependent: 1,
          dependent_section_id: 0,
          dependent_question_id: "id_fuente",
          dependent_answer: 15,
          section_title: "Otras",
          questions: [
            {
              question_id: "otras_detalle",
              question_type: "open",
              question: "Detalle"
            },
            {
              question_id: "otras_adicionales",
              question_type: "open",
              question: "Datos adicionales"
            }
          ]
      }
  
      //Información relacionada al hecho
      var factInformation = {
          section_id: 8,
          section_title: "Información relacionada al hecho/situación/problema",
          bold_title: 1,
          questions: [
            {
              question_id: "fecha_hechos",
              question_type: "date_time_before",
              question: "Fecha y hora del hecho/Situación/Problema"
            },
            {
              question_id: "fecha_futura_hechos",
              question_type: "switch",
              question: "Fecha Futura"
            },
            {
              question_id: "fecha_reporte",
              dependent: 1,
              dependent_section_id: 8,
              dependent_question_id: "fecha_futura_hechos",
              dependent_answer: true,
              question_type: "date_after",
              question: "Fecha de reporte del hecho/Situación/Problema"
            }
          ]
      }
      
      //Lugar especifico del hecho
      var specificPlace = {
          section_id: 9,
          section_title: "Lugar específico del hecho/Situación/Problema",
          questions: [
            {
              question_id: "id_pais",
              enabled: 0,
              question_type: "open",
              question: "Pais",
              answer: "El Salvador"
            },
            {
              question_id: "id_departamento",
              question_type: "state",
              question: "Departamento",
              answers: state
            },
            {
              question_id: "id_municipio",
              question_type: "closed",
              question: "Municipio",
              answers: []
            },
            {
              question_id: "id_tipo_zona",
              question_type: "closed",
              question: "Tipo de Zona",
              answers: typeZone
            },
            {
              question_id: "descripcion_hechos",
              question_type: "area",
              question: "Breve descripción del hecho/Situación/Problema",
              limit: 500
            },
            {
              question_id: "id_derecho",
              question_type: "closed",
              question: "Derecho",
              answers: law
            },
            {
              question_id: "id_escenario",
              question_type: "closed",
              question: "Escenario",
              answers: scenario
            },
            {
              question_id: "id_sub_tematica",
              question_type: "closed",
              question: "Sub Temática",
              answers: []
            },
            {
              question_id: "antecedentes_hecho",
              question_type: "area",
              question: "Antecedente del hecho/Situación/Problema"
            }
          ]
      }
  
      //Partes Involucradas Directamente
      var partiesInvolved = {
          section_id: 11,
          section_title: "Partes involucradas directamente",
          questions: [
            {
              question_id: "poblacion_afectada",
              question_type: "open",
              question: "Población afectada"
            },
            {
              question_id: "contraparte",
              question_type: "open",
              question: "Contraparte"
            },
            {
              question_id: "perfil_actor",
              question_type: "open",
              question: "Perfil de actores"
            },
            {
              question_id: "id_grupo_vulnerable",
              required: 1,
              question_type: "closed_multiple",
              question: "Grupos en condición de vulnerabilidad",
              answers: vulnerableGroup
            },
            {
              question_id: "demanda_solicitud",
              question_type: "area",
              question: "Demanda o solicitud de la población afectada a las autoridades competentes",
              hint: "Escriba aqui..."
            },
            {
              question_id: "postura_autoridades",
              question_type: "area",
              question: "Postura de las autoridades y/o contrapartes",
              hint: "Escriba aqui..."
            }
          ]
      }
  
      //Población afectada Indeterminada/Determinada ****************
      var affectedPopulation = {
          section_id: 12,
          section_title: "Población afectada Indeterminada/Determinada",
          bold_title: 1,
          questions: []
      }
  
      //Poblacion Determinada
      var determinedPopulation = {
          section_id: 13,
          section_title: "Población determinada",
          questions: [
            {
              question_id: "poblacion_ninos",
              question_type: "numeric",
              question: "Niños"
            },
            {
              question_id: "poblacion_ninas",
              question_type: "numeric",
              question: "Niñas"
            },
            {
              question_id: "adolecentes_mujeres",
              required: 1,
              question_type: "numeric",
              question: "Adolecentes Mujeres"
            },
            {
              question_id: "adolecentes_hombres",
              required: 1,
              question_type: "numeric",
              question: "Adolecentes Hombres"
            },
            {
              question_id: "poblacion_hombres",
              question_type: "numeric",
              question: "Hombres"
            },
            {
              question_id: "poblacion_mujeres",
              question_type: "numeric",
              question: "Mujeres"
            },
            {
              question_id: "poblacion_hombre_mayor",
              question_type: "numeric",
              question: "Hombres adulto mayor"
            },
            {
              question_id: "poblacion_mujer_mayor",
              question_type: "numeric",
              question: "Mujeres adulto mayor"
            }
    
          ]
      }
  
      //Poblacion Determinada
      var numberPopulationDetermined =  {
          section_id: 14,
          section_title: "Población indeterminada",
          questions: [
            {
              question_id: "cantidad_aproximada",
              question_type: "numeric",
              question: "Cantidad aproximada"
            }
          ]
      }
  
      //Valoracion de Fase de Conflicto
      var conflictPhaseAssessment =  {
          section_id: 15,
          section_title: "Valoración de fase del conflicto",
          questions: [
            {
              question_id: "id_tipo_agresion", //89
              required: 1,
              question_type: "switch",
              question: "¿Se ha producido algún tipo de agresión?"
            },
            {
              question_id: "id_tipo_agresion",
              required: 1,
              dependent: 1,
              dependent_section_id: 15,
              dependent_question_id: "id_tipo_agresion",//89
              dependent_answer: true,
              question_type: "closed_multiple",
              question: "Tipo de agresión",
              answers: aggresionType
            },
            {
              question_id: "dialogo_conflicto",
              required: 1,
              question_type: "switch",
              question: "¿Existe disposición al diálogo?"
            },
            {
              question_id: "medida_conflicto",
              required: 1,
              question_type: "switch",
              question: "¿Se ha expresado/anunciado la realización de algún tipo de medida de presión?"
            },
            {
              question_id: "dialogo_roto_conflicto",
              required: 1,
              question_type: "switch",
              question: "¿Se rompió dialogo?"
            },
            {
              question_id: "crisis_conflicto",
              required: 1,
              question_type: "switch",
              question: "¿Hubo crisis?"
            },
    
            {
              question_id: "id_fase_conflicto",
              required: 1,
              question_type: "closed",
              question: "Situación actual del conflicto",
              answers: conflictSituation
            },
            {
              question_id: "cant_persona_involucrada",
              required: 1,
              question_type: "switch",
              question: "¿A disminuido la cantidad de personas involucradas?"
            }
          ]
      }
  
      // ---------2
      var  sections = [];
      
      // --------- 3
      var array_questions = []; 
      
      //---------- 4
      var argumentesArrayQuestionsOb1 = {
          question_id: "id_tipo_fuente",
          required: 1,
          question_type: "source_type",
          question: "Tipo de Fuente",
          answers: sourceType
      }
  
      var argumentsArrayQuestionObj2 = {
          question_id: "id_fuente",
          required: 1,
          question_type: "closed",
          question: "Fuente",
          answers: []
        }
  
      array_questions.push(argumentesArrayQuestionsOb1, argumentsArrayQuestionObj2);
      
      //---------- 5
      var arguments_sections = {
          section_id: 0,
          questions:array_questions
      }
      sections.push(arguments_sections, newspapers, radioAndTv, socialMedia, collectives, internationalOrganization, messagingSystem,
          governmentInstitutions, other, factInformation, specificPlace, partiesInvolved, affectedPopulation, determinedPopulation,
          numberPopulationDetermined, conflictPhaseAssessment);
      //1
      var formEarlyAlert = {
          form_id: 0,
          sections: sections
      }
  
      return res.status(200).json({
          form: formEarlyAlert
      })
      
    } catch (error) {
       log('src/controllers/back', 'early-alert', 'geEarlyAlertList', error, true, req, res);
    }


    
};

module.exports = {
    earlyAlertsList,
    createEarlyAlert,
    getById,
    updateEarlyAlert,
    geEarlyAlertList 
}