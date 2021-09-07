const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');

let getCaseProcessingForm = async (req, res) => {

    try {
  
        var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
        personalDocuments = personalDocuments.rows;

        var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
        occupation = occupation.rows;

        var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
        vulnerableGroup = vulnerableGroup.rows;

        var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
        sexualOrientation = sexualOrientation.rows;
        
        var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
        notificationMeans = notificationMeans.rows;

        var typeDisability = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
        typeDisability = typeDisability.rows;

        var academicLevel = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
        academicLevel = academicLevel.rows;

        var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
        country = country.rows[0];

        var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
        state = state.rows;
    
        var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
        municipality = municipality.rows;

      var sections = [];
  
      // Datos generales -- VERIFICADO
    //   var generalData = {
    //     section_id: 15,
    //     bold_title: 1,
    //     section_title: "Datos generales del registro",
    //     questions: [
    //       {
    //         question_id: "fecha_ingreso",
    //         question_type: "date_before",
    //         question: "Fecha Ingreso"
    //       },
  
    //       {
    //         question_id: "via_entrada",
    //         question_type: "open",
    //         question: "Via Entrada",
    //         answer: "Aplicacion Móvil",
    //         enabled: 0
    //       }
    //     ]
    //   };
  
      // Clasificacion de Crisis -- VERIFICADO
    //   var clasification = {
    //     section_id: 16,
    //     section_title: "Calificación inicial de la crisis",
    //     questions: [
    //       {
    //         question_id: "id_calidad_crisis",
    //         question_type: "closed",
    //         question: "Clasificación",
    //         answers: CrisisClasification
    //       },
    //       {
    //         question_id: "id_naturaleza",
    //         question_type: "closed",
    //         question: "Naturaleza",
    //         answers: natureCrisis
    //       }
    //     ]
    //   };
  
      //Participantes en la atencion -- VERIFICADO
    //   var participants = {
    //     section_id: 17,
    //     section_title: "Participantes en la atención de la crisis (personal PDDH)",
    //     questions: [
    //       {
    //         question_id: "participante_nombre",
    //         question_type: "open",
    //         question: "Nombre"
    //       },
    //       {
    //         question_id: "participante_dependencia",
    //         question_type: "open",
    //         question: "Dependencia a la que pertenece"
    //       },
    //       {
    //         question_id: "participante_nivel",
    //         question_type: "open",
    //         question: "Nivel de participación",
    //         hint: "Coordinador/a, apoyo, participante, etc"
    //       }
    //     ]
  
    //   };
  
      //Datos de personas solicitantes
    //   var personalInformation = {
    //     section_id: 18,
    //     bold_title: 1,
    //     section_title: "Datos de personas solicitantes o afectadas: (individual o colectiva)",
    //     questions: [
    //       {
    //         question_id: "nombre_solicitante",
    //         question_type: "open",
    //         required: 1,
    //         question: "Nombre"
    //       },
    //       {
    //         question_id: "id_documento_solicitante",
    //         question_type: "closed",
    //         question: "Documento de identificación",
    //         required: 1,
    //         answers: personalDocuments
    //       },
    //       {
    //         question_id: "fecha_nacimiento",
    //         question_type: "date",
    //         required: 1,
    //         question: "Fecha de nacimiento"
    //       },
    //       {
    //         question_id: "edad",
    //         question_type: "closed",
    //         question: "Edad aproximada",
    //         required: 1,
    //         answers: age
    //       },
    //       {
    //         question_id: "id_sexo_solicitante",
    //         question_type: "closed",
    //         question: "Sexo",
    //         required: 1,
    //         answers: sex
    //       },
    //       {
    //         question_id: "id_genero_solicitante",
    //         question_type: "closed",
    //         question: "Género",
    //         required: 1,
    //         answers: gender
    //       },
    //       {
    //         question_id: "id_orientacion_solicitante",
    //         question_type: "closed",
    //         question: "Orientación sexual",
    //         answers: sexualOrientation
    //       },
    //       {
    //         question_id: "id_ocupacion",
    //         question_type: "closed_searchable",
    //         question: "Ocupación",
    //         answers: occupation
    //       },
    //       {
    //         question_id: "id_grupo_vulnerabilidad",
    //         question_type: "closed",
    //         question: "Grupos en condición de vulnerabilidad",
    //         answers: vulnerableGroup
    //       },
    //       {
    //         question_id: "id_zona_domicilio",
    //         question_type: "closed",
    //         question: "Zona Domicilio",
    //         answers: typeZone
    //       },
    //       {
    //         question_id: "id_departamento",
    //         required: 1,
    //         question_type: "closed_with_child",
    //         has_child: 1,
    //         principal_child: "id_municipio",
    //         question: "Departamento del domicilio",
    //         answers: state
    //       },
    //       {
    //         question_id: "id_municipio",
    //         question_type: "closed",
    //         required: 1,
    //         question: "Municipio del domicilio",
    //         answers: municipality
    //       },
  
    //       {
    //         question_id: "direccion",
    //         question_type: "open",
    //         question: "Dirección"
    //       },
    //       {
    //         question_id: "id_otr_med_notificacion",
    //         question_type: "closed",
    //         question: "Medio de notificación",
    //         answers: notificationMeans
    //       },
    //       {
    //         question_id: "detalle_persona",
    //         question_type: "open",
    //         question: "Detalle"
    //       }
    //     ]
  
    //   }
  
      //PDDH
    //   var informationSource = {
    //     section_id: 19,
    //     section_title: "Si PDDH actúa de oficio (no hay denunciante o solicitud de intervención), solo se registra datos de las personas afectadas; pero deberá ingresarse estos datos en la vía de entrada",
    //     questions: [
    //       {
    //         question_id: "fuente_informacion",
    //         question_type: "open",
    //         question: "Fuente de información"
    //       },
    //       {
    //         question_id: "fecha_informacion",
    //         question_type: "date",
    //         question: "Fecha de la información"
    //       },
    //       {
    //         question_id: "referencia_emision",
    //         question_type: "open",
    //         question: "Referencia de emisión"
    //       },
    //       {
    //         question_id: "fecha_recepción",
    //         question_type: "date",
    //         question: "Fecha Recepción"
    //       }
    //     ]
  
    //   }
  
      //Datos atencion a crisis
    //   var crisisInformation = {
    //     section_id: 20,
    //     section_title: "Personas afectada colectiva colectividad afectada, se registrarán los siguientes datos",
    //     questions: [
    //       {
    //         question_id: "id_poblacion",
    //         question_type: "closed",
    //         question: "Tipo población afectada",
    //         answers: populationType
    //       },
    //       {
    //         question_id: "cantidad_aproximada",
    //         question_type: "numeric",
    //         question: "Cantidad de personas"
    //       },
    //       {
    //         question_id: "sector_poblacion_afectada",
    //         question_type: "open",
    //         question: "Sector Población afectada"
    //       },
    //       {
    //         question_id: "grupo_vulnerabilidad",
    //         question_type: "open",
    //         question: "Grupo en condición de vulnerabilidad"
    //       },
    //       {
    //         question_id: "nombre_notificacion_medio",
    //         question_type: "open",
    //         question: "Medio de notificación"
    //       }
    //     ]
    //   }
  
      //Resumen del Hecho
    //   var factSummary = {
    //     section_id: 21,
    //     section_title: "Datos de la atención a crisis",
    //     questions: [
    //       {
    //         question_id: "resumen_hecho",
    //         required: 1,
    //         question_type: "area",
    //         question: "Resumen de los hechos",
    //         hint: "Escriba aqui..."
    //       },
    //       {
    //         question_id: "id_calificacion",
    //         question_type: "closed",
    //         question: "Calificación",
    //         answers: calification
    //       },
    //       {
    //         question_id: "nombre_funcionario",
    //         question_type: "open",
    //         question: "Nombre funcionario/a"
    //       },
    //       {
    //         question_id: "cargo",
    //         question_type: "open",
    //         question: "Cargo"
    //       }
    //     ]
  
    //   }
  
      //Otros/as Intervinientes
    //   var other = {
    //     section_id: 21,
    //     section_title: "Otros/as Intervinientes",
    //     questions: [
    //       {
    //         question_id: "nombre_otros",
    //         question_type: "open",
    //         question: "Nombre persona"
    //       },
    //       {
    //         question_id: "institucion_otros",
    //         question_type: "open",
    //         question: "Institución"
    //       },
    //       {
    //         question_id: "cargo_otros",
    //         question_type: "open",
    //         question: "Cargo"
    //       },
    //       {
    //         question_id: "id_calificacion_otros",
    //         question_type: "closed",
    //         question: "Calificación",
    //         answers: participantQuality
    //       }
    //     ]
  
    //   }
  
    //   sections.push(generalData, clasification, participants, personalInformation, informationSource, crisisInformation, factSummary, other);
  
    //   var formCrisisAlert = {
    //     form_id: 0,
    //     sections: sections
    //   }
  
      return res.status(200).json({
        form: municipality
      })
  
    } catch (error) {
      log('src/controllers/back', 'case-processing', 'getCaseProcessingForm', error, true, req, res);
      return res.status(500).json(errorResponse.toJson());
    }
  
  };
  
  module.exports = {
    getCaseProcessingForm
  }