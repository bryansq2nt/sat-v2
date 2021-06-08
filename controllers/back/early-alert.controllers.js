const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');

let earlyAlertsList = async (req, res) => {
  const { offset } = req.query;
  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Alertas Tempranas.", instance: "early-alert/earlyAlertsList" });


    await db.query(`SELECT id_alerta_temprana::numeric AS form_id, analizada AS analyzed FROM sat_alerta_temprana ORDER BY id_alerta_temprana DESC LIMIT 25 OFFSET $1`, [offset], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
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
  const {
    id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
    fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
    fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
    pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
    nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
    contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
    contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
    fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona,
    descripcion_hechos, id_derecho, id_escenarios, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva, 
    id_criterio, id_temporalidad, cantidad, id_scenario, antecedentes_hecho, poblacion_afectada, contraparte, 
    id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos,poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, 
    poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor,poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho, 
    proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
    id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
    presencia_fuerza_publica, intervencion_fuerza_publica} = req.body;



  var cod_usu = req.user.user_id;

  var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar crear la Alerta.", instance: "early-alert/createEarlyAlert" });

  try {
    await db.query(`INSERT INTO sat_alerta_temprana(
      id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, 
      autor_prensa, fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio, 
      fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social, pantalla_red_social, 
      nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo, nombre_contacto_organismo, 
      correo_organismo, telefono_organismo, datos_organismo, nombre_mensajeria, nombre_contacto_mensajeria, 
      contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, nombre_inst_gub, contacto_inst_gub, correo_inst_gub, 
      telefono_inst_gub, datos_inst_gub, otras_detalle, otras_adicionales, fecha_hechos, fecha_futura_hechos, fecha_reporte, 
      id_pais, id_departamento, id_municipio, id_tipo_zona, descripcion_hechos, id_derecho, id_escenarios, id_tematica_relacionada, 
      id_sub_tematica, id_situacion_conflictiva, id_criterio, id_temporalidad, cantidad, id_scenario, antecedentes_hecho, 
      poblacion_afectada, contraparte, id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos, 
      poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, 
      poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho, proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, 
      medida_conflicto, dialogo_roto_conflicto, crisis_conflicto, id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, 
      cant_persona_involucrada, presencia_fuerza_publica, intervencion_fuerza_publica, cod_usu_ing, cod_usu_mod)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 
                    $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, 
                    $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, 
                    $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84,
                    $85, $86)`,
      [id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
        fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
        fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
        pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
        nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
        contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
        contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
        fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona,
        descripcion_hechos, id_derecho, id_escenarios, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva, 
        id_criterio, id_temporalidad, cantidad, id_scenario, antecedentes_hecho, poblacion_afectada, contraparte, 
        id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos,poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, 
        poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor,poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho, 
        proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
        id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
        presencia_fuerza_publica, intervencion_fuerza_publica, cod_usu, cod_usu], (err, results) => {
          if (err) {
            console.log(err);
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

let getById = async (req, res) => {
  const { id_alerta_temprana } = req.params;
  try {

    var early_alert = await db.query(`SELECT * FROM sat_alerta_temprana WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    early_alert = early_alert.rows[0];

    var sourceType = await db.query('SELECT id_tipo_fuente::integer AS answer_id, nombre_tipo_fuente AS answer FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente::integer AS answer_id, nombre_fuente AS answer FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    //var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    //country = country.rows[0];

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer FROM admi_municipio WHERE est_reg = 'A'`);
    var municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto::integer AS answer_id, nombre_conflicto AS answer FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var aggresionType = await db.query(`SELECT id_tipo_agresion::integer AS answer_id, nombre_agresion AS answer FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
    aggresionType = aggresionType.rows;

    var law = await db.query(`SELECT id_cat_derecho::integer AS answer_id, descripcion AS answer FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad::integer AS answer_id, nombre_temporalidad AS answer FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema::integer AS answer_id, nombre_tema AS answer FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var profileActors = await db.query(`SELECT id_perfil_actor::integer AS answer_id, nombre_actor AS answer FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho::integer AS answer_id, nombre_hecho AS answer FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;


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
          question: "Titulo de la noticia",
          answer: early_alert.titulo_noticia
        },
        {
          question_id: "nombre_medio_prensa",
          question_type: "open",
          question: "Nombre del medio",
          answer: early_alert.nombre_medio_prensa
        },
        {
          question_id: "paginas_prensa",
          question_type: "open",
          question: "Páginas",
          answer: early_alert.paginas_prensa
        },
        {
          question_id: "autor_prensa",
          question_type: "open",
          required: 1,
          question: "Autor/a",
          answer: early_alert.autor_prensa
        },
        {
          question_id: "fecha_publicacion_prensa",
          question_type: "date",
          question: "Fecha de publicación",
          answer: early_alert.fecha_publicacion_prensa
        },
        {
          question_id: "fotografia_prensa",
          question_type: "image",
          question: "Fotografía",
          answer: early_alert.fotografia_prensa
        }
      ]
    }

    //Radio Tv
    var radioAndTv = {
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
          question: "Nombre del medio",
          answer: early_alert.nombre_medio_radio
        },
        {
          question_id: "canal_radio",
          question_type: "open",
          question: "Canal/Emisora",
          answer: early_alert.canal_radio
        },
        {
          question_id: "nombre_programa_radio",
          question_type: "open",
          question: "Nombre del programa",
          answer: early_alert.nombre_programa_radio
        },
        {
          question_id: "fecha_emision_radio",
          question_type: "date_time",
          question: "Fecha y Hora de emisión",
          answer: early_alert.fecha_emision_radio
        }
      ]
    }

    //Social Media
    var socialMedia = {
      section_id: 3,
      dependent_multiple: 1,
      dependent_section_id: 0,
      dependent_question_id: "id_fuente",
      dependent_answer: [3, 4],
      section_title: "Redes sociales/medios digitales",
      questions: [
        {
          question_id: "titulo_redes",
          required: 1,
          question_type: "open",
          question: "Titulo de la noticia",
          answer: early_alert.titulo_redes
        },
        {
          question_id: "nombre_red_social",
          question_type: "open",
          question: "Nombre de la red o medio",
          answer: early_alert.nombre_red_social
        },
        {
          question_id: "url_red_social",
          question_type: "open",
          question: "URL",
          answer: early_alert.url_red_social
        },
        {
          question_id: "fecha_pub_red_social",
          question_type: "date",
          question: "Fecha de publicación",
          answer: early_alert.fecha_pub_red_social
        },
        {
          question_id: "pantalla_red_social",
          question_type: "image",
          question: "Captura de pantalla",
          answer: early_alert.pantalla_red_social
        }
      ]
    }

    //Colectivos
    var collectives = {
      section_id: 4,
      dependent_multiple: 1,
      dependent_section_id: 0,
      dependent_question_id: "id_fuente",
      dependent_answer: [5, 6, 7],
      section_title: "Colectivos",
      questions: [
        {
          question_id: "nombre_colectivo",
          question_type: "open",
          question: "Nombre colectivo",
          answer: early_alert.nombre_colectivo
        },
        {
          question_id: "nombre_contacto_colectivo",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_colectivo
        },
        {
          question_id: "telefono_colectivo",
          question_type: "open",
          question: "Teléfono contacto",
          answer: early_alert.telefono_colectivo
        }
      ]
    }

    //Organizacion Internacionales  
    var internationalOrganization = {
      section_id: 5,
      dependent_multiple: 1,
      dependent_section_id: 0,
      dependent_question_id: "id_fuente",
      dependent_answer: [12, 13, 16],
      section_title: "Organizaciones internacionales",
      questions: [
        {
          question_id: "nombre_organismo",
          question_type: "open",
          question: "Nombre Organización",
          answer: early_alert.nombre_organismo
        },
        {
          question_id: "nombre_contacto_organismo",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_organismo
        },
        {
          question_id: "correo_organismo",
          required: 1,
          question_type: "open",
          question: "Correo",
          answer: early_alert.correo_organismo
        },
        {
          question_id: "telefono_organismo",
          required: 1,
          question_type: "open",
          question: "Teléfono contacto",
          answer: early_alert.telefono_organismo
        },
        {
          question_id: "datos_organismo",
          required: 1,
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.datos_organismo
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
          question: "Nombre mensajeria",
          answer: early_alert.nombre_mensajeria
        },
        {
          question_id: "nombre_contacto_mensajeria",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_mensajeria
        },
        {
          question_id: "contacto_mensajeria",
          question_type: "open",
          question: "Contacto",
          answer: early_alert.contacto_mensajeria
        },
        {
          question_id: "datos_mensajeria",
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.datos_mensajeria
        },
        {
          question_id: "fotografia_mensajeria",
          question_type: "image",
          question: "Captura de pantalla",
          answer: early_alert.fotografia_mensajeria
        }
      ]
    }

    //Insituciones Gubernamentales
    var governmentInstitutions = {
      section_id: 66,
      dependent_multiple: 1,
      dependent_section_id: 0,
      dependent_question_id: "id_fuente",
      dependent_answer: [8, 9, 10, 11],
      section_title: "Instituciones Gubernamentales",
      questions: [
        {
          question_id: "nombre_inst_gub",
          question_type: "open",
          required: 1,
          question: "Nombre Organización",
          answer: early_alert.nombre_inst_gub
        },
        {
          question_id: "contacto_inst_gub",
          question_type: "open",
          required: 1,
          question: "Nombre contacto",
          answer: early_alert.contacto_inst_gub
        },
        {
          question_id: "correo_inst_gub",
          question_type: "open",
          required: 1,
          question: "Correo",
          answer: early_alert.correo_inst_gub
        },
        {
          question_id: "telefono_inst_gub",
          required: 1,
          question_type: "open",
          question: "Teléfono Contacto",
          answer: early_alert.telefono_inst_gub
        },
        {
          question_id: "datos_inst_gub",
          required: 1,
          question_type: "open",
          question: "Datos Adicionales",
          answer: early_alert.datos_inst_gub
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
          question: "Detalle",
          answer: early_alert.otras_detalle
        },
        {
          question_id: "otras_adicionales",
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.otras_adicionales
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
          question: "Fecha y hora del hecho/Situación/Problema",
          answer: early_alert.fecha_hechos
        },
        {
          question_id: "fecha_futura_hechos",
          question_type: "switch",
          question: "Fecha Futura",
          answer: early_alert.fecha_futura_hechos
        },
        {
          question_id: "fecha_reporte",
          dependent: 1,
          dependent_section_id: 8,
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: true,
          question_type: "date_after",
          question: "Fecha de reporte del hecho/Situación/Problema",
          answer: early_alert.fecha_reporte
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
          answers: state,
          answer: Number.parseInt(early_alert.id_departamento)
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          question: "Municipio",
          answers: municipality,
          answer: Number.parseInt(early_alert.id_municipio)
        },
        {
          question_id: "id_tipo_zona",
          question_type: "closed",
          question: "Tipo de Zona",
          answers: typeZone,
          answer: Number.parseInt(early_alert.id_tipo_zona)
        },
        {
          question_id: "descripcion_hechos",
          question_type: "area",
          question: "Breve descripción del hecho/Situación/Problema",
          limit: 500,
          answer: early_alert.descripcion_hechos
        },
        {
          question_id: "id_derecho",
          question_type: "closed",
          question: "Derecho",
          answers: law,
          answer: Number.parseInt(early_alert.id_derecho)
        },
        {
          question_id: "id_escenario",
          question_type: "closed",
          question: "Escenario",
          answers: scenario,
          answer: Number.parseInt(early_alert.id_escenario)
        },
        {
          question_id: "id_sub_tematica",
          question_type: "closed",
          question: "Sub Temática",
          answers: [],
          answer: Number.parseInt(early_alert.id_sub_tematica)
        },
        {
          question_id: "antecedentes_hecho",
          question_type: "area",
          question: "Antecedente del hecho/Situación/Problema",
          answer: early_alert.antecedentes_hecho
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
          question: "Población afectada",
          answer: early_alert.poblacion_afectada
        },
        {
          question_id: "contraparte",
          question_type: "open",
          question: "Contraparte",
          answer: early_alert.contraparte
        },
        {
          question_id: "id_perfil_actor",
          question_type: "closed_multiple",
          question: "Perfil de actores",
          answers: profileActors,
          answer: Number.parseInt(early_alert.id_perfil_actor)
          
        },
        {
          question_id: "id_grupo_vulnerable",
          required: 1,
          question_type: "closed_multiple",
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup,
          answer: Number.parseInt(early_alert.id_grupo_vulnerable)
        },
        {
          question_id: "demanda_solicitud",
          question_type: "area",
          question: "Demanda o solicitud de la población afectada a las autoridades competentes",
          hint: "Escriba aqui...",
          answer: early_alert.demanda_solicitud
        },
        {
          question_id: "postura_autoridades",
          question_type: "area",
          question: "Postura de las autoridades y/o contrapartes",
          hint: "Escriba aqui...",
          answer: early_alert.postura_autoridades
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
          question: "Niños",
          answer: early_alert.poblacion_ninos
        },
        {
          question_id: "poblacion_ninas",
          question_type: "numeric",
          question: "Niñas",
          answer: early_alert.poblacion_ninas
        },
        {
          question_id: "adolecentes_mujeres",
          required: 1,
          question_type: "numeric",
          question: "Adolecentes Mujeres",
          answer: early_alert.adolecentes_mujeres
        },
        {
          question_id: "adolecentes_hombres",
          required: 1,
          question_type: "numeric",
          question: "Adolecentes Hombres",
          answer: early_alert.adolecentes_hombres
        },
        {
          question_id: "poblacion_hombres",
          question_type: "numeric",
          question: "Hombres",
          answer: early_alert.poblacion_hombres
        },
        {
          question_id: "poblacion_mujeres",
          question_type: "numeric",
          question: "Mujeres",
          answer: early_alert.poblacion_mujeres
        },
        {
          question_id: "poblacion_hombre_mayor",
          question_type: "numeric",
          question: "Hombres adulto mayor",
          answer: early_alert.poblacion_hombre_mayor
        },
        {
          question_id: "poblacion_mujer_mayor",
          question_type: "numeric",
          question: "Mujeres adulto mayor",
          answer: early_alert.poblacion_mujer_mayor
        }

      ]
    }

    //Poblacion Determinada
    var numberPopulationDetermined = {
      section_id: 14,
      section_title: "Población indeterminada",
      questions: [
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          question: "Cantidad aproximada",
          answer: early_alert.cantidad_aproximada
        }
      ]
    }

    //Valoracion de Fase de Conflicto
    var conflictPhaseAssessment = {
      section_id: 15,
      section_title: "Valoración de fase del conflicto",
      questions: [
        {
          question_id: "id_acciones_hecho", 
          required: 1,
          question_type: "closed",
          question: "Acciones del Hecho",
          answers: actionsFact,
          answer:early_alert.id_acciones_hecho
        },
        {
          question_id: "proteccion_vigente",
          required: 1,
          question_type: "switch",
          question: "¿Existen medidas de protección vigentes? ",
          answer:early_alert.proteccion_vigente
        },
        {
          question_id: "hubo_agresion", 
          required: 1,
          question_type: "switch",
          question: "¿Se ha producido algún tipo de agresión?",
          answer: early_alert.hubo_agresion
        },
        {
          question_id: "id_tipo_agresion",
          required: 1,
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "hubo_agresion",
          dependent_answer: true,
          question_type: "closed_multiple",
          question: "Tipo de agresión",
          answers: aggresionType,
          answer: Number.parseInt(early_alert.id_tipo_agresion)
        },
        {
          question_id: "dialogo_conflicto",
          required: 1,
          question_type: "switch",
          question: "¿Existe disposición al diálogo?",
          answer: early_alert.dialogo_conflicto
        },
        {
          question_id: "medida_conflicto",
          required: 1,
          question_type: "switch",
          question: "¿Se ha expresado/anunciado la realización de algún tipo de medida de presión?",
          answer: early_alert.medida_conflicto
        },
        {
          question_id: "dialogo_roto_conflicto",
          required: 1,
          question_type: "switch",
          question: "¿Se rompió dialogo?",
          answer: early_alert.dialogo_roto_conflicto
        },
        {
          question_id: "crisis_conflicto",
          required: 1,
          question_type: "switch",
          question: "¿Hubo crisis?",
          answer: early_alert.crisis_conflicto
        },
        {
          question_id: "id_acciones_hecho_anterior", 
          required: 1,
          question_type: "closed",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "crisis_conflicto",
          dependent_answer: true,
          question: "Acciones del Hecho Anterior",
          answers: [],
          answer: Number.parseInt(early_alert.id_acciones_hecho_anterior)
        },
        {
          question_id: "resolucion_conflicto",
          required: 1,
          question_type: "switch",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "crisis_conflicto",
          dependent_answer: true,
          question: "¿Hubo mecanismos de resolución del conflicto?",
          answer: early_alert.resolucion_conflicto

        },
        {
          question_id: "id_situacion_conflicto",
          required: 1,
          question_type: "closed",
          question: "Situación actual del conflicto",
          answers: conflictSituation,
          answer: Number.parseInt(early_alert.id_situacion_conflicto)
        },
        {
          question_id: "cant_persona_involucrada",
          required: 1,
          question_type: "switch",
          question: "¿A disminuido la cantidad de personas involucradas?",
          answer: early_alert.cant_persona_involucrada
        },
        {
          question_id: "presencia_fuerza_publica",
          required: 1,
          question_type: "switch",
          question: "¿Hubo Presencia de fuerzas públicas",
          answer: early_alert.presencia_fuerza_publica
        },
        {
          question_id: "intervencion_fuerza_publica",
          required: 1,
          question_type: "switch",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "presencia_fuerza_publica",
          dependent_answer: true,
          question: "¿Hubo Intervencion de fuerzas públicas",
          answer: early_alert.intervencion_fuerza_publica
        }
      ]
    }

    // ---------2
    var sections = [];

    // --------- 3
    var array_questions = [];

    //---------- 4
    var argumentesArrayQuestionsOb1 = {
      question_id: "id_tipo_fuente",
      required: 1,
      question_type: "source_type",
      question: "Tipo de Fuente",
      answers: sourceType,
      answer: Number.parseInt(early_alert.id_tipo_fuente)
    }

    var argumentsArrayQuestionObj2 = {
      question_id: "id_fuente",
      required: 1,
      question_type: "closed",
      question: "Fuente",
      answers: source,
      answer: Number.parseInt(early_alert.id_fuente)
    }

    array_questions.push(argumentesArrayQuestionsOb1, argumentsArrayQuestionObj2);

    //---------- 5
    var arguments_sections = {
      section_id: 0,
      questions: array_questions
    }
    sections.push(arguments_sections, newspapers, radioAndTv, socialMedia, collectives, internationalOrganization, messagingSystem,
      governmentInstitutions, other, factInformation, specificPlace, partiesInvolved, affectedPopulation, determinedPopulation,
      numberPopulationDetermined, conflictPhaseAssessment);
    //1
    var formEarlyAlert = {
      form_id: early_alert.id_alerta_temprana,
      sections: sections
    }

    return res.status(200).json({
      form: formEarlyAlert
    })

  } catch (error) {
    log('src/controllers/back', 'early-alert', 'getById', error, false, req, res);
  }
};

let updateEarlyAlert = async (req, res) => {

  const { id_alerta_temprana } = req.params;
  const { id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
    fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
    fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
    pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
    nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
    contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
    contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
    fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
    descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva, 
    id_criterio, id_temporalidad, cantidad, id_scenario, antecedentes_hecho, poblacion_afectada, contraparte, 
    id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos,poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, 
    poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor,poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho, 
    proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
    id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
    presencia_fuerza_publica, intervencion_fuerza_publica } = req.body;

    var localDate =  new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_mod = req.user.id_usuario;

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar la Alerta.", instance: "early-alert/updateEarlyAlert" });


  try {

    await db.query(`UPDATE sat_alerta_temprana
    SET id_tipo_fuente=$1, id_fuente=$2, titulo_noticia=$3, nombre_medio_prensa=$4, paginas_prensa=$5, autor_prensa=$6, 
    fecha_publicacion_prensa=$7, fotografia_prensa=$8, nombre_medio_radio=$9, canal_radio=$10, nombre_programa_radio=$11, 
    fecha_emision_radio=$12, titulo_redes=$13, nombre_red_social=$14, url_red_social=$15, fecha_pub_red_social=$16, pantalla_red_social=$17, 
    nombre_colectivo=$18, nombre_contacto_colectivo=$19, telefono_colectivo=$20, nombre_organismo=$21, nombre_contacto_organismo=$22, 
    correo_organismo=$23, telefono_organismo=$24, datos_organismo=$25, nombre_inst_gub=$26, contacto_inst_gub=$27, 
    correo_inst_gub=$28, telefono_inst_gub=$29, datos_inst_gub=$30, nombre_mensajeria=$31, nombre_contacto_mensajeria=$32, 
    contacto_mensajeria=$33, datos_mensajeria=$34, fotografia_mensajeria=$35, otras_detalle=$36, otras_adicionales=$37, fecha_hechos=$38, 
    fecha_futura_hechos=$39, fecha_reporte=$40, id_pais=$41, id_departamento=$42, id_municipio=$43, id_tipo_zona=$44, id_escenarios=$45, 
    descripcion_hechos=$46, id_derecho=$47, id_tematica_relacionada=$48, id_sub_tematica=$49, id_situacion_conflictiva=$50, id_criterio=$51, 
    id_temporalidad=$52, cantidad=$53, id_scenario=$54, antecedentes_hecho=$55, poblacion_afectada=$56, contraparte=$57, id_perfil_actor=$58, 
    id_grupo_vulnerable=$59, demanda_solicitud=$60, postura_autoridades=$61, poblacion_ninos=$62, poblacion_ninas=$63, adolecentes_mujeres=$64, 
    adolecentes_hombres=$65, poblacion_hombres=$66, poblacion_mujeres=$67, poblacion_hombre_mayor=$68, poblacion_mujer_mayor=$69, cantidad_aproximada=$70, 
    id_acciones_hecho=$71, proteccion_vigente=$72, hubo_agresion=$73, id_tipo_agresion=$74, dialogo_conflicto=$75, medida_conflicto=$76, dialogo_roto_conflicto=$77, 
    crisis_conflicto=$78, id_acciones_hecho_anterior=$79, resolucion_conflicto=$80, id_situacion_conflicto=$81, cant_persona_involucrada=$82, presencia_fuerza_publica=$83, 
    intervencion_fuerza_publica=$84, fecha_mod_reg=$85, cod_usu_mod=$86
    WHERE id_alerta_temprana = $87`, 
      [id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
      fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
      fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
      pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
      nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
      contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
      contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
      fecha_hechos, fecha_futura_hechos, fecha_reporte, 62, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
      descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva, 
      id_criterio, id_temporalidad, cantidad, id_scenario, antecedentes_hecho, poblacion_afectada, contraparte, 
      id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos,poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, 
      poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor,poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho, 
      proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
      id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
      presencia_fuerza_publica, intervencion_fuerza_publica, fecha_mod_reg, cod_usu_mod, id_alerta_temprana], (err, results) => {
      if (err) {
        console.log(err);
        errorResponse.detail = err.message;
        return res.status(500).json(errorResponse.toJson());
      } 
      var earlyAlert = results.rows[0];
      return res.status(200).json({earlyAlert});

    });

  } catch (error) {
    log('src/controllers/back', 'early-alert', 'updateEarlyAlert', error, false, req, res);
  }

};

let getEarlyAlertForm = async (req, res) => {

  try {

    var sourceType = await db.query('SELECT id_tipo_fuente::integer AS answer_id, nombre_tipo_fuente AS answer FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente::integer AS answer_id, nombre_fuente AS answer FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

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

    var temporality = await db.query(`SELECT id_temporalidad::integer AS answer_id, nombre_temporalidad AS answer FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema::integer AS answer_id, nombre_tema AS answer FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var profileActors = await db.query(`SELECT id_perfil_actor::integer AS answer_id, nombre_actor AS answer FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho::integer AS answer_id, nombre_hecho AS answer FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;

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
    var radioAndTv = {
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
      dependent_answer: [3, 4],
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
      dependent_answer: [5, 6, 7],
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
      dependent_answer: [12, 13, 16],
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
    var governmentInstitutions = {
      section_id: 66,
      dependent_multiple: 1,
      dependent_section_id: 0,
      dependent_question_id: "id_fuente",
      dependent_answer: [8, 9, 10, 11],
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
          required: 1,
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          required: 1,
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
          question_id: "id_escenarios",
          question_type: "closed",
          question: "Escenarios",
          answers: scenarios
        },
        {
          question_id: "descripcion_hechos",
          question_type: "area",
          required: 1,
          question: "Breve descripción del hecho/Situación/Problema",
          limit: 500
        },
        {
          question_id: "id_derecho",
          question_type: "closed",
          required: 1,
          question: "Derecho",
          answers: law
        },
        
        {
          question_id: "id_temporalidad",
          question_type: "closed",
          dependent: 1,
          dependent_section_id: 8,
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: true,
          question: "Temporalidad",
          answers: temporality
        },
        {
          question_id: "cantida",
          question_type: "numeric",
          dependent: 1,
          dependent_section_id: 8,
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: true,
          question: "Cantidad"
        },
        {
          question_id: "id_escenario",
          question_type: "closed",
          question: "Escenario",
          answers: scenario
        },
        {
          question_id: "id_tematica_relacionada",
          question_type: "closed",
          question: "Temática",
          answers: topics
        },
        {
          question_id: "id_sub_tematica",
          question_type: "closed",
          question: "Sub Temática",
          answers: []
        },
        {
          question_id: "id_situacion_conflictiva",
          question_type: "closed",
          question: "Situación conflictiva",
          answers: []
        },
        {
          question_id: "id_criterio",
          question_type: "closed",
          question: "Criterio",
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
          required: 1,
          question: "Población afectada"
        },
        {
          question_id: "contraparte",
          question_type: "open",
          required: 1,
          question: "Contraparte"
        },
        {
          question_id: "id_perfil_actor",
          question_type: "closed_multiple",
          required: 1,
          question: "Perfil de actores",
          answers: profileActors
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
          required: 1,
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
    var numberPopulationDetermined = {
      section_id: 14,
      section_title: "Población indeterminada",
      questions: [
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          required: 1,
          question: "Cantidad aproximada"
        }
      ]
    }

    //Valoracion de Fase de Conflicto
    var conflictPhaseAssessment = {
      section_id: 15,
      section_title: "Valoración de fase del conflicto",
      questions: [
        {
          question_id: "id_acciones_hecho", 
          required: 1,
          question_type: "closed",
          question: "Acciones del Hecho",
          answers: actionsFact
        },
        {
          question_id: "proteccion_vigente",
          required: 1,
          question_type: "switch",
          question: "¿Existen medidas de protección vigentes? "
        },
        {
          question_id: "hubo_agresion", 
          required: 1,
          question_type: "switch",
          question: "¿Se ha producido algún tipo de agresión?"
        },
        {
          question_id: "id_tipo_agresion",
          required: 1,
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "hubo_agresion",
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
          question_id: "id_acciones_hecho_anterior", 
          required: 1,
          question_type: "closed",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "crisis_conflicto",
          dependent_answer: true,
          question: "Acciones del Hecho Anterior",
          answers: []
        },
        {
          question_id: "resolucion_conflicto",
          required: 1,
          question_type: "switch",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "crisis_conflicto",
          dependent_answer: true,
          question: "¿Hubo mecanismos de resolución del conflicto?"
        },
        {
          question_id: "id_situacion_conflicto",
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
        },
        {
          question_id: "presencia_fuerza_publica",
          required: 1,
          question_type: "switch",
          question: "¿Hubo Presencia de fuerzas públicas"
        },
        {
          question_id: "intervencion_fuerza_publica",
          required: 1,
          question_type: "switch",
          dependent: 1,
          dependent_section_id: 15,
          dependent_question_id: "presencia_fuerza_publica",
          dependent_answer: true,
          question: "¿Hubo Intervencion de fuerzas públicas"
        }
      ]
    }

    // ---------2
    var sections = [];

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
      questions: array_questions
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

let getFormToAnalyze = async (req,res) => {
  const { id_alerta_temprana } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener el formulario.", instance: "early-alert/getFormToAnalyze" });

    var fases_conflicto = await db.query('SELECT id_fase_conflicto::integer AS answer_id, nombre_fase AS answer FROM sat_fase_conflicto WHERE estado = 1');
    fases_conflicto = fases_conflicto.rows;

    var tipos_alerta = await db.query('SELECT id_tipo_alerta::integer AS answer_id, nombre_alerta AS answer FROM sat_tipo_alerta WHERE estado = 1');
    tipos_alerta = tipos_alerta.rows;

    var acciones_pddh = await db.query('SELECT id_accion_pddh::integer AS answer_id, nombre_accion AS answer FROM sat_accion_pddh WHERE estado = 1');
    acciones_pddh = acciones_pddh.rows;

    var section = {
      section_id: 0,
      questions: [
        {
          question_id: "id_fase_conflicto",
          question_type: "closed",
          question: "Fases del conflicto",
          answers: fases_conflicto
        },
        {
          question_id: "id_tipo_alerta",
          question_type: "closed",
          question: "Tipo de alerta",
          answers: tipos_alerta
        },
        {
          question_id: "id_accion_pddh",
          question_type: "closed",
          question: "Acciones PDDH",
          answers: acciones_pddh
        },
        {
          question_id: "analisis",
          question_type: "area",
          required: 1,
          question: "Analisis"
        },
        {
          question_id: "notificar",
          question_type: "closed",
          question: "Notificar a:",
          answers: []
        },
        {
          question_id: "texto_mensaje",
          question_type: "area",
          required: 1,
          question: "Texto en el Mensaje"
        }
      ]
    }

    var sections = [];
    sections.push(section);

    var formEarlyAlert = {
      form_id: id_alerta_temprana,
      sections
    }

    return res.status(200).json({
      form: formEarlyAlert
    });

  } catch (error) {
    log('src/controllers/back', 'earlt-alert', 'analyzeEarlyAlert', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


}

let analyzeEarlyAlert = async (req,res) => {
  const { id_alerta_temprana } = req.params;
  const { id_fase_conflicto, id_tipo_alerta, id_accion_pddh, analisis, notificar, texto_mensaje} = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar analizar la Alerta.", instance: "early-alert/analyzeEarlyAlert" });


    await db.query(`UPDATE sat_alerta_temprana SET analizada = true, id_fase_conflicto = $1, id_tipo_alerta = $2, id_accion_pddh = $3, analisis = $4, notificar = $5, texto_mensaje = $6 WHERE id_alerta_temprana = $7`, [id_fase_conflicto, id_tipo_alerta, id_accion_pddh,analisis, notificar, texto_mensaje, id_alerta_temprana], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var earlyAlert = results.rows[0];
        return res.status(200).json({ earlyAlert });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'earlt-alert', 'analyzeEarlyAlert', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


}

let searchEarlyAlert = async (req,res) => {
  const { delegate } = req.query;

  try {
    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar procesar su busqueda.", instance: "early-alert/searchEarlyAlert" });

    await db.query(`SELECT id_alerta_temprana::integer AS form_id, analizada AS analyzed FROM sat_alerta_temprana WHERE texto_mensaje ILIKE '%${delegate}%'`,(err,results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }

      var earlyAlerts = results.rows;
      return res.status(200).json({ earlyAlerts });

    });

  } catch (e){
    log('src/controllers/back', 'earlt-alert', 'searchEarlyAlert', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


}

module.exports = {
  earlyAlertsList,
  createEarlyAlert,
  getById,
  updateEarlyAlert,
  getEarlyAlertForm,
  getFormToAnalyze,
  analyzeEarlyAlert,
  searchEarlyAlert
}