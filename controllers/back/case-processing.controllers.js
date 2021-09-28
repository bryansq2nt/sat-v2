const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');

//Tramitacion de Casos

let getcaseProcesingFormList = async (req,res) => {
  const { offset } = req.query;

  var cod_usu = req.user.user_id;

  try {
    
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/createCaseProcessing" });
    await db.query(`SELECT id_caso_temp::numeric AS form_id 
    FROM tcdh_caso_temp 
    WHERE cod_usu_ing = $1
    ORDER BY id_caso_temp DESC LIMIT 25 OFFSET $2
    `, [cod_usu,offset], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var cases = results.rows;

       
        return res.status(200).json({
          cases
        });
      }
    });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getCaseProcesingById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
}

let getCaseProcessingForm = async (req, res) => {

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcessingForm" });

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows;

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
          question_id: "fecha_ingreso",
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
            { answer_id:'V', answer: 'Verbal' },
            { answer_id:'E', answer: 'Escrita' },
            { answer_id:'O', answer: 'De Oficio' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          required: 1,
          question: "Via Entrada",
          answers: [
            { answer_id:'p', answer: 'Persona' },
            { answer_id:'T', answer: 'Telefonica' },
            { answer_id:'OV', answer: 'Otra' },

            { answer_id:'F', answer: 'Fax' },
            { answer_id:'E', answer: 'E-mail' },
            { answer_id:'C', answer: 'Carta' },
            { answer_id:'OE', answer: 'Otra' },

            { answer_id:'PE', answer: 'Prensa Escrita' },
            { answer_id:'R', answer: 'Radio' },
            { answer_id:'TV', answer: 'Television' },
            { answer_id:'I', answer: 'Internet' },
            { answer_id:'IN', answer: 'Informe' },
            { answer_id:'A', answer: 'Aviso' },
            { answer_id:'N', answer: 'Noticia' },
            { answer_id:'OF', answer: 'Otra' },
            
          ]
        },
        {
          question_id: "otra_via_entrada",
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: 'OV',
          question_type: "open",
          question: "Otra vía Entrada"
        },
        {
          question_id: "fuente",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "open",
          question: "Fuente Emisión"
        },
        {
          question_id: "fec_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "date",
          question: "Fecha Emisión"
        },
        {
          question_id: "tit_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "open",
          question: "Título Emisión"
        },
        {
          question_id: "fec_recepcion",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "date_after",
          question: "Fecha Recepción"
        },
        {
          question_id: "otra_via_entrada",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "area",
          question: "Otra vía Entrada"
        }
      ]
    };

   

    //Lugar y Hecho
    var institutionInformation = {
      section_id: 3,
      section_title: "Lugar y Hecho",
      questions: [
        {
          question_id: "fec_hecho",
          question_type: "date",
          required: 1,
          question: "Fecha y Hora Hecho"
        },
        {
          question_id: "fec_hor_hecho_aprox",
          question_type: "date",
          required: 1,
          question: "Fecha y Hora Hecho ES",
          answers: [
            { answer_id: 'A', answer: 'Fecha y Hora Exacta' },
            { answer_id: 'E', answer: 'Fecha y Hora Aproximada' },
            { answer_id: 'H', answer: 'Fecha Exacta y Hora Aproximada' },
            { answer_id: 'F', answer: 'Fecha Aproximada y Hora Exacta' }
          ]
        },
        {
          question_id: "id_pais_hecho",
          question_type: "closed",
          question: "Pais",
          answers: country
        },
        {
          question_id: "id_depto_hecho",
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_mun_hecho",
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_mun_hecho",
          question_type: "closed",
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


    sections.push(meansEntry, institutionInformation);

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
  const { tipo_via_entrada, via_entrada, otra_via_entrada, fecha, fec_hor_hecho_aprox, id_depto_hech, id_mun_hech, lugar, hecho, 
    fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion, id_prg_cal_turno, nom_victima, nom_denunciante, id_pais_hecho} = req.body
  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/createCaseProcessing" });
    
    var numero_caso = 113;
    // Datos no identificados de que tablas obtenerlos
    // cod_depto_ing
    // id_ins_ing
    // id_ins_mod

    var localDate =  new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var fecha_hora = dateFormat(localDate, 'yyyy-mm-dd');
    var est_reg = 'R';
    var cod_usu = req.user.user_id;

    //var cod_usu = req.user.user_id;
    //var user_name = req.user.name;
    var user_name = 'Usuario Prueba';

    await db.query(`INSERT INTO tcdh_caso_temp(
      hay_mas_vic_den, reg_ing_turno, en_turno, 
      fec_en_turno, tipo_via_entrada, via_entrada, otra_via_entrada, id_usu_asignado, fec_asignado, fecha, fec_hora,  
      fec_hor_hecho_aprox, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, 
      fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *`, 
          ['N', 'N', 'N', registration_date, tipo_via_entrada, via_entrada, otra_via_entrada, cod_usu, registration_date, fecha, 
          registration_date, fec_hor_hecho_aprox, est_reg, registration_date, cod_usu, user_name, registration_date, cod_usu, 
          user_name, registration_date, fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion], (err, results)=>{
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

let getCaseProcesingById = async (req, res) => {
  const { id_caso_temp } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcessingForm" });

    var caseProcessing = await db.query(`SELECT * FROM tcdh_caso_temp WHERE id_caso_temp = $1`, [id_caso_temp]);
    caseProcessing = caseProcessing.rows[0];

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows;


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
          question: "Fecha de ingreso",
          answer:caseProcessing.fecha
        },
        {
          question_id: "tipo_via_entrada",
          question_type: "closed",
          question: "Tipo Vía Entrada",
          required: 1,
          answer: caseProcessing.tipo_via_entrada,
          answers: [
            { answer_id: 'V', answer: 'verbal' },
            { answer_id: 'E', answer: 'escrita' },
            { answer_id: 'O', answer: 'otra' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          required: 1,
          question: "Via Entrada",
          answer:caseProcessing.via_entrada,
          answers: [
            { answer_id:'p', answer: 'persona' },
            { answer_id:'T', answer: 'telefonica' },
            { answer_id:'OV', answer: 'Otra' },

            { answer_id:'F', answer: 'fax' },
            { answer_id:'E', answer: 'e-mail' },
            { answer_id:'C', answer: 'carta' },
            { answer_id:'OE', answer: 'otra' },

            { answer_id:'PE', answer: 'prensa escrita' },
            { answer_id:'R', answer: 'radio' },
            { answer_id:'TV', answer: 'television' },
            { answer_id:'I', answer: 'internet' },
            { answer_id:'IN', answer: 'informe' },
            { answer_id:'A', answer: 'aviso' },
            { answer_id:'N', answer: 'noticia' },
            { answer_id:'OF', answer: 'otra' },
            
          ]
        },
        {
          question_id: "otra_via_entrada",
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OV",
          question_type: "open",
          question: "Otra vía Entrada",
          answer: caseProcessing.otra_via_entrada
        },
        {
          question_id: "fuente",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "open",
          question: "Fuente Emisión",
          answer: caseProcessing.fuente
        },
        {
          question_id: "fec_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "date",
          question: "Fecha Emisión",
          answer: caseProcessing.fec_emision

        },
        {
          question_id: "tit_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "open",
          question: "Título Emisión",
          answer: caseProcessing.tit_emision
        },
        {
          question_id: "fec_recepcion",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "date_after",
          question: "Fecha Recepción",
          answer: caseProcessing.fec_recepcion
        },
        {
          question_id: "otra_via_entrada",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: "OF",
          question_type: "area",
          question: "Otra vía Entrada",
          answer: caseProcessing.otra_via_entrada
        }
      ]
    };


    //Lugar y Hecho
    var institutionInformation = {
      section_id: 3,
      section_title: "Lugar y Hecho",
      questions: [
        {
          question_id: "fec_hecho",
          question_type: "date_time",
          required: 1,
          question: "Fecha y Hora Hecho",
          answer: caseProcessing.fec_hecho 
        },
        {
          question_id: "fec_hor_hecho_aprox",
          question_type: "closed",
          required: 1,
          question: "Fecha y Hora Hecho ES",
          answer: caseProcessing.fec_hor_hecho_aprox,
          answers: [
            { answer_id: 'A', answer: 'Fecha y Hora Exacta' },
            { answer_id: 'E', answer: 'Fecha y Hora Aproximada' },
            { answer_id: 'H', answer: 'Fecha Exacta y Hora Aproximada' },
            { answer_id: 'F', answer: 'Fecha Aproximada y Hora Exacta' }
          ]
        },
        {
          question_id: "id_pais_hecho",
          question_type: "closed",
          required: 1,
          question: "Pais",
          //answer: Number.parseInt(caseProcessing.id_pais_hecho),
          answer: 62,
          answers: country
        },
        {
          question_id: "id_depto_hecho",
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_mun_hecho",
          question: "Departamento",
          answer: Number.parseInt(caseProcessing.id_depto_hecho),
          answers: state
        },
        {
          question_id: "id_mun_hecho",
          question_type: "closed",
          question: "Municipio",
          answer: Number.parseInt(caseProcessing.id_mun_hecho),
          answers: municipality
        },
        {
          question_id: "lugar",
          question_type: "area",
          required: 1,
          question: "Lugar del Hecho",
          answer: caseProcessing.lugar
        },
        {
          question_id: "hecho",
          question_type: "area",
          required: 1,
          question: "Descripcíon del Hecho",
          answer: caseProcessing.hecho
        }

      ]
    }


    sections.push(meansEntry, institutionInformation);

    var formcasaProcessing = {
      form_id: caseProcessing.id_caso_temp,
      sections: sections
    }

    
    return res.status(200).json({
      form: formcasaProcessing
    })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getCaseProcessingFormById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let updateCaseProcesing = async (req, res) => {
  
  const {id_caso_temp} = req.params;

  const {tipo_via_entrada, via_entrada, otra_via_entrada, fecha, fec_hor_hecho_aprox, id_depto_hech, id_mun_hech, 
    lugar, hecho, fuente, fec_emision, tit_emision, fec_recepcion, id_prg_cal_turno, nom_victima, nom_denunciante, 
    id_pais_hecho, hor_recepcion} = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al actualizar el tramite del caso.", instance: "case-processing/updateCaseProcesing" });

    var localDate =  new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var fecha_hecho = dateFormat(localDate, 'yyyy-mm-dd');
    // var hor_recepcion = dateFormat(localDate, 'HH:MM:ss');

    var cod_usu = 1;
    //var cod_usu = req.user.user_id;
    //var user_name = req.user.name;
    var user_name = 'Usuario Actualizo';
    var id_ins_mod = 1

    await db.query(`UPDATE tcdh_caso_temp
    SET tipo_via_entrada=$1, via_entrada=$2, otra_via_entrada=$3, fecha=$4, fec_hor_hecho_aprox=$5, fec_hecho=$6, hor_hecho=$7, 
    id_depto_hecho=$8, id_mun_hecho=$9, lugar=$10, hecho=$11, cod_usu_mod=$12, usu_mod_reg=$13, fec_mod_reg=$14, id_ins_mod=$15, 
    fuente=$16, fec_emision=$17, tit_emision=$18, fec_recepcion=$19, hor_recepcion=$20, id_prg_cal_turno=$21, nom_victima=$22, 
    nom_denunciante=$23, id_pais_hecho=$24
    WHERE id_caso_temp = $25`, [tipo_via_entrada, via_entrada, otra_via_entrada, fecha, fec_hor_hecho_aprox, null, registration_date, 
      id_depto_hech, id_mun_hech, lugar, hecho, cod_usu, user_name, registration_date, id_ins_mod, fuente, registration_date, tit_emision, 
      null, null, id_prg_cal_turno, nom_victima, nom_denunciante, id_pais_hecho, id_caso_temp], (err, results)=>{
      if(err){
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }else{
        var caseProcessing = results.rows[0];
        return res.status(200).json({
          message: 'Caso Actualizado'
        });
      }
    })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updateCaseProcesing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

//Persona Involucrado

let getInvolvedFormList = async (req,res) => {
  const { id_caso_temp } = req.params;

  var cod_usu = req.user.user_id;

  try {
    
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener la lista de involucrados del caso.", instance: "case-processing/getInvolvedFormList" });
    await db.query(`SELECT id_persona_temp::integer AS form_id, CONCAT(nombre,' ',apellido) AS name, tipo_rel_caso
    FROM tcdh_persona_temp 
    WHERE id_caso_temp = $1
    ORDER BY id_caso_temp DESC 
    `, [id_caso_temp], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var involved = results.rows;       
        return res.status(200).json({
          involved
        });
      }
    });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getInvolvedFormList', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
}

let getPersonInvolvedForm = async (req, res) => {

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
    country = country.rows;

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
            { answer_id:'D', answer: 'Denunciante' },
            { answer_id:'V', answer: 'Victima' },
            { answer_id:'A', answer: 'Denunciante/Victima' }
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
            { answer_id:'N', answer: 'Natural' },
            { answer_id:'J', answer: 'Jurídico' },
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
            { answer_id:'I', answer: 'Individual' },
            { answer_id:'C', answer: 'Colectivo' },
          ]
        },
        //no seguardan en bases de datos
        {
          question_id: "confidencial",
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id:'S', answer: 'Si' },
            { answer_id:'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id:'S', answer: 'Si' },
            { answer_id:'N', answer: 'No' }
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
      dependent_answer: 'N',
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
          answers: country
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
            { answer_id:'F', answer: 'Femenino'},
            { answer_id:'M', answer: 'Masculino'},
            { answer_id:'S', answer: 'Sin Respuesta'}
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
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_municipio",
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          question: "Municipio",
          answers: municipality
        },
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: 1,
          question: "Tipo de Zona",
          answers: [
            { answer_id:'R', answer: 'Rural'},
            { answer_id:'U', answer: 'Urbano'},
            { answer_id:'N', answer: 'No Definida'}
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
            { answer_id:'T', answer: 'Teléfono'},
            { answer_id:'D', answer: 'Dirección que señala para notificar' },
            { answer_id:'F', answer: 'Fax' },
            { answer_id:'C', answer: 'Correo Electrónico' },
            { answer_id:'P', answer: 'Pendiente' }
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

let createPersonInvolvedForm = async(req, res) =>{
  const { id_caso_temp } = req.params;
  const {per_den_es_victima, per_principal, nombre, apellido,
    id_cat_cal_actua, sexo, ide_genero, lee, escribe, id_cat_doc_persona,
    otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio,
    id_departamento, id_municipio, domicilio, discapacidad, id_cat_tip_discapacidad, tipo_rel_caso} = req.body;
  
  //Pendientes
  //med_rec_notificacion, num_telefono, fax, correo_electronico, dir_notificar, per_aprox_afectada
  
  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/createPersonInvolvedForm" });
    
    var localDate =  new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var est_reg = 'R';
    var cod_user = 1;

    //var cod_usu = req.user.user_id;
    //var user_name = req.user.name;

    //obs_est_reg, id_ins_ing, id_ins_mod, otra_ide_genero
    var user_ing_reg = 'Usuario Prueba';

    let nom_completo = nombre +' '+ apellido;

    await db.query(`INSERT INTO tcdh_persona_temp(
      per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, 
      sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, 
      id_niv_academico, id_pais_nacimiento, id_pais_ins_rep, fec_nacimiento, edad_aprox, 
      id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio, discapacidad, 
      id_cat_tip_discapacidad, 
      est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, 
      cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp, tipo_rel_caso)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35) RETURNING *`, [
      per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, 
      sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, 
      id_niv_academico, id_pais_nacimiento, id_pais_ins_rep, fec_nacimiento, edad_aprox, 
      id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio, discapacidad, 
      id_cat_tip_discapacidad, est_reg, registration_date, cod_user, user_ing_reg, registration_date, 
      cod_user, user_ing_reg, registration_date, id_caso_temp, tipo_rel_caso], (err, results) => {
  
        if(err){
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        }else{
          var personInvolved = results.rows[0];
          return res.status(201).json({
            message: 'Se creo la persona involucrada'
          });
        }
  
      })
      
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'createPersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let getPersonInvolvedById = async(req, res) =>{
  //const { id_persona_temp } = req.params;

  var id_persona_temp = 0;
  if(req.params.id_persona_temp != "null"){
    id_persona_temp = req.params.id_persona_temp;
  }

  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/getPersonInvolvedById" });
    
    var personInvolved = await db.query(`SELECT * FROM tcdh_persona_temp WHERE id_persona_temp = $1`, [id_persona_temp]);
    personInvolved = personInvolved.rows[0];

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
          answer: personInvolved != null ? personInvolved.tipo_rel_caso: null  ,
          answers: [
            { answer_id:'D', answer: 'Denunciante' },
            { answer_id:'V', answer: 'Victima' },
            { answer_id:'A', answer: 'Denunciante/Victima' }
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
          answer: personInvolved != null ? personInvolved.persona_denunciante: null ,
          answers: [
            { answer_id:'N', answer: 'Natural' },
            { answer_id:'J', answer: 'Jurídico' },
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
          answer: personInvolved != null ? personInvolved.persona_victima: null,
          answers: [
            { answer_id:'I', answer: 'Individual' },
            { answer_id:'C', answer: 'Colectivo' },
          ]
        },
        //no seguardan en bases de datos
        {
          question_id: "confidencial",
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id:'S', answer: 'Si' },
            { answer_id:'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id:'S', answer: 'Si' },
            { answer_id:'N', answer: 'No' }
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
          question: "Nombre",
          answer: personInvolved != null ? personInvolved.nombre: null 
        },
        {
          question_id: "apellido",
          required: 1,
          question_type: "open",
          question: "Apellido",
          answer: personInvolved != null ? personInvolved.apellido: null 
        },
        {
          question_id: "id_cat_doc_persona",
          required: 1,
          question_type: "closed",
          question: "Doc. Presentado",
          answer: personInvolved != null ? personInvolved.id_cat_doc_persona: null,
          answers: personalDocuments
        },
        {
          question_id: "num_documento",
          required: 1,
          question_type: "open",
          question: "Núm. Documento",
          answer: personInvolved != null ? personInvolved.num_documento: null 
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          question: "Fecha Nacimiento",
          answer: personInvolved != null ? personInvolved.fec_nacimiento: null 
        },
        {
          question_id: "id_pais",
          enabled: 0,
          question_type: "open",
          question: "Pais Nacimiento",
          answer: personInvolved != null ? personInvolved.id_pais: null ,
          answers: country
        },
        {
          question_id: "sexo",
          required: 1,
          question_type: "switch",
          question: "Sexo",
          answer: personInvolved != null ? personInvolved.sexo: null 
        },
        {
          question_id: "lee",
          required: 1,
          question_type: "switch",
          question: "Saber Leer",
          answer: personInvolved != null ? personInvolved.lee : null 
        },
        {
          question_id: "escribe",
          required: 1,
          question_type: "radiobutton",
          question: "Saber Escribir",
          answer: personInvolved != null ?personInvolved.escribe : null  
        },
        {
          question_id: "discapacidad",
          question_type: "radiobutton",
          question: "Discapacidad",
          answer: personInvolved != null ? personInvolved.discapacidad : null  
        },
        {
          question_id: "id_ori_sexual",
          required: 1,
          question_type: "closed_multiple",
          question: "Orientación Sexual",
          answer: personInvolved != null ?  personInvolved.id_ori_sexual: null ,
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: 1,
          question_type: "open",
          question: "Edad Aproximada",
          answer: personInvolved != null ? personInvolved.edad_aprox: null  
        },
        {
          question_id: "id_cat_pro_oficio",
          required: 1,
          question_type: "closed",
          question: "Ocupación",
          answer: personInvolved != null ? personInvolved.id_cat_pro_oficio: null  ,
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answer: personInvolved != null ?  personInvolved.ide_genero: null ,
          answers: [
            { answer_id:'F', answer: 'Femenino'},
            { answer_id:'M', answer: 'Masculino'},
            { answer_id:'S', answer: 'Sin Respuesta'}
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
          answer: personInvolved != null ? personInvolved.id_niv_academico : null,
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
          answer: personInvolved != null ? personInvolved.id_cat_tip_discapacidad : null  ,
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
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "id_municipio",
          question: "Departamento",
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_departamento): null  ,
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          question: "Municipio",
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_municipio) : null  ,
          answers: municipality
        },
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: 1,
          question: "Tipo de Zona",
          answer: personInvolved != null ? personInvolved.zona_domicilio: null  ,
          answers: [
            { answer_id:'R', answer: 'Rural'},
            { answer_id:'U', answer: 'Urbano'},
            { answer_id:'N', answer: 'No Definida'}
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
          answer: personInvolved != null ? personInvolved.domicilio: null  
        },
        {
          question_id: "med_rec_notificacion",
          question_type: "closed_multiple",
          question: "Medio de Notificación",
          answer:personInvolved != null ? personInvolved.med_rec_notificacion: null  ,
          answers: [
            { answer_id:'T', answer: 'Teléfono'},
            { answer_id:'D', answer: 'Dirección que señala para notificar' },
            { answer_id:'F', answer: 'Fax' },
            { answer_id:'C', answer: 'Correo Electrónico' },
            { answer_id:'P', answer: 'Pendiente' }
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
          answer: personInvolved != null ?  personInvolved.id_cat_cal_actua: null ,
          answers: qualityOperates
        }

      ]
    }

 
    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: personInvolved != null ? personInvolved.id_persona_temp: 0  ,
      sections: sections
    }

    
    return res.status(200).json({
      form: involved
    })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getPersonInvolvedById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let updatePersonInvolvedForm = async (req, res) => {
  const { id_persona_temp } = req.params;
  const { per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, sexo, ide_genero, 
    lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, 
    domicilio, discapacidad, id_cat_tip_discapacidad, med_rec_notificacion } = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar a la persona involucrada.", instance: "case-processing/updatePersonInvolvedForm" });
    
    var localDate =  new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var est_reg = 'R';
    var cod_user = 1;
    //var user_name = req.user.name;
    var user_name = 'Nombre Apellido'

    await db.query(`UPDATE tcdh_persona_temp
    SET per_den_es_victima=$1, per_principal=$2, nombre=$3, apellido=$4, id_cat_cal_actua=$5, nom_completo=$6, sexo=$7, ide_genero=$8, 
    lee=$9, escribe=$10, id_cat_doc_persona=$11, otro_doc_identidad=$12, num_documento=$13, id_niv_academico=$14, id_pais_nacimiento=$15, 
    id_pais_ins_rep=$16, fec_nacimiento=$17, edad_aprox=$18, id_cat_pro_oficio=$19, zona_domicilio=$20, id_departamento=$21, id_municipio=$22, 
    domicilio=$23, discapacidad=$24, id_cat_tip_discapacidad=$25, med_rec_notificacion=$26, cod_usu_mod=$27, usu_mod_reg=$28, fec_mod_reg=$29 
    WHERE id_persona_temp = $30`, [per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, user_name, sexo, ide_genero, 
      lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento, 
      id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, 
      domicilio, discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, cod_user, user_name, registration_date, id_persona_temp], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }else{
        var personInvolved = results.rows[0];
        return res.status(201).json({
          message: 'Persona Actualizada'
        });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updatePersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
}

let deletePersonInvolved = async(req, res) =>{
  const { id_persona_temp } = req.params;
  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al eliminar la persona involucrada.", instance: "case-processing/deletePersonInvolved" });
    await db.query(`UPDATE tcdh_persona_temp SET est_reg = 'E' WHERE id_persona_temp = $1`, [id_persona_temp], (err, results)=>{
      if(err){
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }else{
        var personInvolved = results.rows[0];
        return res.status(201).json({
          message: 'Persona Eliminada'
        });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'deletePersonInvolved', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

  module.exports = {
    getcaseProcesingFormList,
    getCaseProcessingForm,
    createCaseProcessing,
    getCaseProcesingById,
    updateCaseProcesing,
    getPersonInvolvedForm,
    createPersonInvolvedForm,
    getPersonInvolvedById,
    updatePersonInvolvedForm,
    deletePersonInvolved,
    getInvolvedFormList
  }