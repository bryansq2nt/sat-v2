const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const e = require('connect-flash');

let getCaseProcessingForm = async (req, res) => {

    try {

        var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcessingForm" });

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

        // var typeDisability = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
        // typeDisability = typeDisability.rows;

        // var academicLevel = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
        // academicLevel = academicLevel.rows;

        // var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
        // qualityOperates = qualityOperates.rows;

        var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
        country = country.rows[0];

        var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
        state = state.rows;
    
        var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
        municipality = municipality.rows;

        var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
        typeZone = typeZone.rows;

        let academicLevel = [];
        let typeDisability = [];
        let qualityOperates = [];

      var sections = [];
  
      // Seccion --- Via de entrada
      var meansEntry = {
        section_id: 1,
        bold_title: 1,
        section_title: "Via de Entrada",
        questions: [
          {
            question_id: "fecha",
            question_type: "date",
            required: 1,
            question: "Fecha de ingreso"
          },
          {
            question_id: "tipo_via_entrada",
            question_type: "closed",
            question: "Tipo Vía Entrada",
            required: 1,
            answers: [
              {v: 'V'},
              {e: 'E'},
              {o: 'O'}
            ]
          },
          {
            question_id: "via_entrada",
            question_type: "closed",
            required: 1,
            question: "Via Entrada",
            answers: [
              {p: 'P'},
              {t: 'T'},
              {a: 'A'},
              {c: 'C'},
              {i: 'I'},
              {o: 'O'}
            ]
          },
          {
            question_id: "otra_via_entrada",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "open",
            question: "Otra vía Entrada"
          },
          {
            question_id: "fuente",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "open",
            question: "Fuente Emisión"
          },
          {
            question_id: "fec_emision",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "date",
            question: "Fecha Emisión"
          },
          {
            question_id: "tit_emision",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "open",
            question: "Título Emisión"
          },
          {
            question_id: "fec_recepcion",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "date_after",
            question: "Fecha Recepción"
          },
          {
            question_id: "fec_recepcion",
            dependent: 1,
            dependent_section_id: 1,
            dependent_question_id: "via_entrada",
            dependent_answer: true,
            question_type: "date_after",
            question: "Fecha Recepción"
          }
        ]
      };
  
      // Seccion --- Denunciante
      var whistleblower = {
        section_id: 2,
        section_title: "Identificación de Tipo de Persona",
        questions: [
          {
            question_id: "tipo_rel_caso",
            question_type: "closed",
            question: "Tipo de Persona",
            answers: [
              {denunciante: 'D'},
              {Victima: 'V'},
              {denuncianteVictima: 'A'}
            ]
          },
          {
            question_id: "tipo_persona",
            dependent: 2,
            dependent_section_id: 2,
            dependent_question_id: "tipo_rel_caso",
            dependent_answer: true,
            question_type: "closed",
            question: "Persona Denunciante",
            answers: [
              {Natural: 'N'},
              {Juridica: 'J'},
            ]
          },
          {
            question_id: "tipo_persona",
            dependent: 2,
            dependent_section_id: 2,
            dependent_question_id: "tipo_rel_caso",
            dependent_answer: true,
            question_type: "closed",
            question: "Persona Victima",
            answers: [
              {Individual: 'I'},
              {Colectiva: 'C'},
            ]
          },
        ]
      };
  
      //Seccion --- Informacion general de la persona
      var generalData = {
        section_id: 3,
        section_title: "Información General de la persona",
        questions: [
          {
            question_id: "nombre",
            question_type: "open",
            question: "Nombre"
          },
          {
            question_id: "apellido",
            question_type: "open",
            question: "Apellido"
          },
          {
            question_id: "id_cat_doc_persona",
            question_type: "closed",
            question: "Doc. Presentado",
            answers: personalDocuments
          },
          {
            question_id: "num_documento",
            question_type: "open",
            question: "Núm. Documento"
          },
          {
            question_id: "fec_nacimiento",
            question_type: "date",
            question: "Fecha Nacimiento"
          },
          {
            question_id: "id_pais",
            enabled: 0,
            question_type: "open",
            question: "Pais Nacimiento",
            answer: "El Salvador"
          },
          {
            question_id: "sexo",
            question_type: "radiobutton",
            question: "Sexo"
          },
          {
            question_id: "lee",
            question_type: "radiobutton",
            question: "Saber Leer"
          },
          {
            question_id: "escribe",
            question_type: "radiobutton",
            question: "Saber Escribir"
          },
          {
            question_id: "discapacidad",
            question_type: "radiobutton",
            question: "Discapacidad"
          },
          {
            question_id: "id_ori_sexual",
            question_type: "closed_multiple",
            question: "Orientación Sexual",
            answers: sexualOrientation
          },
          {
            question_id: "edad_aprox",
            question_type: "open",
            question: "Edad Aproximada"
          },
          {
            question_id: "id_cat_pro_oficio",
            question_type: "closed",
            question: "Ocupación",
            answers: occupation
          },
          {
            question_id: "id_cat_pro_oficio",
            question_type: "closed",
            question: "Identidad de Genéro",
            answers: [
              {femenino: 'F'},
              {masculino: 'M'},
              {SinRespuesta:'S'}
            ]
          },
          {
            question_id: "id_niv_academico",
            dependent: 1,
            dependent_section_id: 3,
            dependent_question_id: "escribe",
            dependent_answer: true,
            question_type: "closed",
            question: "Niv. Académico",
            answers: academicLevel
          },
          {
            question_id: "id_cat_tip_discapacidad",
            dependent: 1,
            dependent_section_id: 3,
            dependent_question_id: "escribe",
            dependent_answer: true,
            question_type: "closed",
            question: "Tipo de Discapacidad",
            answers: typeDisability
          }

        ]
  
      };
  
      //Seccion --- Informacion de Ubicacion de la Persona
      var locationPerson = {
        section_id: 18,
        bold_title: 1,
        section_title: "Información de Ubicación de la Persona",
        questions: [
          {
            question_id: "id_departamento",
            required: 1,
            question_type: "closed_with_child",
            has_child: 1,
            principal_child: "id_municipio",
            question: "Departamento",
            answers: state
          },
          {
            question_id: "id_municipio",
            question_type: "closed",
            required: 1,
            question: "Municipio",
            answers: municipality
          },
          {
            question_id: "zona_domicilio",
            question_type: "closed",
            required: 1,
            question: "Tipo de Zona",
            answers: [
              {rural: 'R'},
              {urbana: 'U'},
              {noDefinida: 'N'}
            ]
          },
          {
            question_id: "id_documento_solicitante",
            question_type: "closed",
            question: "Documento de identificación",
            required: 1,
            answers: personalDocuments
          },
          {
            question_id: "domicilio",
            question_type: "area",
            required: 1,
            question: "Dirección",
          },
          {
            question_id: "med_rec_notificacion",
            question_type: "closed_multiple",
            question: "Medio de Notificación",
            answers: [
              {telefono: 'T'},
              {direccion: 'D'},
              {fax:'F'},
              {correo: 'C'},
              {pendiente: 'P'}
            ]
          }
     
        ]
  
      };
  
      //Seccion --- Grupos en Condición de Vulnerabilidad
      var SectionvulnerableGroups = {
        section_id: 19,
        section_title: "Grupos en Condición de Vulnerabilidad",
        questions: [
          {
            question_id: "id_grp_vulnerable",
            required: 1,
            question_type: "closed_multiple",
            question: "Grupos en condición de vulnerabilidad",
            answers: vulnerableGroup,
          }
        ]
      };
  
      //Información de Institución
      var institutionInformation = {
        section_id: 20,
        section_title: "Información de Institución",
        questions: [
          {
            question_id: "",
            question_type: "area",
            required: 1,
            question: "Institucion",
          },
          {
            question_id: "",
            question_type: "closed",
            question: "Nacionalidad de Institución",
            answers: []
          },
          {
            question_id: "id_cat_cal_actua",
            question_type: "closed",
            question: "Calidad en que Actúa",
            answers: qualityOperates
          }
   
        ]
      }
  
  
      sections.push(meansEntry, whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);
  
      var formcasaProcessing = {
        form_id: 0,
        sections: sections
      }
  
      return res.status(200).json({
        form: formcasaProcessing
      })
  
    } catch (error) {
      log('src/controllers/back', 'case-processing', 'getCaseProcessingForm', error, true, req, res);
      return res.status(500).json(errorResponse.toJson());
    }
  
  };
  
  module.exports = {
    getCaseProcessingForm
  }