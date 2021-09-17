const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');

let getCaseProcessingForm = async (req, res) => {

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcessingForm" });

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows[0];

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

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
            { answer_id:0, answer: 'V' },
            { answer_id:1, answer: 'E' },
            { answer_id:2, answer: 'O' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          required: 1,
          question: "Via Entrada",
          answers: [
            { answer_id:0, answer: 'P' },
            { answer_id:1, answer: 'T' },
            { answer_id:2, answer: 'OV' },

            { answer_id:3, answer: 'F' },
            { answer_id:4, answer: 'E' },
            { answer_id:5, answer: 'C' },
            { answer_id:6, answer: 'OE' },

            { answer_id:7, answer: 'PE' },
            { answer_id:8, answer: 'R' },
            { answer_id:9, answer: 'TV' },
            { answer_id:10, answer: 'I' },
            { answer_id:11, answer: 'IN' },
            { answer_id:12, answer: 'A' },
            { answer_id:13, answer: 'N' },
            { answer_id:14, answer: 'OF' },
            
          ]
        },
        {
          question_id: "otra_via_entrada",
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OV",
          question_type: "open",
          question: "Otra vía Entrada"
        }
      ]
    };

    //Seccion Al Seleccionar De Oficio/Otra
    var emissionSource = {
      section_id: 2,
      dependent: 1,
      dependent_section_id: 1,
      dependent_question_id: "tipo_persona",
      dependent_answer: "OF",
      section_title: "Fuente de Emision",
      questions: [
        {
          question_id: "fuente",
          required: 1,
          question_type: "open",
          question: "Fuente Emisión"
        },
        {
          question_id: "fec_emision",
          required: 1,
          question_type: "date",
          question: "Fecha Emisión"
        },
        {
          question_id: "tit_emision",
          required: 1,
          question_type: "open",
          question: "Título Emisión"
        },
        {
          question_id: "fec_recepcion",
          required: 1,
          question_type: "date_after",
          question: "Fecha Recepción"
        },
        {
          question_id: "otra_via_entrada",
          required: 1,
          question_type: "area",
          question: "Otra vía Entrada"
        }
      ]
    }

    //Lugar y Hecho
    var institutionInformation = {
      section_id: 3,
      section_title: "Lugar y Hecho",
      questions: [
        {
          question_id: "fecha",
          question_type: "date",
          required: 1,
          question: "Fecha y Hora Hecho"
        },
        {
          question_id: "fecha",
          question_type: "fec_hor_hecho_aprox",
          required: 1,
          question: "Fecha y Hora Hecho ES",
          answers: [
            {answer_id: 0, answer: 'A'},
            {answer_id: 1, answer: 'E'},
            {answer_id: 2, answer: 'H'},
            {answer_id: 3, answer: 'F'}
          ]
        },
        {
          question_id: "id_pais_hecho",
          question_type: "closed",
          required: 1,
          question: "Pais",
          answers: country
        },
        {
          question_id: "id_depto_hecho",
          required: 1,
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_mun_hecho",
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_mun_hecho",
          question_type: "closed",
          required: 1,
          question: "Municipio",
          answers: municipality
        },
        {
          question_id: "lugar",
          question_type: "area",
          required: 1,
          question: "Lugar del Hecho",
        },
        {
          question_id: "hecho",
          question_type: "area",
          required: 1,
          question: "Descripcíon del Hecho",
        }

      ]
    }


    sections.push(meansEntry, emissionSource, institutionInformation);

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

let createCaseProcessing = async(req, res) => {
  const { tipo_via_entrada, via_entrada, otra_via_entrada, fecha, fuente, 
    fec_emision, tit_emision, fec_recepcion, hor_recepcion} = req.body
  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/createCaseProcessing" });
    
    var numero_caso = 101;
    // Datos no identificados de que tablas obtenerlos
    // cod_depto_ing
    // id_ins_ing
    // id_ins_mod

    var localDate =  new Date();
    var fecha_asignado = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var fecha_hora = dateFormat(localDate, 'yyyy-mm-dd');
    var est_reg = 'R';
    var cod_usu = 1;

    //var cod_usu = req.user.user_id;
    //var user_name = req.user.name;
    var user_name = 'Usuario Prueba';

    await db.query(`INSERT INTO tcdh_caso_temp(
      id_caso_temp, hay_mas_vic_den, reg_ing_turno, en_turno, 
      fec_en_turno, tipo_via_entrada, via_entrada, otra_via_entrada, id_usu_asignado, fec_asignado, fecha, fec_hora,  
      est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, 
      fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`, 
          [numero_caso, 'N', 'N', 'N', fecha_asignado, tipo_via_entrada, via_entrada, otra_via_entrada, cod_usu, fecha_asignado, 
          fecha_asignado, fecha_asignado, est_reg, fecha_asignado, cod_usu, user_name, fecha_asignado, cod_usu, 
          user_name, fecha_asignado, fuente, fecha_asignado, tit_emision, fecha_asignado, fecha_asignado], (err, results)=>{
          if(err){
            console.log(err.message);
            return res.status(500).json(errorResponse.toJson());
          }else{
            var caseProcessing = results.rows[0];
            return res.status(201).json({
              caseProcessing
            });
          }
    });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'createCaseProcessing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let getInvolvedForm = async (req, res) => {

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

    // Seccion --- Denunciante
    var whistleblower = {
      section_id: 1,
      section_title: "Identificación de Tipo de Persona",
      questions: [
        {
          question_id: "tipo_rel_caso",
          required: 1,
          question_type: "closed",
          question: "Tipo de Persona",
          answers: [
            { answer_id:0, answer: 'D' },
            { answer_id:1, answer: 'V' },
            { answer_id:2, answer: 'A' }
          ]
        },
        {
          question_id: "persona_denunciante ",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: "D",
          question_type: "closed",
          question: "Persona Denunciante",
          answers: [
            { answer_id:0, answer: 'N' },
            { answer_id:1, answer: 'J' },
          ]
        },
        {
          question_id: "persona_victima",
          required: 1,
          dependent: 2,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: "V",
          question_type: "closed",
          question: "Persona Victima",
          answers: [
            { answer_id:0, answer: 'I' },
            { answer_id:1, answer: 'C' },
          ]
        },
        {
          question_id: "confidencial",
          required: 1,
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id:0, answer: 'S' },
            { answer_id:1, answer: 'N' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id:0, answer: 'S' },
            { answer_id:1, answer: 'N' }
          ]
        }
      ]
    };

    //Seccion --- Denunciante/Victima
    // var whistleblowerAndvictim = {
    //   section_id: 2,
    //   dependent: 1,
    //   dependent_section_id: 1,
    //   dependent_question_id: "tipo_persona",
    //   dependent_answer: "A",
    //   section_title: "Denunciante/Victima",
    //   questions: [
    //     {
    //       question_id: "persona_denunciante",
    //       question_type: "closed",
    //       question: "Persona Denunciante",
    //       answers: [
    //         { answer_id: 0, answer: 'N' },
    //         { answer_id: 1, answer: 'J' },
    //       ]
    //     },
    //     {
    //       question_id: "persona_victima",
    //       question_type: "closed",
    //       question: "Persona Victima",
    //       answers: [
    //         { answer_id: 0, answer: 'I' },
    //         { answer_id: 1, answer: 'C' },
    //       ]
    //     },
    //   ]
    // };


    //Seccion --- Informacion general de la persona
    var generalData = {
      section_id: 2,
      dependent: 1,
      dependent_section_id: 1,
      dependent_question_id: "persona_denunciante",
      dependent_answer: "N",
      section_title: "Información General de la persona",
      questions: [
        {
          question_id: "nombre",
          required: 1,
          question_type: "open",
          question: "Nombre"
        },
        {
          question_id: "apellido",
          required: 1,
          question_type: "open",
          question: "Apellido"
        },
        {
          question_id: "id_cat_doc_persona",
          required: 1,
          question_type: "closed",
          question: "Doc. Presentado",
          answers: personalDocuments
        },
        {
          question_id: "num_documento",
          required: 1,
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
          required: 1,
          question_type: "radiobutton",
          question: "Sexo"
        },
        {
          question_id: "lee",
          required: 1,
          question_type: "radiobutton",
          question: "Saber Leer"
        },
        {
          question_id: "escribe",
          required: 1,
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
          required: 1,
          question_type: "closed_multiple",
          question: "Orientación Sexual",
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: 1,
          question_type: "open",
          question: "Edad Aproximada"
        },
        {
          question_id: "id_cat_pro_oficio",
          required: 1,
          question_type: "closed",
          question: "Ocupación",
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answers: [
            { answer_id:0, answer: 'F'},
            { answer_id:1, answer: 'M'},
            { answer_id:2, answer: 'S'}
          ]
        },
        {
          question_id: "id_niv_academico",
          required: 1,
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
          required: 1,
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
      section_id: 3,
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
            { answer_id:0, answer: 'R'},
            { answer_id:1, answer: 'U'},
            { answer_id:1, answer: 'N'}
          ]
        },
        // {
        //   question_id: "id_documento_solicitante",
        //   question_type: "closed",
        //   question: "Documento de identificación",
        //   required: 1,
        //   answers: personalDocuments
        // },
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
            { answer_id:0, answer: 'T'},
            { answer_id:1, answer: 'D' },
            { answer_id:2, answer: 'F' },
            { answer_id:3, answer: 'C' },
            { answer_id:4, answer: 'P' }
          ]
        }

      ]

    };

    //Seccion --- Grupos en Condición de Vulnerabilidad
    var SectionvulnerableGroups = {
      section_id: 4,
      section_title: "Grupos en Condición de Vulnerabilidad",
      questions: [
        {
          question_id: "id_grp_vulnerable",
          required: 1,
          question_type: "closed_multiple",
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup
        }
      ]
    };

    //Información de Institución
    var institutionInformation = {
      section_id: 5,
      dependent: 1,
      dependent_section_id: 1,
      dependent_question_id: "persona_denunciante",
      dependent_answer: "J",
      section_title: "Información de Institución",
      questions: [
        {
          question_id: "institucion",
          question_type: "area",
          required: 1,
          question: "Institucion",
        },
        {
          question_id: "nacionalidad_insitucion",
          question_type: "closed",
          question: "Nacionalidad de Institución",
          answers: []
        },
        {
          question_id: "id_cat_cal_actua",
          required: 1,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answers: qualityOperates
        }

      ]
    }

 
    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: 0,
      sections: sections
    }

    return res.status(200).json({
      form: involved
    })

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getCaseProcessingForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};


  module.exports = {
    getCaseProcessingForm,
    createCaseProcessing,
    getInvolvedForm
  }