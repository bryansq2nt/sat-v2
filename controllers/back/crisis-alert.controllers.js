const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let crisisAlertsList = async(req, res) => {

    var entryType = await db.query('SELECT id_entrada::integer AS answer_id, nombre_entrada AS answer FROM sat_tipo_entrada WHERE estado = 1');
    entryType = entryType.rows;

    var CrisisClasification = await db.query(`SELECT id_nat_sit_crisis::integer AS id_answer, decripcion AS answer FROM admi_nat_sit_crisis WHERE est_reg = 'A'`);
    CrisisClasification = CrisisClasification.rows;

    var Nature = [];

    var QuelityParticipants = await db.query('SELECT id_calidad_participa::integer AS id_answer, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1 ORDER BY id_calidad_participa ASC')
    QuelityParticipants = QuelityParticipants.rows;

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var age = [];

    var sex = await db.query('SELECT id_sexo::integer AS answer_id, nombre_sexo AS answer FROM sat_sexo WHERE estado = 1 ORDER BY id_sexo ASC');
    sex = sex.rows;

    var gender = await db.query('SELECT id_genero::integer AS answer_id, nombre_genero AS answer FROM sat_genero WHERE estado = 1 ORDER BY id_genero ASC');
    gender = gender.rows;

    var sexualOrientation = await db.query(`SELECT id_ori_sexual, descripcion FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;
    
    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    // var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    // notificationMeans = notificationMeans.rows;

    var notificationMeans = [];

    var participantQuality = await db.query('SELECT id_calidad_participa::integer AS answer_id, nombre_calidad_participa AS answer FROM sat_calidad_clasificacion_participa WHERE estado = 1');
    participantQuality = participantQuality.rows; 

    var populationType = await db.query(`SELECT id_poblacion, nombre_poblacion, estado FROM sat_tipo_poblacion WHERE estado = 1 ORDER BY id_poblacion ASC`);
    populationType = populationType.rows;

    var sections = [];

    var calification = [];

    // Datos generales
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
            question_id: "id_tipo_via_entrada",
            question_type: "closed",
            question: "Tipo Via Entrada",
            answers: entryType
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

    // Clasificacion de Crisis
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
            answers: Nature
          }
        ]
    };

    //Participantes en la atencion
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
            question_type: "closed",
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
            question_type: "state",
            question: "Departamento del domicilio",
            answers: state
          },
          {
            question_id: "id_municipio",
            question_type: "closed",
            question: "Municipio del domicilio",
            answers: []
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
            question_id: "id_grupo_vulnerabilidad",
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
    var factSummary =     {
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
};

module.exports = {
    crisisAlertsList
}