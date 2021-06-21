const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemalertpddh2021@gmail.com',
    pass: '$Pddh2021'
  }
});


let crisisAlertsList = async (req, res) => {
  const { offset } = req.query;

  try {

    var errorResponse = new ErrorModel({ type: "Crisis-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Alertas de Crisis.", instance: "crisis-alert/crisisAlertsList" });

    var cod_usu_ing = req.user.user_id;

    await db.query(`SELECT id_atencion_crisis::integer AS form_id, analizada AS analyzed FROM sat_atencion_crisis WHERE cod_usu_ing = $1 ORDER BY id_atencion_crisis DESC LIMIT 25 OFFSET $2`, [cod_usu_ing, offset], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var crisisAlerts = results.rows;
        return res.status(200).json({ crisisAlerts });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'crisisAlertsList', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let getCrisisAlertsForm = async (req, res) => {

  try {

    var entryType = await db.query('SELECT id_entrada::integer AS answer_id, nombre_entrada AS answer FROM sat_tipo_entrada WHERE estado = 1');
    entryType = entryType.rows;

    var CrisisClasification = await db.query(`SELECT id_calidad_crisis::integer AS answer_id, nombre_calidad_crisis AS answer FROM sat_calidad_clasificacion_crisis WHERE estado = 1`);
    CrisisClasification = CrisisClasification.rows;

    var natureCrisis = await db.query(`SELECT id_nat_sit_crisis::integer AS answer_id, decripcion AS answer FROM admi_nat_sit_crisis WHERE est_reg = 'A'`);
    natureCrisis = natureCrisis.rows;

    var QuelityParticipants = await db.query('SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1 ORDER BY id_calidad_participa ASC')
    QuelityParticipants = QuelityParticipants.rows;

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var age = await db.query(`SELECT id_grp_etario::integer AS answer_id, descripcion AS answer FROM admi_grp_etario WHERE est_reg = 'A' ORDER BY id_grp_etario ASC`);
    age = age.rows;

    var sex = await db.query('SELECT id_sexo::integer AS answer_id, nombre_sexo AS answer FROM sat_sexo WHERE estado = 1 ORDER BY id_sexo ASC');
    sex = sex.rows;

    var gender = await db.query('SELECT id_genero::integer AS answer_id, nombre_genero AS answer FROM sat_genero WHERE estado = 1 ORDER BY id_genero ASC');
    gender = gender.rows;

    var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;


    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    notificationMeans = notificationMeans.rows;

    var participantQuality = await db.query('SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1');
    participantQuality = participantQuality.rows;

    var populationType = await db.query(`SELECT id_poblacion::integer AS answer_id, nombre_poblacion AS answer, estado FROM sat_tipo_poblacion WHERE estado = 1 ORDER BY id_poblacion ASC`);
    populationType = populationType.rows;

    var sections = [];

    var calification = await db.query(`SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1`);
    calification = calification.rows;

    // Datos generales -- VERIFICADO
    var generalData = {
      section_id: 15,
      bold_title: 1,
      section_title: "Datos generales del registro",
      questions: [
        {
          question_id: "fecha_ingreso",
          question_type: "date",
          question: "Fecha Ingreso"
        },
        
        {
          question_id: "via_entrada",
          question_type: "open",
          question: "Via Entrada",
          answer: "Aplicacion Móvil",
          enabled: 0
        }
      ]
    };

    // Clasificacion de Crisis -- VERIFICADO
    var clasification = {
      section_id: 16,
      section_title: "Calificación inicial de la crisis",
      questions: [
        {
          question_id: "id_calidad_crisis",
          question_type: "closed",
          question: "Clasificación",
          answers: CrisisClasification
        },
        {
          question_id: "id_naturaleza",
          question_type: "closed",
          question: "Naturaleza",
          answers: natureCrisis
        }
      ]
    };

    //Participantes en la atencion -- VERIFICADO
    var participants = {
      section_id: 17,
      section_title: "Participantes en la atención de la crisis (personal PDDH)",
      questions: [
        {
          question_id: "participante_nombre",
          question_type: "open",
          question: "Nombre"
        },
        {
          question_id: "participante_dependencia",
          question_type: "open",
          question: "Dependencia a la que pertenece"
        },
        {
          question_id: "participante_nivel",
          question_type: "open",
          question: "Nivel de participación",
          hint: "Coordinador/a, apoyo, participante, etc"
        }
      ]

    };

    //Datos de personas solicitantes
    var personalInformation = {
      section_id: 18,
      bold_title: 1,
      section_title: "Datos de personas solicitantes o afectadas: (individual o colectiva)",
      questions: [
        {
          question_id: "nombre_solicitante",
          question_type: "open",
          question: "Nombre"
        },
        {
          question_id: "id_documento_solicitante",
          question_type: "closed",
          question: "Documento de identificación",
          answers: personalDocuments
        },
        {
          question_id: "fecha_nacimiento",
          question_type: "date",
          question: "Fecha de nacimiento"
        },
        {
          question_id: "edad",
          question_type: "closed",
          question: "Edad aproximada",
          answers: age
        },
        {
          question_id: "id_sexo_solicitante",
          question_type: "closed",
          question: "Sexo",
          answers: sex
        },
        {
          question_id: "id_genero_solicitante",
          question_type: "closed",
          question: "Género",
          answers: gender
        },
        {
          question_id: "id_orientacion_solicitante",
          question_type: "closed",
          question: "Orientación sexual",
          answers: sexualOrientation
        },
        {
          question_id: "id_ocupacion",
          question_type: "closed_searchable",
          question: "Ocupación",
          answers: occupation
        },
        {
          question_id: "id_grupo_vulnerabilidad",
          question_type: "closed",
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup
        },
        {
          question_id: "id_zona_domicilio",
          question_type: "closed",
          question: "Zona Domicilio",
          answers: typeZone
        },
        {
          question_id: "id_departamento",
          required: 1,
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_municipio",
          question: "Departamento del domicilio",
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          required: 1,
          question: "Municipio del domicilio",
          answers: municipality
        },

        {
          question_id: "direccion",
          question_type: "open",
          question: "Dirección"
        },
        {
          question_id: "id_otr_med_notificacion",
          question_type: "closed",
          question: "Medio de notificación",
          answers: notificationMeans
        },
        {
          question_id: "detalle_persona",
          question_type: "open",
          question: "Detalle"
        }
      ]

    }

    //PDDH
    var informationSource = {
      section_id: 19,
      section_title: "Si PDDH actúa de oficio (no hay denunciante o solicitud de intervención), solo se registra datos de las personas afectadas; pero deberá ingresarse estos datos en la vía de entrada",
      questions: [
        {
          question_id: "fuente_informacion",
          question_type: "open",
          question: "Fuente de información"
        },
        {
          question_id: "fecha_informacion",
          question_type: "date",
          question: "Fecha de la información"
        },
        {
          question_id: "referencia_emision",
          question_type: "open",
          question: "Referencia de emisión"
        },
        {
          question_id: "fecha_recepción",
          question_type: "date",
          question: "Fecha Recepción"
        }
      ]

    }

    //Datos atencion a crisis
    var crisisInformation = {
      section_id: 20,
      section_title: "Personas afectada colectiva colectividad afectada, se registrarán los siguientes datos",
      questions: [
        {
          question_id: "id_poblacion",
          question_type: "closed",
          question: "Tipo población afectada",
          answers: populationType
        },
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          question: "Cantidad de personas"
        },
        {
          question_id: "sector_poblacion_afectada",
          question_type: "open",
          question: "Sector Población afectada"
        },
        {
          question_id: "grupo_vulnerabilidad",
          question_type: "open",
          question: "Grupo en condición de vulnerabilidad"
        },
        {
          question_id: "nombre_notificacion_medio",
          question_type: "open",
          question: "Medio de notificación"
        }
      ]
    }

    //Resumen del Hecho
    var factSummary = {
      section_id: 21,
      section_title: "Datos de la atención a crisis",
      questions: [
        {
          question_id: "resumen_hecho",
          question_type: "area",
          question: "Resumen de los hechos",
          hint: "Escriba aqui..."
        },
        {
          question_id: "id_calificacion",
          question_type: "closed",
          question: "Calificación",
          answers: calification
        },
        {
          question_id: "nombre_funcionario",
          question_type: "open",
          question: "Nombre funcionario/a"
        },
        {
          question_id: "cargo",
          question_type: "open",
          question: "Cargo"
        }
      ]

    }

    //Otros/as Intervinientes
    var other = {
      section_id: 21,
      section_title: "Otros/as Intervinientes",
      questions: [
        {
          question_id: "nombre_otros",
          question_type: "open",
          question: "Nombre persona"
        },
        {
          question_id: "institucion_otros",
          question_type: "open",
          question: "Institución"
        },
        {
          question_id: "cargo_otros",
          question_type: "open",
          question: "Cargo"
        },
        {
          question_id: "id_calificacion_otros",
          question_type: "closed",
          question: "Calificación",
          answers: participantQuality
        }
      ]

    }

    sections.push(generalData, clasification, participants, personalInformation, informationSource, crisisInformation, factSummary, other);

    var formCrisisAlert = {
      form_id: 0,
      sections: sections
    }

    return res.status(200).json({
      form: formCrisisAlert
    })

  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'getCrisisAlertsForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let getById = async (req, res) => {

  const { id_atencion_crisis } = req.params;

  try {

    var crisisAttention = await db.query(`SELECT * FROM sat_atencion_crisis WHERE id_atencion_crisis = $1`, [id_atencion_crisis]);
    crisisAttention = crisisAttention.rows[0];

    var entryType = await db.query('SELECT id_entrada::integer AS answer_id, nombre_entrada AS answer FROM sat_tipo_entrada WHERE estado = 1');
    entryType = entryType.rows;

    var CrisisClasification = await db.query(`SELECT id_calidad_crisis::integer AS answer_id, nombre_calidad_crisis AS answer FROM sat_calidad_clasificacion_crisis WHERE estado = 1`);
    CrisisClasification = CrisisClasification.rows;

    var natureCrisis = await db.query(`SELECT id_nat_sit_crisis::integer AS answer_id, decripcion AS answer FROM admi_nat_sit_crisis WHERE est_reg = 'A'`);
    natureCrisis = natureCrisis.rows;

    var QuelityParticipants = await db.query('SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1 ORDER BY id_calidad_participa ASC')
    QuelityParticipants = QuelityParticipants.rows;

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var age = await db.query(`SELECT id_grp_etario::integer AS answer_id, descripcion AS answer FROM admi_grp_etario WHERE est_reg = 'A' ORDER BY id_grp_etario ASC`);
    age = age.rows;

    var sex = await db.query('SELECT id_sexo::integer AS answer_id, nombre_sexo AS answer FROM sat_sexo WHERE estado = 1 ORDER BY id_sexo ASC');
    sex = sex.rows;

    var gender = await db.query('SELECT id_genero::integer AS answer_id, nombre_genero AS answer FROM sat_genero WHERE estado = 1 ORDER BY id_genero ASC');
    gender = gender.rows;

    var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;


    var occupation_answer = null;
    if (crisisAttention.id_ocupacion != null) {
      occupation_answer = await db.query(`SELECT CONCAT(id_cat_pro_oficio, '|',descripcion) AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A' AND id_cat_pro_oficio = ${crisisAttention.id_ocupacion}`);
      occupation_answer = occupation_answer.rows[0].answer;
    }


    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare  FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    notificationMeans = notificationMeans.rows;

    var participantQuality = await db.query('SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1');
    participantQuality = participantQuality.rows;

    var populationType = await db.query(`SELECT id_poblacion::integer AS answer_id, nombre_poblacion AS answer, estado FROM sat_tipo_poblacion WHERE estado = 1 ORDER BY id_poblacion ASC`);
    populationType = populationType.rows;

    var sections = [];

    var calification = await db.query(`SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1`);
    calification = calification.rows;

    // Datos generales -- VERIFICADO
    var generalData = {
      section_id: 15,
      bold_title: 1,
      section_title: "Datos generales del registro",
      questions: [
        {
          question_id: "fecha_ingreso",
          question_type: "date",
          question: "Fecha Ingreso",
          answer: crisisAttention.fecha_ingreso,
        },
        {
          question_id: "id_tipo_via_entrada",
          question_type: "closed",
          question: "Tipo Via Entrada",
          answers: entryType,
          answer: Number.parseInt(crisisAttention.id_tipo_via_entrada)
        },
        {
          question_id: "via_entrada",
          question_type: "open",
          question: "Via Entrada",
          answer: "Aplicacion Móvil",
          enabled: 0,
          answer: crisisAttention.via_entrada
        }
      ]
    };

    // Clasificacion de Crisis -- VERIFICADO
    var clasification = {
      section_id: 16,
      section_title: "Calificación inicial de la crisis",
      questions: [
        {
          question_id: "id_calidad_crisis",
          question_type: "closed",
          question: "Clasificación",
          answers: CrisisClasification,
          answer: Number.parseInt(crisisAttention.id_calidad_crisis)
        },
        {
          question_id: "id_naturaleza",
          question_type: "closed",
          question: "Naturaleza",
          answers: natureCrisis,
          answer: Number.parseInt(crisisAttention.id_naturaleza)
        }
      ]
    };

    //Participantes en la atencion -- VERIFICADO
    var participants = {
      section_id: 17,
      section_title: "Participantes en la atención de la crisis (personal PDDH)",
      questions: [
        {
          question_id: "participante_nombre",
          question_type: "open",
          question: "Nombre",
          answer: crisisAttention.participante_nombre
        },
        {
          question_id: "participante_dependencia",
          question_type: "open",
          question: "Dependencia a la que pertenece",
          answer: crisisAttention.participante_dependencia
        },
        {
          question_id: "participante_nivel",
          question_type: "open",
          question: "Nivel de participación",
          hint: "Coordinador/a, apoyo, participante, etc",
          answer: crisisAttention.participante_nivel
        }
      ]

    };

    //Datos de personas solicitantes
    var personalInformation = {
      section_id: 18,
      bold_title: 1,
      section_title: "Datos de personas solicitantes o afectadas: (individual o colectiva)",
      questions: [
        {
          question_id: "nombre_solicitante",
          question_type: "open",
          question: "Nombre",
          answer: crisisAttention.nombre_solicitante
        },
        {
          question_id: "id_documento_solicitante",
          question_type: "closed",
          question: "Documento de identificación",
          answers: personalDocuments,
          answer: Number.parseInt(crisisAttention.id_documento_solicitante)
        },
        {
          question_id: "fecha_nacimiento",
          question_type: "date",
          question: "Fecha de nacimiento",
          answer: crisisAttention.fecha_nacimiento
        },
        {
          question_id: "edad",
          question_type: "closed",
          question: "Edad aproximada",
          answers: age,
          answer: crisisAttention.edad
        },
        {
          question_id: "id_sexo_solicitante",
          question_type: "closed",
          question: "Sexo",
          answers: sex,
          answer: Number.parseInt(crisisAttention.id_sexo_solicitante)
        },
        {
          question_id: "id_genero_solicitante",
          question_type: "closed",
          question: "Género",
          answers: gender,
          answer: Number.parseInt(crisisAttention.id_genero_solicitante)
        },
        {
          question_id: "id_orientacion_solicitante",
          question_type: "closed",
          question: "Orientación sexual",
          answers: sexualOrientation,
          answer: Number.parseInt(crisisAttention.id_orientacion_solicitante)
        },
        {
          question_id: "id_ocupacion",
          question_type: "closed_searchable",
          required: 1,
          question: "Ocupación",
          answers: occupation,
          answer: occupation_answer
        },
        {
          question_id: "id_grupo_vulnerabilidad",
          question_type: "closed",
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup,
          answer: Number.parseInt(crisisAttention.id_grupo_vulnerabilidad)
        },
        {
          question_id: "id_zona_domicilio",
          question_type: "closed",
          question: "Zona Domicilio",
          answers: typeZone,
          answer: Number.parseInt(crisisAttention.id_zona_domicilio)
        },
        {
          question_id: "id_departamento",
          required: 1,
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_municipio",
          question: "Departamento del domicilio",
          answers: state,
          answer: Number.parseInt(crisisAttention.id_departamento)
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          required: 1,
          question: "Municipio del domicilio",
          answers: municipality,
          answer: Number.parseInt(crisisAttention.id_municipio)
        },
        {
          question_id: "direccion",
          question_type: "open",
          question: "Dirección",
          answer: crisisAttention.direccion
        },
        {
          question_id: "id_otr_med_notificacion",
          question_type: "closed",
          question: "Medio de notificación",
          answers: notificationMeans,
          answer: Number.parseInt(crisisAttention.id_otr_med_notificacion)
        },
        {
          question_id: "detalle_persona",
          question_type: "open",
          question: "Detalle",
          answer: crisisAttention.detalle_persona
        }
      ]

    }

    //PDDH
    var informationSource = {
      section_id: 19,
      section_title: "Si PDDH actúa de oficio (no hay denunciante o solicitud de intervención), solo se registra datos de las personas afectadas; pero deberá ingresarse estos datos en la vía de entrada",
      questions: [
        {
          question_id: "fuente_informacion",
          question_type: "open",
          question: "Fuente de información",
          answer: crisisAttention.fuente_informacion
        },
        {
          question_id: "fecha_informacion",
          question_type: "date",
          question: "Fecha de la información",
          answer: crisisAttention.fecha_informacion
        },
        {
          question_id: "referencia_emision",
          question_type: "open",
          question: "Referencia de emisión",
          answer: crisisAttention.referencia_emision
        },
        {
          question_id: "fecha_recepción",
          question_type: "date",
          question: "Fecha Recepción",
          answer: crisisAttention.fecha_recepción
        }
      ]

    }

    //Datos atencion a crisis
    var crisisInformation = {
      section_id: 20,
      section_title: "Personas afectada colectiva colectividad afectada, se registrarán los siguientes datos",
      questions: [
        {
          question_id: "id_poblacion",
          question_type: "closed",
          question: "Tipo población afectada",
          answers: populationType,
          answer: Number.parseInt(crisisAttention.id_poblacion)
        },
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          question: "Cantidad de personas",
          answer: crisisAttention.cantidad_aproximada
        },
        {
          question_id: "sector_poblacion_afectada",
          question_type: "open",
          question: "Sector Población afectada",
          answer: crisisAttention.sector_poblacion_afectada
        },
        {
          question_id: "grupo_vulnerabilidad",
          question_type: "open",
          question: "Grupo en condición de vulnerabilidad",
          answer: crisisAttention.grupo_vulnerabilidad
        },
        {
          question_id: "nombre_notificacion_medio",
          question_type: "open",
          question: "Medio de notificación",
          answer: crisisAttention.nombre_notificacion_medio
        }
      ]
    }

    //Resumen del Hecho
    var factSummary = {
      section_id: 21,
      section_title: "Datos de la atención a crisis",
      questions: [
        {
          question_id: "resumen_hecho",
          question_type: "area",
          question: "Resumen de los hechos",
          hint: "Escriba aqui...",
          answer: crisisAttention.resumen_hecho
        },
        {
          question_id: "id_calificacion",
          question_type: "closed",
          question: "Calificación",
          answers: calification,
          answer: Number.parseInt(crisisAttention.id_calificacion)
        },
        {
          question_id: "nombre_funcionario",
          question_type: "open",
          question: "Nombre funcionario/a",
          answer: crisisAttention.nombre_funcionario
        },
        {
          question_id: "cargo",
          question_type: "open",
          question: "Cargo",
          answer: crisisAttention.cargo
        }
      ]

    }

    //Otros/as Intervinientes
    var other = {
      section_id: 21,
      section_title: "Otros/as Intervinientes",
      questions: [
        {
          question_id: "nombre_otros",
          question_type: "open",
          question: "Nombre persona",
          answer: crisisAttention.nombre_otros
        },
        {
          question_id: "institucion_otros",
          question_type: "open",
          question: "Institución",
          answer: crisisAttention.institucion_otros
        },
        {
          question_id: "cargo_otros",
          question_type: "open",
          question: "Cargo",
          answer: crisisAttention.cargo_otros
        },
        {
          question_id: "id_calificacion_otros",
          question_type: "closed",
          question: "Calificación",
          answers: participantQuality,
          answer: Number.parseInt(crisisAttention.id_calificacion_otros)
        }
      ]

    }

    sections.push(generalData, clasification, participants, personalInformation, informationSource, crisisInformation, factSummary, other);

    var formCrisisAlert = {
      form_id: id_atencion_crisis,
      sections: sections
    }

    return res.status(200).json({
      form: formCrisisAlert
    })

  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'getCrisisAlertsForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let createCrisisAlert = async (req, res) => {
  const { id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre,
    participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento,
    edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad,
    id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion,
    fecha_informacion, referencia_emision, fecha_recepción, id_poblacion, cantidad_aproximada, sector_poblacion_afectada,
    grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros,
    institucion_otros, cargo_otros, id_calificacion_otros } = req.body;

  var localDate = new Date();
  var fecha_ingreso = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

  var cod_usu_ing = req.user.user_id;
  var cod_usu_mod = req.user.user_id;


  try {

    var errorResponse = new ErrorModel({ type: "createCrisisAlert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar guardar la Alerta a Crisis.", instance: "crisis-alert/createCrisisAlert" });

    await db.query(`INSERT INTO sat_atencion_crisis(
      fecha_ingreso, id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre, 
      participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento, 
      edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad, 
      id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion, 
      fecha_informacion, referencia_emision, "fecha_recepción", id_poblacion, cantidad_aproximada, sector_poblacion_afectada, 
      grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros, 
      institucion_otros, cargo_otros, id_calificacion_otros, cod_usu_ing, cod_usu_mod)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 
        $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, 
        $39, $40, $41, $42)`, [fecha_ingreso, id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre,
      participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento,
      edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad,
      id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion,
      fecha_informacion, referencia_emision, fecha_recepción, id_poblacion, cantidad_aproximada, sector_poblacion_afectada,
      grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros,
      institucion_otros, cargo_otros, id_calificacion_otros, cod_usu_ing, cod_usu_mod], (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var crisisAlerts = results.rows[0];
          return res.status(201).json({
            crisisAlerts
          });
        }
      });


  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'createCrisisAlert', error, true, req, res);
  }

};

let updateCrisisAlert = async (req, res) => {
  const { id_atencion_crisis } = req.params;
  const { fecha_ingreso, id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre,
    participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento,
    edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad,
    id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion,
    fecha_informacion, referencia_emision, fecha_recepción, id_poblacion, cantidad_aproximada, sector_poblacion_afectada,
    grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros,
    institucion_otros, cargo_otros, id_calificacion_otros } = req.body;

  try {

    var localDate = new Date();
    var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var cod_usu_ing = req.user.user_id;
    var cod_usu_mod = req.user.user_id;

    var errorResponse = new ErrorModel({ type: "createCrisisAlert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar la Alerta a Crisis.", instance: "crisis-alert/updateCrisisAlert" });

    await db.query(`UPDATE sat_atencion_crisis
    SET fecha_ingreso=$1, id_tipo_via_entrada=$2, via_entrada=$3, id_calidad_crisis=$4, id_naturaleza=$5, participante_nombre=$6, participante_dependencia=$7, participante_nivel=$8, nombre_solicitante=$9, id_documento_solicitante=$10, 
    fecha_nacimiento=$11, edad=$12, id_sexo_solicitante=$13, id_genero_solicitante=$14, id_orientacion_solicitante=$15, id_ocupacion=$16, id_grupo_vulnerabilidad=$17, id_zona_domicilio=$18, id_departamento=$19, id_municipio=$20, direccion=$21, 
    id_otr_med_notificacion=$22, detalle_persona=$23, fuente_informacion=$24, fecha_informacion=$25, referencia_emision=$26, fecha_recepción=$27, id_poblacion=$28, cantidad_aproximada=$29, sector_poblacion_afectada=$30, grupo_vulnerabilidad=$31, 
    nombre_notificacion_medio=$32, resumen_hecho=$33, id_calificacion=$34, nombre_funcionario=$35, cargo=$36, nombre_otros=$37, institucion_otros=$38, cargo_otros=$39, id_calificacion_otros=$40, 
    fecha_mod_reg=$41, cod_usu_ing=$42, cod_usu_mod=$43
    WHERE id_atencion_crisis = $44`, [fecha_ingreso, id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre,
      participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento,
      edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad,
      id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion,
      fecha_informacion, referencia_emision, fecha_recepción, id_poblacion, cantidad_aproximada, sector_poblacion_afectada,
      grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros,
      institucion_otros, cargo_otros, id_calificacion_otros, fecha_mod_reg, cod_usu_ing, cod_usu_mod, id_atencion_crisis], (err, results) => {
        if (err) {
          console.log(err);
          errorResponse.detail = err.message;
          return res.status(500).json(errorResponse.toJson());
        } else {
          var crisisAlerts = results.rows[0];
          return res.status(200).json({
            crisisAlerts
          });
        }
      });
  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'updateCrisisAlert', error, true, req, res);
  }

};

let getFormToAnalyze = async (req, res) => {
  const { id_atencion_crisis } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Crisis-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener el formulario.", instance: "early-alert/getAnalyzedForm" });

    var crisisAlert = await db.query(`SELECT id_accion_pddh, analisis, id_unidad_administrativa, texto_mensaje, analizada AS analyzed FROM sat_atencion_crisis WHERE id_atencion_crisis = ${id_atencion_crisis}`);
    crisisAlert = crisisAlert.rows[0];

    var acciones_pddh = await db.query('SELECT id_accion_pddh::integer AS answer_id, nombre_accion AS answer FROM sat_accion_pddh WHERE estado = 1');
    acciones_pddh = acciones_pddh.rows;

    var administrative_unit = await db.query(`SELECT id_unidad_administrativa:: integer AS answer_id, nombre_unidad AS answer
    FROM sat_unidad_administrativa WHERE estado = 1`);
    administrative_unit = administrative_unit.rows;

    var section = {
      section_id: 0,
      questions: [
        {
          question_id: "id_accion_pddh",
          question_type: "closed",
          question: "Acciones PDDH",
          answers: acciones_pddh,
          answer: Number.parseInt(crisisAlert.id_accion_pddh)
        },
        {
          question_id: "analisis",
          question_type: "area",
          required: 1,
          question: "Analisis",
          answer: crisisAlert.analisis
        },
        {
          question_id: "id_unidad_administrativa",
          question_type: "closed",
          question: "Notificar a:",
          answers: administrative_unit,
          answer: Number.parseInt(crisisAlert.id_unidad_administrativa)
        },
        {
          question_id: "texto_mensaje",
          question_type: "area",
          required: 1,
          question: "Texto en el Mensaje",
          answer: crisisAlert.texto_mensaje
        }
      ]
    }

    var sections = [];
    sections.push(section);

    var formCrisisAlert = {
      form_id: id_atencion_crisis,
      analyzed: crisisAlert.analyzed,
      sections
    }


    return res.status(200).json({
      form: formCrisisAlert
    });

  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'getAnalyzedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


};

let analyzeCrisisAlert = async (req, res) => {
  const { id_atencion_crisis } = req.params;
  const { id_accion_pddh, analisis, id_unidad_administrativa, texto_mensaje, } = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "Crisis-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar analizar la Alerta.", instance: "crisis-alert/analyzeCrisisAlert" });

    let administrativUnit = await db.query(`SELECT nombre_unidad, correo_prinicipal, correo_secundario
    FROM sat_unidad_administrativa WHERE id_unidad_administrativa = $1`, [id_unidad_administrativa]);
    administrativUnit = administrativUnit.rows[0];

    var correo_principal = administrativUnit.correo_prinicipal;

    await db.query(`UPDATE sat_atencion_crisis SET analizada = true, id_accion_pddh = $1, analisis = $2, id_unidad_administrativa = $3, texto_mensaje = $4 WHERE id_atencion_crisis = $5`, [id_accion_pddh, analisis, id_unidad_administrativa, texto_mensaje, id_atencion_crisis], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var CrisisAlert = results.rows[0];

        //--- Envio de correo electronico

        var mailOptions = {
          from: 'sistemalertpddh2021@gmail.com',
          to: correo_principal,
          subject: 'ANÁLISIS DE CRISIS ',
          text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint id aliquid officia sit facere. In doloribus nemo, voluptas natus velit, qui magnam assumenda, tempore eos obcaecati provident? Praesentium, doloribus sint.`
        };


        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });


        return res.status(200).json({ CrisisAlert });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'crisi-alert', 'analyzeCrisisAlert', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


};

let searchCrisisAlert = async (req, res) => {
  const { delegate } = req.query;

  try {
    var errorResponse = new ErrorModel({ type: "Crisis-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar procesar su busqueda.", instance: "crisis-alert/searchCrisisAlert" });

    await db.query(`SELECT id_atencion_crisis::integer AS form_id, analizada AS analyzed FROM sat_atencion_crisis WHERE texto_mensaje ILIKE '%${delegate}%'`, (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }

      var crisisAlerts = results.rows;
      return res.status(200).json({ crisisAlerts });

    });

  } catch (e) {
    log('src/controllers/back', 'crisis-alert', 'searchCrisisAlert', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }


}

module.exports = {
  getCrisisAlertsForm,
  crisisAlertsList,
  getById,
  createCrisisAlert,
  updateCrisisAlert,
  getFormToAnalyze,
  analyzeCrisisAlert,
  searchCrisisAlert
}