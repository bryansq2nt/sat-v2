const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');

//Tramitacion de Casos

let getFormVersion = (req, res) => {

  let version = parseFloat("1.1");

  return res.status(200).json({ version });
}

let getInvolverFormVersion = (req, res) => {

  let version = parseFloat("1.4");

  return res.status(200).json({ version });
}

let getcaseProcesingFormList = async (req, res) => {
  const { offset } = req.query;

  var cod_usu = req.user.user_id;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/getcaseProcesingFormList" });
    await db.query(`SELECT id_caso_temp::numeric AS form_id 
    FROM tcdh_caso_temp 
    WHERE cod_usu_ing = $1 AND marca is null
    ORDER BY id_caso_temp DESC LIMIT 25 OFFSET $2
    `, [cod_usu, offset], (err, results) => {
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
    log('src/controllers/back', 'case-processing', 'getcaseProcesingFormList', error, true, req, res);
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
          question_id: "fec_hora",
          question_type: "date_time",
          required: 1,
          question: "Fecha de ingreso"
        },
        {
          question_id: "tipo_via_entrada",
          required: 1,
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "via_entrada",
          question: "Tipo Vía Entrada",
          answers: [
            { answer_id: 'V', answer: 'Verbal' },
            { answer_id: 'E', answer: 'Escrita' },
            { answer_id: 'O', answer: 'De Oficio' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          question: "Via Entrada",
          answers: [
            { answer_id: 'p', answer: 'Persona', to_compare: "V" },
            { answer_id: 'T', answer: 'Telefonica', to_compare: "V" },
            { answer_id: 'O', answer: 'Otra', to_compare: "V" },

            { answer_id: 'F', answer: 'Fax', to_compare: "E" },
            { answer_id: 'E', answer: 'E-mail', to_compare: "E" },
            { answer_id: 'C', answer: 'Carta', to_compare: "E" },
            { answer_id: 'O', answer: 'Otra', to_compare: "E" },

            { answer_id: 'S', answer: 'Prensa Escrita', to_compare: "O" },
            { answer_id: 'R', answer: 'Radio', to_compare: "O" },
            { answer_id: 'V', answer: 'Television', to_compare: "O" },
            { answer_id: 'I', answer: 'Internet', to_compare: "O" },
            { answer_id: 'M', answer: 'Informe', to_compare: "O" },
            { answer_id: 'A', answer: 'Aviso', to_compare: "O" },
            { answer_id: 'N', answer: 'Noticia', to_compare: "O" },
            { answer_id: 'O', answer: 'Otra', to_compare: "O" },

          ]
        },
        //Se cambio el orden que estaba, estaba antes de fuente. 
        {
          question_id: "otra_via_entrada",
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "via_entrada",
          dependent_answer: 'O',
          question_type: "area",
          question: "Otra vía Entrada"
        },
        {
          question_id: "fuente",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "open",
          question: "Fuente Emisión"
        },
        {
          question_id: "fec_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "date",
          question: "Fecha Emisión"
        },
        {
          question_id: "tit_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "open",
          question: "Título Emisión"
        },
        {
          question_id: "fec_recepcion",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "date_after",
          question: "Fecha Recepción"
        },
        {
          question_id: "otra_via_entrada",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
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
          question_type: "date_time",
          required: 1,
          question: "Fecha y Hora Hecho"
        },
        {
          question_id: "fec_hor_hecho_aprox",
          question_type: "closed",
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

// Create case Actualizado
let createCaseProcessing = async (req, res) => {
  const { tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, fec_hecho, id_depto_hecho,
    id_mun_hecho, lugar, hecho, fuente, fec_emision, tit_emision, fec_recepcion, id_pais_hecho } = req.body

  console.log('------------------------------------------');

  console.log('tipo_via_entrada', tipo_via_entrada);
  console.log('via_entada', via_entrada);
  console.log('otra_via_entrada', otra_via_entrada);
  console.log('fec_hora', fec_hora);
  console.log('fec_hor_hecho_aprox', fec_hor_hecho_aprox);
  console.log('fec_hecho', fec_hecho);
  console.log('id_depto_hecho', id_depto_hecho);
  console.log('id_mun_hecho', id_mun_hecho);
  console.log('lugar', lugar);
  console.log('hecho', hecho);
  console.log('fuente', fuente);
  console.log('fec_emision', fec_emision);
  console.log('tit_emision', tit_emision);
  console.log('fec_recepcion', fec_recepcion);
  // console.log('id_mun_hecho', nom_victima);
  //console.log('nom_denunciante', nom_denunciante);
  console.log('id_pais_hecho', id_pais_hecho);

  console.log('------------------------------------------');

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/createCaseProcessing" });

    // Datos no identificados de que tablas obtenerlos
    // cod_depto_ing
    // id_ins_ing
    // id_ins_mod

    // Datos no encontrado en el documento del formulario 
    // id_prg_cal_turno, nom_victima, nom_denunciante

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    var fecha = dateFormat(localDate, 'yyyy-mm-dd');
    //var fec_hecho_nueva = fecha.replace(/-/g, "");

    var est_reg = 'R';
    var cod_usu = req.user.user_id;
    var user_name = req.user.name;


    var nueva_fec_hecho;

    if (fec_hecho == null || fec_hecho === "" || fec_hecho == undefined) {
      nueva_fec_hecho = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    } else {
      nueva_fec_hecho = fec_hecho
    }

    var hora = dateFormat(nueva_fec_hecho, 'HH:MM:ss');
    var hor_recepcion = dateFormat(registration_date, 'HH:MM:ss');

    if (id_pais_hecho == null || id_pais_hecho === "" || id_pais_hecho == undefined) {
      nuevo_id_pais_hecho = 0;
    } else {
      nuevo_id_pais_hecho = id_pais_hecho;
    }

    await db.query(`INSERT INTO tcdh_caso_temp(
      hay_mas_vic_den, reg_ing_turno, en_turno, 
      fec_en_turno, tipo_via_entrada, via_entrada, otra_via_entrada, id_usu_asignado, fec_asignado, fecha, fec_hora,  
      fec_hor_hecho_aprox, fec_hecho, hor_hecho, id_depto_hecho, id_mun_hecho, lugar, hecho, est_reg, fec_est_reg, cod_usu_ing, 
      usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion, id_pais_hecho)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *`,
      ['N', 'N', 'N', registration_date, tipo_via_entrada, via_entrada, otra_via_entrada, cod_usu, registration_date, fecha,
        fec_hora, fec_hor_hecho_aprox, nueva_fec_hecho, hora, id_depto_hecho, id_mun_hecho, lugar, hecho,
        est_reg, registration_date, cod_usu, user_name, registration_date, cod_usu, user_name, registration_date, fuente, fec_emision,
        tit_emision, fec_recepcion, hor_recepcion, nuevo_id_pais_hecho], (err, results) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json(errorResponse.toJson());
          } else {
            var caseProcessing = results.rows[0];
            return res.status(201).json({
              "case_id": caseProcessing.id_caso_temp
            });
          }
        });

  } catch (error) {
    console.log("error");
    console.log(error);
    log('src/controllers/back', 'case-processing', 'createCaseProcessing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let getCaseProcesingById = async (req, res) => {
  const { id_caso_temp } = req.params;

  //console.log('----------------- getPersonInvolvedForm-----------------');
  let get_caso_temp = id_caso_temp;
  let id_caso = Number.parseInt(get_caso_temp);
  //console.log('-----------------------------------------------------');

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcesingById" });

    var caseProcessing = await db.query(`SELECT * FROM tcdh_caso_temp WHERE id_caso_temp = $1`, [id_caso]);
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
          question_id: "fec_hora",
          question_type: "date_time",
          required: 1,
          question: "Fecha de ingreso",
          answer: caseProcessing.fec_hora
        },
        {
          question_id: "tipo_via_entrada",
          required: 1,
          question_type: "closed_with_child",
          has_child: 1,
          principal_child: "via_entrada",
          question: "Tipo Vía Entrada",
          answer: caseProcessing.tipo_via_entrada,
          answers: [
            { answer_id: 'V', answer: 'Verbal' },
            { answer_id: 'E', answer: 'Escrita' },
            { answer_id: 'O', answer: 'De Oficio' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          question: "Via Entrada",
          answer: caseProcessing.via_entrada,
          answers: [
            { answer_id: 'p', answer: 'Persona', to_compare: "V" },
            { answer_id: 'T', answer: 'Telefonica', to_compare: "V" },
            { answer_id: 'O', answer: 'Otra', to_compare: "V" },

            { answer_id: 'F', answer: 'Fax', to_compare: "E" },
            { answer_id: 'E', answer: 'E-mail', to_compare: "E" },
            { answer_id: 'C', answer: 'Carta', to_compare: "E" },
            { answer_id: 'O', answer: 'Otra', to_compare: "E" },

            { answer_id: 'S', answer: 'Prensa Escrita', to_compare: "O" },
            { answer_id: 'R', answer: 'Radio', to_compare: "O" },
            { answer_id: 'V', answer: 'Television', to_compare: "O" },
            { answer_id: 'I', answer: 'Internet', to_compare: "O" },
            { answer_id: 'M', answer: 'Informe', to_compare: "O" },
            { answer_id: 'A', answer: 'Aviso', to_compare: "O" },
            { answer_id: 'N', answer: 'Noticia', to_compare: "O" },
            { answer_id: 'O', answer: 'Otra', to_compare: "O" }

          ]
        },
        {
          question_id: "otra_via_entrada",
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
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
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "open",
          question: "Fuente Emisión",
          answer: caseProcessing.fuente
        },
        {
          question_id: "fec_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "date",
          question: "Fecha Emisión",
          answer: caseProcessing.fec_emision

        },
        {
          question_id: "tit_emision",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "open",
          question: "Título Emisión",
          answer: caseProcessing.tit_emision
        },
        {
          question_id: "fec_recepcion",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
          question_type: "date_after",
          question: "Fecha Recepción",
          answer: caseProcessing.fec_recepcion
        },
        {
          question_id: "otra_via_entrada",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: "O",
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
    log('src/controllers/back', 'case-processing', 'getCaseProcesingById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

// Update Case Actualizado
let updateCaseProcesing = async (req, res) => {

  const { id_caso_temp } = req.params;

  const { tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, fec_hecho, id_depto_hecho,
    id_mun_hecho, lugar, hecho, fuente, fec_emision, tit_emision, fec_recepcion, nom_victima, nom_denunciante,
    id_pais_hecho } = req.body

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al actualizar el tramite del caso.", instance: "case-processing/updateCaseProcesing" });

    var localDate = new Date();
    //var fecha = dateFormat(localDate, 'yyyy-mm-dd');
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    //var fec_hecho_nueva = fecha.replace(/-/g, "");
    //var hora = dateFormat(localDate, 'HH:MM:ss');

    var cod_usu = req.user.user_id;
    var user_name = req.user.name;

    var nueva_fec_hecho;

    //fecha asignado y fecha
    var fec_asignado = dateFormat(fec_hora, 'yyyy-mm-dd');
    var fecha = dateFormat(fec_hora, 'yyyy-mm-dd');


    //fecha hecho
    if (fec_hecho == null || fec_hecho === "" || fec_hecho == undefined) {
      nueva_fec_hecho = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    } else {
      nueva_fec_hecho = fec_hecho;
    }

    var hora = dateFormat(nueva_fec_hecho, 'HH:MM:ss');
    var hor_recepcion = dateFormat(registration_date, 'HH:MM:ss');

    if (id_pais_hecho == null || id_pais_hecho === "" || id_pais_hecho == undefined) {
      nuevo_id_pais_hecho = 0;
    } else {
      nuevo_id_pais_hecho = id_pais_hecho;
    }


    await db.query(`UPDATE tcdh_caso_temp
    SET tipo_via_entrada=$1, via_entrada=$2, otra_via_entrada=$3, fec_hora=$4, fec_hor_hecho_aprox=$5, fec_hecho=$6, hor_hecho=$7, 
    id_depto_hecho=$8, id_mun_hecho=$9, lugar=$10, hecho=$11, cod_usu_mod=$12, usu_mod_reg=$13, fec_mod_reg=$14, fuente=$15, 
    fec_emision=$16, tit_emision=$17, fec_recepcion=$18, hor_recepcion=$19, nom_victima=$20, nom_denunciante=$21, id_pais_hecho=$22,
    fec_asignado = $23, fecha=$24
    WHERE id_caso_temp = $25 RETURNING*`, [tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, nueva_fec_hecho, hora,
      id_depto_hecho, id_mun_hecho, lugar, hecho, cod_usu, user_name, registration_date, fuente, fec_emision, tit_emision,
      fec_recepcion, hor_recepcion, nom_victima, nom_denunciante, id_pais_hecho, fec_asignado, fecha, id_caso_temp], (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var caseProcessing = results.rows[0];
          return res.status(201).json({
            caseProcessing
          });
        }
      })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updateCaseProcesing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

//Persona Involucrado
let getInvolvedFormList = async (req, res) => {
  const { id_caso_temp } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener la lista de involucrados del caso.", instance: "case-processing/getInvolvedFormList" });
    await db.query(`SELECT rc.id_persona_temp::integer AS form_id, 
    CONCAT(pt.nombre,' ',pt.apellido) AS name, pt.tipo_rel_caso
    FROM tcdh_per_rel_caso_temp as rc
    LEFT JOIN tcdh_persona_temp AS pt ON pt.id_persona_temp = rc.id_persona_temp
    LEFT JOIN tcdh_caso_temp AS c ON c.id_caso_temp = rc.id_caso_temp
    WHERE rc.id_caso_temp = $1
    ORDER BY rc.id_caso_temp DESC 
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

  // const { id_caso_temp } = req.params;
  // let get_caso_temp = id_caso_temp;
  // let id_caso = Number.parseInt(get_caso_temp);

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getPersonInvolvedForm" });

    // var caso_temp = await db.query(`SELECT id_caso_temp::integer AS id_caso_temp  FROM tcdh_caso_temp WHERE id_caso_temp = $1`, [id_caso]);
    // caso_temp = caso_temp.rows[0];

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

    var typeDisability = await db.query(`SELECT id_cat_tip_discapacidad::integer AS answer_id, descripcion AS answer FROM admi_cat_tip_discapacidad WHERE est_reg = 'A'`);
    typeDisability = typeDisability.rows;

    var academicLevel = await db.query(`SELECT id_niv_academico::integer AS answer_id, descripcion AS answer FROM admi_niv_academico WHERE est_reg = 'A'`);
    academicLevel = academicLevel.rows;

    var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
    qualityOperates = qualityOperates.rows;

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais`);
    country = country.rows;

    var institutionCountry = await db.query('SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais');
    institutionCountry = institutionCountry.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

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
            { answer_id: 'D', answer: 'Denunciante' },
            { answer_id: 'V', answer: 'Victima' },
            { answer_id: 'A', answer: 'Denunciante/Victima' }
          ]
        },
        //Se cambio el nombre
        {
          question_id: "tipo_persona",
          required: 1,
          dependent: 1,
          dependent_multiple:1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: ['D', 'A'],
          question_type: "closed",
          question: "Persona Denunciante",
          answers: [
            { answer_id: 'N', answer: 'Natural' },
            { answer_id: 'J', answer: 'Jurídico' },
          ]
        },
        {
          question_id: "persona_victima",
          required: 1,
          dependent: 1,
          dependent_multiple:1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: ['V', 'A'],
          question_type: "closed",
          question: "Persona Victima",
          answers: [
            { answer_id: 'I', answer: 'Individual' },
            { answer_id: 'C', answer: 'Colectivo' },
          ]
        },
        {
          question_id: "confidencial",
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
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
      section_title: "Información General de la persona",
      questions: [
        {
          question_id: "nombre",
          question_type: "open",
          required: 1,
          limit:100,
          question: "Nombre"
        },
        {
          question_id: "apellido",
          question_type: "open",
          required: 1,
          limit:100,
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
          limit:50,
          question_type: "open",
          question: "Núm. Documento"
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          question: "Fecha Nacimiento"
        },
        {
          question_id: "id_pais_nacimiento",
          question_type: "closed",
          question: "Pais Nacimiento",
          answers: country
        },
        {
          question_id: "sexo",
          required: 1,
          question_type: "closed",
          question: "Sexo",
          answers: [
            { answer_id: "H", answer: "Hombre" },
            { answer_id: "M", answer: "Mujer" }
          ]
        },
        {
          question_id: "lee",
          required: 1,
          question_type: "closed",
          question: "Saber Leer",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "escribe",
          required: 1,
          question_type: "closed",
          question: "Saber Escribir",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "discapacidad",
          question_type: "closed",
          question: "Discapacidad",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_ori_sexual",
          required: 1,
          question_type: "closed",
          question: "Orientación Sexual",
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: 1,
          question_type: "numeric",
          limit:3,
          question: "Edad Aproximada"
        },
        {
          question_id: "id_cat_pro_oficio",
          required: 1,
          question_type: "closed_searchable_case_processing",
          question: "Ocupación",
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answers: [
            { answer_id: 'F', answer: 'Femenino' },
            { answer_id: 'M', answer: 'Masculino' }
            // { answer_id: 'R', answer: 'Sin Respuesta' }
          ]
        },
        {
          question_id: "id_niv_academico",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "escribe",
          dependent_answer: "S",
          question_type: "closed",
          question: "Niv. Académico",
          answers: academicLevel
        },
        {
          question_id: "id_cat_tip_discapacidad",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "discapacidad",
          dependent_answer: "S",
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
            { answer_id: 'R', answer: 'Rural' },
            { answer_id: 'M', answer: 'Semirural' },
            { answer_id: 'U', answer: 'Urbano' },
            { answer_id: 'O', answer: 'Semiurbano' },
            { answer_id: 'N', answer: 'No Definida' }
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
          limit:500,
          question: "Dirección",
        },
        {
          question_id: "med_rec_notificacion",
          question_type: "closed_multiple",
          question: "Medio de Notificación",
          answers: [
            { answer_id: 0, answer: 'Teléfono' },
            { answer_id: 1, answer: 'Dirección que señala para notificar' },
            { answer_id: 2, answer: 'Fax' },
            { answer_id: 3, answer: 'Correo Electrónico' },
            { answer_id: 4, answer: 'Pendiente' }
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
          question_type: "closed",
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
      dependent_question_id: "tipo_persona",
      dependent_answer: "J",
      section_title: "Información de Institución",
      questions: [
        {
          question_id: "institucion",
          question_type: "area",
          required: 1,
          limit:200,
          question: "Institucion",
        },
        {
          question_id: "id_pais_ins_rep",
          question_type: "closed",
          question: "Nacionalidad de Institución",
          answers: institutionCountry
        },
        {
          question_id: "id_cat_cal_actua",
          //required: 1,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answers: qualityOperates
        }

      ]
    }


    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: 0,
      // id_caso_temp: caso_temp != null ? caso_temp.id_caso_temp: null,
      sections: sections
    }

    return res.status(200).json({
      form: involved
    })

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getPersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

//Create Involved Atualizado
let createPersonInvolvedForm = async (req, res) => {
  const { id_caso_temp } = req.params;
  const { tipo_rel_caso, tipo_persona, persona_victima, confidencial, aut_dat_den_vic, nombre, apellido, id_cat_cal_actua,
    sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio,
    discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, id_grp_vulnerable, id_ori_sexual, institucion } = req.body;

  console.log('------------------------------------------------');
  console.log('tipo_persona', tipo_persona);
  console.log('confidencial', confidencial);
  console.log('aut_dat_den_vic', aut_dat_den_vic);
  console.log('nombre', nombre);
  console.log('apellido', apellido);
  console.log('id_cat_cal_actua', id_cat_cal_actua);
  console.log('sexo', sexo);
  console.log('id_genero', ide_genero);
  console.log('lee', lee);
  console.log('escribe', escribe);
  console.log('id_cat_doc_personas', id_cat_doc_persona);
  console.log('otro_doc_indentidad', otro_doc_identidad);
  console.log('num_documento', num_documento);
  console.log('id_niv_academico', id_niv_academico);
  console.log('id_pais_nacimiento', id_pais_nacimiento);
  console.log('id_pais_ins_rep', id_pais_ins_rep);
  console.log('fec_nacimiento', fec_nacimiento);
  console.log('edad_prox', edad_aprox);
  console.log('id_cat_pro_oficio', id_cat_pro_oficio); // Buscarlo el id de la profesion que se recibe, mediante una consulta
  console.log('zona_domicilio', zona_domicilio);
  console.log('id_departamento', id_departamento);
  console.log('id_municipio', id_municipio);
  console.log('domicilio', domicilio);
  console.log('discapcidad', discapacidad);
  console.log('id_cat_tip_discapacidad', id_cat_tip_discapacidad);
  console.log('med_rec_notificacion', med_rec_notificacion);
  console.log('id_grp_vulnerable', id_grp_vulnerable);
  console.log('id_ori_sexual', id_ori_sexual);
  console.log('***********');
  console.log('tipo_rel_caso', tipo_rel_caso);
  console.log('institucion', institucion);
  console.log('persona victima', persona_victima)
  console.log('------------------------------------------------');



  //Pendientes
  //num_telefono, fax, correo_electronico, dir_notificar, per_aprox_afectada

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/createPersonInvolvedForm" });

    let professionPerson = await db.query(`SELECT id_cat_pro_oficio, descripcion
    FROM admi_cat_pro_oficio WHERE descripcion like '%${id_cat_pro_oficio}'`);
    professionPerson = professionPerson.rows[0];
    
    var medNotificationTempArray = [];

    if(med_rec_notificacion != null){
      for (let i = 0; i < med_rec_notificacion.length; i++) {
        if(med_rec_notificacion[i] == 0){
          medNotificationTempArray.push('T');
        }else if(med_rec_notificacion[i] == 1){
          medNotificationTempArray.push('D');
        }else if(med_rec_notificacion[i] == 2){
          medNotificationTempArray.push('F');
        }else if(med_rec_notificacion[i] == 3){
          medNotificationTempArray.push('C');
        }else{
          med_rec_notificacion[i] == 4
          medNotificationTempArray.push('P');
        }
      }
    }


    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var est_reg = 'R';

    let fec_nacimiento_nueva;
    if (fec_nacimiento == null || fec_nacimiento == "" || fec_nacimiento == undefined) {
      fec_nacimiento_nueva = dateFormat(fec_nacimiento, 'yyyy-mm-dd');
    } else {
      fec_nacimiento_nueva = fec_nacimiento;
    }


    var cod_user = req.user.user_id;
    var user_name = req.user.name;

    //Pendientes
    //obs_est_reg, id_ins_ing, id_ins_mod, otra_ide_genero

    let nom_completo;

    if(tipo_rel_caso == 'A'){
      nom_completo = institucion;
    }else{
      nom_completo = nombre + ' ' + apellido;
    }
    

    let per_den_es_victima;
    let per_principal;

    if (tipo_rel_caso == "A") {
      per_den_es_victima = 'S';
    } else {
      per_den_es_victima = 'N';
    }

    if (tipo_rel_caso == "V") {
      per_principal = 'S';
    } else {
      per_principal = 'N';
    }

    await db.query(`INSERT INTO tcdh_persona_temp(
      tipo_rel_caso, per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero, lee, escribe, id_cat_doc_persona, 
      otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento, id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, 
      id_departamento, id_municipio, domicilio, discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, 
      fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp, persona_denunciante, persona_victima, institucion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39) RETURNING *`, [tipo_rel_caso,
      per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad,
      num_documento, id_niv_academico, id_pais_nacimiento, id_pais_ins_rep, fec_nacimiento_nueva, edad_aprox, professionPerson.id_cat_pro_oficio, zona_domicilio, id_departamento,
      id_municipio, domicilio, discapacidad, id_cat_tip_discapacidad, medNotificationTempArray, est_reg, registration_date, cod_user, user_name, registration_date,
      cod_user, user_name, registration_date, id_caso_temp, tipo_persona, persona_victima, institucion], async (err, results) => {

        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var personInvolved = results.rows[0];

          if(personInvolved.tipo_rel_caso == 'A'){
            console.log('Tipo de personas Denunciante/Victima -- ', personInvolved.tipo_rel_caso);
            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
            id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
            fec_mod_reg, confidencial, aut_dat_den_vic)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [personInvolved.id_persona_temp, id_caso_temp, 'D', tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
            registration_date, confidencial, aut_dat_den_vic]);
            
            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              [personInvolved.id_persona_temp, id_caso_temp, 'V', tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
              registration_date, confidencial, aut_dat_den_vic]);

          }else{
            console.log('Tipo de personas Denunciante o Victima -- ', personInvolved.tipo_rel_caso);
            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              [personInvolved.id_persona_temp, id_caso_temp, personInvolved.tipo_rel_caso, tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
              registration_date, confidencial, aut_dat_den_vic]);
          }
           

          if (id_grp_vulnerable != null || id_grp_vulnerable != null) {

            db.query(`INSERT INTO tcdh_grp_vul_temp(
            id_grp_vulnerable, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_per_rel, id_caso_temp, migrado)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
              [id_grp_vulnerable, 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date, personInvolved.id_persona_temp,
                id_caso_temp, 'N']);
          } else {
            console.log("Viene Vacio Grupo Vulerables");
          }

          // if(id_ori_sexual != undefined || id_ori_sexual != null){

          //   for (let i = 0; i < id_ori_sexual.length; i++) {
          db.query(`INSERT INTO tcdh_ori_sex_per_temp(
                id_persona_temp, id_ori_sexual, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [personInvolved.id_persona_temp, id_ori_sexual, 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date,
              id_caso_temp]);
          //   }
          // }else{
          //   console.log("Viene Vacio orientacion sexual");
          // }  

          return res.status(201).json({
            personInvolved
          });


        }

      });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'createPersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

let getPersonInvolvedById_ = async (req, res) => {
  //const { id_persona_temp } = req.params;

  var id_persona_temp = 0;
  if (req.params.id_persona_temp != "null") {
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

    var typeDisability = await db.query(`SELECT id_cat_tip_discapacidad::integer AS answer_id, descripcion AS answer FROM admi_cat_tip_discapacidad WHERE est_reg = 'A'`);
    typeDisability = typeDisability.rows;

    var academicLevel = await db.query(`SELECT id_niv_academico::integer AS answer_id, descripcion AS answer FROM admi_niv_academico WHERE est_reg = 'A'`);
    academicLevel = academicLevel.rows;

    var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
    qualityOperates = qualityOperates.rows;

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows[0];

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    // let academicLevel = [];
    // let typeDisability = [];
    // let qualityOperates = [];

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
          answer: personInvolved != null ? personInvolved.tipo_rel_caso : null,
          answers: [
            { answer_id: 'D', answer: 'Denunciante' },
            { answer_id: 'V', answer: 'Victima' },
            { answer_id: 'A', answer: 'Denunciante/Victima' }
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
          answer: personInvolved != null ? personInvolved.persona_denunciante : null,
          answers: [
            { answer_id: 'N', answer: 'Natural' },
            { answer_id: 'J', answer: 'Jurídico' },
          ]
        },
        {
          question_id: "persona_victima",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: "V",
          question_type: "closed",
          question: "Persona Victima",
          answer: personInvolved != null ? personInvolved.persona_victima : null,
          answers: [
            { answer_id: 'I', answer: 'Individual' },
            { answer_id: 'C', answer: 'Colectivo' },
          ]
        },
        //no seguardan en bases de datos
        {
          question_id: "confidencial",
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
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
          answer: personInvolved != null ? personInvolved.nombre : null
        },
        {
          question_id: "apellido",
          required: 1,
          question_type: "open",
          question: "Apellido",
          answer: personInvolved != null ? personInvolved.apellido : null
        },
        {
          question_id: "id_cat_doc_persona",
          required: 1,
          question_type: "closed",
          question: "Doc. Presentado",
          answer: personInvolved != null ? personInvolved.id_cat_doc_persona : null,
          answers: personalDocuments
        },
        {
          question_id: "num_documento",
          required: 1,
          question_type: "open",
          question: "Núm. Documento",
          answer: personInvolved != null ? personInvolved.num_documento : null
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          question: "Fecha Nacimiento",
          answer: personInvolved != null ? personInvolved.fec_nacimiento : null
        },
        {
          question_id: "id_pais",
          enabled: 0,
          question_type: "closed",
          question: "Pais Nacimiento",
          answer: personInvolved != null ? personInvolved.id_pais : null,
          answers: country
        },
        {
          question_id: "sexo",
          required: 1,
          question_type: "closed",
          question: "Sexo",
          answer: personInvolved != null ? personInvolved.sexo : null,
          answers: [
            { answer_id: "H", answer: "Hombre" },
            { answer_id: "M", answer: "Mujer" }
          ]
        },
        {
          question_id: "lee",
          required: 1,
          question_type: "closed",
          question: "Saber Leer",
          answer: personInvolved != null ? personInvolved.lee : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "escribe",
          required: 1,
          question_type: "closed",
          question: "Saber Escribir",
          answer: personInvolved != null ? personInvolved.escribe : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "discapacidad",
          question_type: "closed",
          question: "Discapacidad",
          answer: personInvolved != null ? personInvolved.discapacidad : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_ori_sexual",
          required: 1,
          question_type: "closed_multiple",
          question: "Orientación Sexual",
          answer: personInvolved != null ? personInvolved.id_ori_sexual : null,
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: 1,
          question_type: "open",
          question: "Edad Aproximada",
          answer: personInvolved != null ? personInvolved.edad_aprox : null
        },
        {
          question_id: "id_cat_pro_oficio",
          required: 1,
          question_type: "closed_searchable_case_processing",
          question: "Ocupación",
          answer: personInvolved != null ? personInvolved.id_cat_pro_oficio : null,
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answer: personInvolved != null ? personInvolved.ide_genero : null,
          answers: [
            { answer_id: 'F', answer: 'Femenino' },
            { answer_id: 'M', answer: 'Masculino' },
            { answer_id: 'S', answer: 'Sin Respuesta' }
          ]
        },
        {
          question_id: "id_niv_academico",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "escribe",
          dependent_answer: "S",
          question_type: "closed",
          question: "Niv. Académico",
          answer: personInvolved != null ? personInvolved.id_niv_academico : null,
          answers: academicLevel
        },
        {
          question_id: "id_cat_tip_discapacidad",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "discapacidad",
          dependent_answer: "S",
          question_type: "closed",
          question: "Tipo de Discapacidad",
          answer: personInvolved != null ? personInvolved.id_cat_tip_discapacidad : null,
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
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_departamento) : null,
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          question: "Municipio",
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_municipio) : null,
          answers: municipality
        },
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: 1,
          question: "Tipo de Zona",
          answer: personInvolved != null ? personInvolved.zona_domicilio : null,
          answers: [
            { answer_id: 'R', answer: 'Rural' },
            { answer_id: 'U', answer: 'Urbano' },
            { answer_id: 'N', answer: 'No Definida' }
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
          answer: personInvolved != null ? personInvolved.domicilio : null
        },
        {
          question_id: "med_rec_notificacion",
          question_type: "closed_multiple",
          question: "Medio de Notificación",
          answer: personInvolved != null ? personInvolved.med_rec_notificacion : null,
          answers: [
            { answer_id: 'T', answer: 'Teléfono' },
            { answer_id: 'D', answer: 'Dirección que señala para notificar' },
            { answer_id: 'F', answer: 'Fax' },
            { answer_id: 'C', answer: 'Correo Electrónico' },
            { answer_id: 'P', answer: 'Pendiente' }
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
          question_id: "id_pais_ins_rep",
          question_type: "closed",
          question: "Nacionalidad de Institución",
          answers: []
        },
        {
          question_id: "id_cat_cal_actua",
          //required: 1,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answer: personInvolved != null ? personInvolved.id_cat_cal_actua : null,
          answers: qualityOperates
        }

      ]
    }


    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: personInvolved != null ? personInvolved.id_persona_temp : 0,
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

// FormById Actualizado
let getPersonInvolvedById = async (req, res) => {

  const { id_persona_temp } = req.params;

  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/getPersonInvolvedById" });

    var personInvolved = await db.query(`SELECT p.*, pc.confidencial, pc.aut_dat_den_vic, pc.tipo_persona  
    FROM tcdh_persona_temp AS p
    LEFT JOIN tcdh_per_rel_caso_temp AS pc ON pc.id_persona_temp = p.id_persona_temp 
    WHERE p.id_persona_temp = $1`, [id_persona_temp]);
    personInvolved = personInvolved.rows[0];

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var vulnerableGroupSelected = await db.query(`SELECT gt.id_grp_vulnerable::integer AS id_grp_vulnerable
    FROM tcdh_persona_temp AS p 
    INNER JOIN tcdh_grp_vul_temp AS gt 	   ON gt.id_per_rel = p.id_persona_temp
    INNER JOIN admi_grp_vulnerable AS gv   ON gv.id_grp_vulnerable = gt.id_grp_vulnerable
    WHERE gt.id_per_rel = $1`, [id_persona_temp]);
    vulnerableGroupSelected = vulnerableGroupSelected.rows[0];

    var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var sexualOrientationSelected = await db.query(`SELECT st.id_ori_sexual::integer AS id_ori_sexual
    FROM tcdh_persona_temp AS p 
    INNER JOIN tcdh_ori_sex_per_temp AS st ON st.id_persona_temp = p.id_persona_temp
    INNER JOIN admi_ori_sexual AS os 	   ON os.id_ori_sexual = st.id_ori_sexual
    WHERE st.id_persona_temp = $1`, [id_persona_temp]);
    sexualOrientationSelected = sexualOrientationSelected.rows[0];

    var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    notificationMeans = notificationMeans.rows;

    var typeDisability = await db.query(`SELECT id_cat_tip_discapacidad::integer AS answer_id, descripcion AS answer FROM admi_cat_tip_discapacidad WHERE est_reg = 'A'`);
    typeDisability = typeDisability.rows;

    var academicLevel = await db.query(`SELECT id_niv_academico::integer AS answer_id, descripcion AS answer FROM admi_niv_academico WHERE est_reg = 'A'`);
    academicLevel = academicLevel.rows;

    var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
    qualityOperates = qualityOperates.rows;

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows[0];

    var institutionCountry = await db.query('SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais');
    institutionCountry = institutionCountry.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    // let academicLevel = [];
    // let typeDisability = [];
    // let qualityOperates = [];

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
          answer: personInvolved != null ? personInvolved.tipo_rel_caso : null,
          answers: [
            { answer_id: 'D', answer: 'Denunciante' },
            { answer_id: 'V', answer: 'Victima' },
            { answer_id: 'A', answer: 'Denunciante/Victima' }
          ]
        },
        {
          question_id: "tipo_persona",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: "D",
          question_type: "closed",
          question: "Persona Denunciante",
          answer: personInvolved != null ? personInvolved.persona_denunciante : null,
          answers: [
            { answer_id: 'N', answer: 'Natural' },
            { answer_id: 'J', answer: 'Jurídico' },
          ]
        },
        {
          question_id: "persona_victima",
          required: 1,
          dependent: 1,
          dependent_section_id: 1,
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: "V",
          question_type: "closed",
          question: "Persona Victima",
          answer: personInvolved != null ? personInvolved.persona_victima : null,
          answers: [
            { answer_id: 'I', answer: 'Individual' },
            { answer_id: 'C', answer: 'Colectivo' },
          ]
        },
        //no seguardan en bases de datos
        {
          question_id: "confidencial",
          required: 1,
          required: 1,
          question_type: "closed",
          question: "Confidencial",
          answer: personInvolved != null ? personInvolved.confidencial : null,
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answer: personInvolved != null ? personInvolved.aut_dat_den_vic : null,
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
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
      section_title: "Información General de la persona",
      questions: [
        {
          question_id: "nombre",
          question_type: "open",
          question: "Nombre",
          answer: personInvolved != null ? personInvolved.nombre : null
        },
        {
          question_id: "apellido",
          question_type: "open",
          question: "Apellido",
          answer: personInvolved != null ? personInvolved.apellido : null
        },
        {
          question_id: "id_cat_doc_persona",
          required: 1,
          question_type: "closed",
          question: "Doc. Presentado",
          answer: personInvolved != null ? personInvolved.id_cat_doc_persona : null,
          answers: personalDocuments
        },
        {
          question_id: "num_documento",
          required: 1,
          question_type: "open",
          question: "Núm. Documento",
          answer: personInvolved != null ? personInvolved.num_documento : null
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          question: "Fecha Nacimiento",
          answer: personInvolved != null ? personInvolved.fec_nacimiento : null

        },
        {
          question_id: "id_pais",
          enabled: 0,
          question_type: "closed",
          question: "Pais Nacimiento",
          answer: personInvolved != null ? personInvolved.id_pais : null,
          answers: country
        },
        {
          question_id: "sexo",
          required: 1,
          question_type: "closed",
          question: "Sexo",
          answer: personInvolved != null ? personInvolved.sexo : null,
          answers: [
            { answer_id: "H", answer: "Hombre" },
            { answer_id: "M", answer: "Mujer" }
          ]
        },
        {
          question_id: "lee",
          required: 1,
          question_type: "closed",
          question: "Saber Leer",
          answer: personInvolved != null ? personInvolved.lee : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "escribe",
          required: 1,
          question_type: "closed",
          question: "Saber Escribir",
          answer: personInvolved != null ? personInvolved.escribe : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "discapacidad",
          question_type: "closed",
          question: "Discapacidad",
          answer: personInvolved != null ? personInvolved.discapacidad : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_ori_sexual",
          required: 1,
          question_type: "closed_multiple",
          question: "Orientación Sexual",
          answer: sexualOrientationSelected != undefined ? sexualOrientationSelected.id_ori_sexual : null,
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: 1,
          question_type: "open",
          question: "Edad Aproximada",
          answer: personInvolved != null ? personInvolved.edad_aprox : null
        },
        {
          question_id: "id_cat_pro_oficio",
          required: 1,
          question_type: "closed_searchable_case_processing",
          question: "Ocupación",
          answer: personInvolved != null ? personInvolved.id_cat_pro_oficio : null,
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answer: personInvolved != null ? personInvolved.ide_genero : null,
          answers: [
            { answer_id: 'F', answer: 'Femenino' },
            { answer_id: 'M', answer: 'Masculino' },
            { answer_id: 'S', answer: 'Sin Respuesta' }
          ]
        },
        {
          question_id: "id_niv_academico",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "escribe",
          dependent_answer: "S",
          question_type: "closed",
          question: "Niv. Académico",
          answer: personInvolved != null ? personInvolved.id_niv_academico : null,
          answers: academicLevel
        },
        {
          question_id: "id_cat_tip_discapacidad",
          required: 1,
          dependent: 1,
          dependent_section_id: 2,
          dependent_question_id: "discapacidad",
          dependent_answer: "S",
          question_type: "closed",
          question: "Tipo de Discapacidad",
          answer: personInvolved != null ? personInvolved.id_cat_tip_discapacidad : null,
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
          answer: personInvolved != null ? personInvolved.id_departamento : null,
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          question: "Municipio",
          answer: personInvolved != null ? personInvolved.id_municipio : null,
          answers: municipality
        },
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: 1,
          question: "Tipo de Zona",
          answer: personInvolved != null ? personInvolved.zona_domicilio : null,
          answers: [
            { answer_id: 'R', answer: 'Rural' },
            { answer_id: 'U', answer: 'Urbano' },
            { answer_id: 'N', answer: 'No Definida' }
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
          answer: personInvolved != null ? personInvolved.domicilio : null
        },
        {
          question_id: "med_rec_notificacion",
          question_type: "closed_multiple",
          question: "Medio de Notificación",
          answer: personInvolved != null ? personInvolved.med_rec_notificacion : null,
          answers: [
            { answer_id: 'T', answer: 'Teléfono' },
            { answer_id: 'D', answer: 'Dirección que señala para notificar' },
            { answer_id: 'F', answer: 'Fax' },
            { answer_id: 'C', answer: 'Correo Electrónico' },
            { answer_id: 'P', answer: 'Pendiente' }
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
          answer: vulnerableGroupSelected != undefined ? vulnerableGroupSelected.id_grp_vulnerable : null,
          answers: vulnerableGroup
        }
      ]
    };

    //Actualmente no se saba en que tabla se guardarán estos datos. 
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
          answer: personInvolved != null ? personInvolved.institucion : null
        },
        {
          question_id: "id_pais_ins_rep",
          question_type: "closed",
          question: "Nacionalidad de Institución",
          answer: personInvolved != null ? personInvolved.id_pais_ins_rep : null,
          answers: institutionCountry
        },
        {
          question_id: "id_cat_cal_actua",
          //required: 1,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answer: personInvolved != null ? personInvolved.id_cat_cal_actua : null,
          answers: qualityOperates
        }

      ]
    }


    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: personInvolved != null ? personInvolved.id_persona_temp : null,
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

// Update Involved Actualizado
let updatePersonInvolvedForm = async (req, res) => {
  const { id_persona_temp } = req.params;
  const { tipo_rel_caso, tipo_persona, persona_victima, per_den_es_victima, per_principal, confidencial, aut_dat_den_vic, nombre, apellido, id_cat_cal_actua,
    sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio,
    discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, id_grp_vulnerable, id_ori_sexual, institucion } = req.body;

  try {

    let professionPerson = await db.query(`SELECT id_cat_pro_oficio, descripcion
    FROM admi_cat_pro_oficio WHERE descripcion like '%${id_cat_pro_oficio}'`);
    professionPerson = professionPerson.rows[0];

    console.log('-------------- UPDATE Profesion ---------------');
    console.log(professionPerson.id_cat_pro_oficio, ' ', professionPerson.descripcion);
    console.log('-----------------------------');

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar a la persona involucrada.", instance: "case-processing/updatePersonInvolvedForm" });

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    let nom_completo = nombre + ' ' + apellido;

    let fec_nacimiento_nueva;
    if (fec_nacimiento == null || fec_nacimiento == "" || fec_nacimiento == undefined) {
      fec_nacimiento_nueva = dateFormat(fec_nacimiento, 'yyyy-mm-dd');
    } else {
      fec_nacimiento_nueva = fec_nacimiento;
    }

    var cod_user = req.user.user_id;
    var user_name = req.user.name;


    await db.query(`UPDATE tcdh_persona_temp
    SET per_den_es_victima=$1, per_principal=$2, nombre=$3, apellido=$4, id_cat_cal_actua=$5, nom_completo=$6, sexo=$7, ide_genero=$8, 
    lee=$9, escribe=$10, id_cat_doc_persona=$11, otro_doc_identidad=$12, num_documento=$13, id_niv_academico=$14, id_pais_nacimiento=$15, 
    id_pais_ins_rep=$16, fec_nacimiento=$17, edad_aprox=$18, id_cat_pro_oficio=$19, zona_domicilio=$20, id_departamento=$21, id_municipio=$22, 
    domicilio=$23, discapacidad=$24, id_cat_tip_discapacidad=$25, med_rec_notificacion=$26, cod_usu_mod=$27, usu_mod_reg=$28, fec_mod_reg=$29, 
    tipo_rel_caso=$30, persona_denunciante=$31, persona_victima=$32, institucion=$33 
    WHERE id_persona_temp = $34 RETURNING*`, [per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero,
      lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento, id_pais_ins_rep,
      fec_nacimiento_nueva, edad_aprox, professionPerson.id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio, discapacidad,
      id_cat_tip_discapacidad, med_rec_notificacion, cod_user, user_name, registration_date, tipo_rel_caso, tipo_persona,
      persona_victima, institucion, id_persona_temp], async (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var personInvolved = results.rows[0];

          db.query(`UPDATE tcdh_per_rel_caso_temp
        SET relacion=$1, tipo_persona=$2, cod_usu_mod=$3, usu_mod_reg=$4, fec_mod_reg=$5, confidencial=$6, aut_dat_den_vic=$7
        WHERE id_persona_temp=$8`,
            [personInvolved.tipo_rel_caso, tipo_persona, cod_user, user_name, registration_date, confidencial, aut_dat_den_vic, id_persona_temp]);

          db.query(`UPDATE tcdh_grp_vul_temp
        SET id_grp_vulnerable=$1, migrado=$2, cod_usu_mod=$3, usu_mod_reg=$4, fec_mod_reg=$5 
        WHERE id_per_rel = $6`, [id_grp_vulnerable, 'N', cod_user, user_name, registration_date, id_persona_temp]);

          await db.query(`UPDATE tcdh_ori_sex_per_temp
        SET id_ori_sexual=$1, cod_usu_mod=$2, usu_mod_reg=$3, fec_mod_reg=$4
        WHERE id_persona_temp= $5`, [id_ori_sexual, cod_user, user_name, registration_date, id_persona_temp]);

          return res.status(201).json({
            personInvolved
          });

        }
      });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updatePersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let deletePersonInvolved = async (req, res) => {
  const { id_persona_temp } = req.params;
  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al eliminar la persona involucrada.", instance: "case-processing/deletePersonInvolved" });
    await db.query(`UPDATE tcdh_persona_temp SET est_reg = 'E' WHERE id_persona_temp = $1`, [id_persona_temp], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
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

//Enviar a SIGI
let sentCaseToSigi = async (req, res) => {
  const { id_caso_temp } = req.params

  console.log('------------------------------------');
  console.log('Params', id_caso_temp);
  console.log('------------------------------------');

  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al enviar el caso al SIGI.", instance: "case-processing/sentCaseToSigi" });

    db.query(`UPDATE variable SET oldidcasotemp = $1 WHERE id_variable = 1`, [id_caso_temp]);

    await db.query(`SELECT * FROM bussat()`, (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {

        return res.status(200).json({
          message: 'Caso enviado al sigi'
        });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'sentCaseToSigi', error, true, req, res);
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
  getInvolvedFormList,
  sentCaseToSigi,
  getFormVersion,
  getInvolverFormVersion
}