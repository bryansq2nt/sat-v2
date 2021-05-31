const db = require('@config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let crisisAlertsList = async(req, res) =>{
  const { offset } = req.query;

  try {

      var errorResponse = new ErrorModel({ type: "Crisis-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Alertas de Crisis.", instance: "crisis-alert/crisisAlertsList" });
      
      await db.query(`SELECT id_atencion_crisis FROM sat_atencion_crisis ORDER BY id_atencion_crisis ASC LIMIT 25 OFFSET $1`,[offset],(err,results)=>{
        if(err){
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        }else{
          var crisisAlerts = results.rows;
          return res.status(200).json({ crisisAlerts });
        }
      });
  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'crisisAlertsList', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let getCrisisAlertsForm = async(req, res) => {

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

    var age = [];

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

  } catch (error) {
    log('src/controllers/back', 'crisis-alert', 'getCrisisAlertsForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let createCrisisAlert = async (req, res) => {
  const { fecha_ingreso, id_tipo_via_entrada, via_entrada, id_calidad_crisis, id_naturaleza, participante_nombre,
    participante_dependencia, participante_nivel, nombre_solicitante, id_documento_solicitante, fecha_nacimiento,
    edad, id_sexo_solicitante, id_genero_solicitante, id_orientacion_solicitante, id_ocupacion, id_grupo_vulnerabilidad,
    id_zona_domicilio, id_departamento, id_municipio, direccion, id_otr_med_notificacion, detalle_persona, fuente_informacion,
    fecha_informacion, referencia_emision, fecha_recepción, id_poblacion, cantidad_aproximada, sector_poblacion_afectada,
    grupo_vulnerabilidad, nombre_notificacion_medio, resumen_hecho, id_calificacion, nombre_funcionario, cargo, nombre_otros,
    institucion_otros, cargo_otros, id_calificacion_otros, cod_usu_ing, cod_usu_mod } = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "createCrisisAlert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar guardar la Alerta de Crisis.", instance: "crisis-alert/createCrisisAlert" });

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

        }
      });


  } catch (error) {

  }

};


module.exports = {
  getCrisisAlertsForm,
  crisisAlertsList,
  createCrisisAlert
}