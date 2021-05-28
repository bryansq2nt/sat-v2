
-- estado: <0>:INACTIVO  <1>: ACTIVO  
CREATE SEQUENCE seq_sat_modulos_id_modulo_app;
CREATE TABLE sat_modulos (
    id_modulo NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_modulos_id_modulo_app'),
    nombre_modulo VARCHAR (30) NOT NULL,
    tipo_modulo NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_modulos_pkey PRIMARY KEY (id_modulo)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO  
CREATE SEQUENCE seq_sat_banner_id_banner;
CREATE TABLE sat_banner (
    id_banner NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_banner_id_banner'),
    titulo_banner VARCHAR (50) NOT NULL,
    descripcion TEXT,
    url VARCHAR,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_banner_pkey PRIMARY KEY (id_banner)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_fuente_id_fuente;
CREATE TABLE sat_fuente(
    id_fuente NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_fuente_id_fuente'),
    nombre_fuente VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_fuente_pkey PRIMARY KEY (id_fuente)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_fuente_id_tipo_fuente;
CREATE TABLE sat_tipo_fuente(
    id_tipo_fuente NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_tipo_fuente_id_tipo_fuente'),
    nombre_tipo_fuente VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_fuente_pkey PRIMARY KEY (id_tipo_fuente)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_escenario_id_escenario;
CREATE TABLE sat_escenario(
    id_escenario NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_escenario_id_escenario'),
    nombre_escenario VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_escenario_pkey PRIMARY KEY (id_escenario)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_fase_conflicto_id_fase_conflicto;
CREATE TABLE sat_fase_conflicto (
    id_fase_conflicto NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_fase_conflicto_id_fase_conflicto'),
    nombre_fase VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_fase_conflicto_pkey PRIMARY KEY (id_fase_conflicto)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_rol_app_id_rol;
CREATE TABLE sat_rol_app (
    id_rol NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_rol_app_id_rol'), 
    nombre_rol VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_rol_app_pkey PRIMARY KEY (id_rol)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_rol_app_permisos_id_rol_permisos;
CREATE TABLE sat_rol_app_permisos (
    id_rol_permisos NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_rol_app_permisos_id_rol_permisos'), 
    nombre_permiso VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_rol_app_permisos_pkey PRIMARY KEY (id_rol_permisos)
);

-- ******** NUEVA
-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_accesos_usuario;
CREATE TABLE sat_accesos_usuario
(
    id_acceso_usuario numeric(2,0) NOT NULL DEFAULT nextval('seq_sat_accesos_usuario'),
    id_usuario numeric(2,0) NOT NULL,
    permiso_acceso_app numeric(2) NOT NULL DEFAULT 1,
    permiso_acceso_web numeric(2) NOT NULL DEFAULT 2,
    id_rol_permisos numeric(2) NOT NULL DEFAULT 0,
    fecha_ing_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing numeric(2,0) NOT NULL,
    cod_usu_mod numeric(2,0) NOT NULL,
    estado numeric(2,0) NOT NULL DEFAULT 1,
    CONSTRAINT sat_accesos_usuario_pkey PRIMARY KEY (id_acceso_usuario)
);

-- ******** NUEVA
-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_permisos_modulos_usuario;
CREATE TABLE sat_permisos_modulos_usuario
(
    id_permiso_modulo numeric(2,0) NOT NULL DEFAULT nextval('seq_sat_permisos_modulos_usuario'),
    id_usuario numeric(2,0) NOT NULL,
    id_modulo numeric(2,0) NOT NULL,
    fecha_ing_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing numeric(2,0) NOT NULL,
    cod_usu_mod numeric(2,0) NOT NULL,
    estado numeric(2,0) NOT NULL DEFAULT 1,
    CONSTRAINT sat_pemisos_modulos_usuario_pkey PRIMARY KEY (id_permiso_modulo)
);

CREATE SEQUENCE seq_sat_seguridad_token_id_seguridad_token;
CREATE TABLE sat_seguridad_token (
    id_seguridad_token NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_seguridad_token_id_seguridad_token'),
    id_usuario NUMERIC(2) NOT NULL, 
    token VARCHAR NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    CONSTRAINT sat_seguridad_token_pkey PRIMARY KEY (id_seguridad_token),
    CONSTRAINT sat_seguridad_token_id_usuario_fkey FOREIGN KEY (id_usuario) 
    REFERENCES segd_usuario (id_usuario)
	ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_accion_pddh_id_accion_pddh;
CREATE TABLE sat_accion_pddh (
    id_accion_pddh NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_accion_pddh_id_accion_pddh'),
    nombre_accion VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_accion_pddh_pkey PRIMARY KEY (id_accion_pddh)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_alerta_id_tipo_alerta;
CREATE TABLE sat_tipo_alerta (
    id_tipo_alerta NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_tipo_alerta_id_tipo_alerta'),   
    nombre_alerta VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_alerta_pkey PRIMARY KEY (id_tipo_alerta)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_agresion_id_agresion;
CREATE TABLE sat_tipo_agresion (
    id_tipo_agresion NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_tipo_agresion_id_agresion'),   
    nombre_agresion VARCHAR(100) NOT NULL,
    ponderacion NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_agresion_pkey PRIMARY KEY (id_agresion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_situacion_actual_conflicto_id_situacion_conflicto;
CREATE TABLE sat_situacion_actual_conflicto (
    id_situacion_conflicto NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_situacion_actual_conflicto_id_situacion_conflicto'),   
    nombre_conflicto VARCHAR(250) NOT NULL,
    ponderacion NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_situacion_actual_conflicto_pkey PRIMARY KEY (id_situacion_conflicto)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_notificacion_id_notificacion;
CREATE TABLE sat_notificacion(
    id_notificacion NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_notificacion_id_notificacion'), 
    nombre_notificacion VARCHAR(30) NOT NULL,
    id_usuario NUMERIC(2) NOT NULL,
    mensaje TEXT NOT NULL, 
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_notificacion_pkey PRIMARY KEY (id_notificacion),
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_verificaciones_id_est_verificacion;
CREATE TABLE sat_est_verificaciones(
    id_est_verificacion NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_est_verificaciones_id_est_verificacion'),
    id_departamento NUMERIC(2) NOT NULL,
    id_municipio NUMERIC(2) NOT NULL,
    id_autoridad NUMERIC(2) NOT NULL,
    edad NUMERIC(2) NOT NULL,
    id_genero NUMERIC(2) NULL,
    poblacion_afectada NUMERIC(5) NOT NULL,
    CONSTRAINT sat_est_verificaciones_pkey PRIMARY KEY (id_est_verificacion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_acciones_inm_id_est_acciones;
CREATE TABLE sat_est_acciones_inm(
    id_est_acciones NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_est_acciones_inm_id_est_acciones'),
    id_departamento NUMERIC(2) NOT NULL,
    id_municipio NUMERIC(2) NOT NULL,
    id_autoridad NUMERIC(2) NOT NULL,
    edad NUMERIC(2) NOT NULL,
    id_genero NUMERIC(2) NULL,
    CONSTRAINT sat_est_acciones_inm_pkey PRIMARY KEY (id_est_acciones)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_expedientes_id_est_expediente;
CREATE TABLE sat_est_expedientes(
    id_est_expediente NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_est_expedientes_id_est_expediente'),
    id_departamento NUMERIC(2) NOT NULL,
    id_municipio NUMERIC(2) NOT NULL,
    id_autoridad NUMERIC(2) NOT NULL,
    edad NUMERIC(2) NOT NULL,
    id_genero NUMERIC(2) NULL,
    CONSTRAINT sat_est_expedientes_pkey PRIMARY KEY (id_est_expediente)
); 


--------***********************************************************************

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_zonas_id_zona;
CREATE TABLE sat_zonas(
    id_zona NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_zonas_id_zona'),
    nombre_zona VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_zonas_pkey PRIMARY KEY (id_zona)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_entrada_id_zona;
CREATE TABLE sat_tipo_entrada(
    id_entrada NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_tipo_entrada_id_zona'),
    nombre_entrada VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_entrada_pkey PRIMARY KEY (id_entrada)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_sexo_id_sexo;
CREATE TABLE sat_sexo(
    id_sexo NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_sexo_id_sexo'),
    nombre_sexo VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_sexo_pkey PRIMARY KEY (id_sexo)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_genero_id_genero;
CREATE TABLE sat_genero(
    id_genero NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_genero_id_genero'),
    nombre_genero VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_genero_pkey PRIMARY KEY (id_genero)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_poblacion_id_poblacion;
CREATE TABLE sat_tipo_poblacion(
    id_poblacion NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_tipo_poblacion_id_poblacion'),
    nombre_poblacion VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_poblacion_pkey PRIMARY KEY (id_poblacion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_calidad_clasificacion_crisis_id_calidad_crisis;
CREATE TABLE sat_calidad_clasificacion_crisis(
    id_calidad_crisis NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_calidad_clasificacion_crisis_id_calidad_crisis'),
    nombre_calidad_crisis VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_calidad_clasificacion_crisis_pkey PRIMARY KEY (id_calidad_crisis)
);

--sat_calidad_clasificacion_participa
CREATE SEQUENCE seq_sat_calidad_clasificacion_participa_id_calidad_participa;
CREATE TABLE sat_calidad_clasificacion_participa(
    id_calidad_participa NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_calidad_clasificacion_crisis_id_calidad_crisis'),
    nombre_calidad_participa VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_calidad_clasificacion_participa_pkey PRIMARY KEY (id_calidad_participa)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_unidad_administrativa_id_unidad_administrativa;
CREATE TABLE sat_unidad_administrativa(
    id_unidad_administrativa NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_unidad_administrativa_id_unidad_administrativa'),
    nombre_unidad VARCHAR(80) NOT NULL,
    correo_prinicipal VARCHAR(80) NOT NULL,
    correo_secundario VARCHAR(50) NULL,
    correo_tercero VARCHAR(50) NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_unidad_administrativa_pkey PRIMARY KEY (id_unidad_administrativa)
);

--------***********************************************************************
DROP TABLE sat_alerta_temprana;
CREATE SEQUENCE seq_sat_alerta_temprana_id_alerta_temprana;
CREATE TABLE sat_alerta_temprana (
    id_alerta_temprana NUMERIC(2) NOT NULL DEFAULT nextval('seq_sat_alerta_temprana_id_alerta_temprana'),
    id_tipo_fuente NUMERIC(2) NOT NULL,  
    id_fuente NUMERIC(2) NOT NULL,       
    titulo_noticia VARCHAR (80) NOT NULL,
    nombre_medio_prensa VARCHAR(50),
    paginas_prensa VARCHAR(50),
    autor_prensa VARCHAR(70) NOT NULL,
    fecha_publicacion_prensa TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fotografia_prensa VARCHAR(100),
    nombre_medio_radio VARCHAR(70),
    canal_radio VARCHAR(50),
    nombre_programa_radio VARCHAR(50),
    fecha_emision_radio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    titulo_redes VARCHAR(70) NOT NULL,
    nombre_red_social VARCHAR(50),
    url_red_social VARCHAR(150) ,
    fecha_pub_red_social TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pantalla_red_social VARCHAR(100),
    nombre_colectivo VARCHAR(50),
    nombre_contacto_colectivo VARCHAR(50),
    telefono_colectivo VARCHAR(50),
    nombre_organismo VARCHAR(50) NOT NULL,
    nombre_contacto_organismo VARCHAR(50) NOT NULL,
    correo_organismo VARCHAR(80) NOT NULL,
    telefono_organismo VARCHAR(50) NOT NULL,
    datos_organismo VARCHAR(250) NOT NULL,
    nombre_mensajeria VARCHAR(50),
    nombre_contacto_mensajeria VARCHAR(50),
    contacto_mensajeria VARCHAR(50),
    datos_mensajeria VARCHAR(250),
    fotografia_mensajeria VARCHAR(100),
    --
    nombre_inst_gub VARCHAR(70) NOT NULL,
    contacto_inst_gub VARCHAR(50) NOT NULL,
    correo_inst_gub VARCHAR(70) NOT NULL,
    telefono_inst_gub VARCHAR(50) NOT NULL,
    datos_inst_gub VARCHAR(150) NOT NULL,
    --
    otras_detalle VARCHAR(50),
    otras_adicionales VARCHAR(250),
    fecha_hechos TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_futura_hechos TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_reporte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_pais NUMERIC(2),       -- BUSCAR TABLA LLAVE FORANEA 
    id_departamento NUMERIC(2) NOT NULL, -- BUSCAR TABLA LLAVE FORANEA 
    id_municipio NUMERIC(2) NOT NULL, -- BUSCAR TABLA LLAVE FORANEA 
    id_tipo_zona NUMERIC(2) NOT NULL,  -- BUSCAR TABLA LLAVE FORANEA 
    descripcion_hechos TEXT NOT NULL,  
    id_derecho NUMERIC(2), -- BUSCAR TABLA LLAVE FORANEA
    id_escenario NUMERIC(2) NOT NULL, -- BUSCAR TABLA LLAVE FORANEA
    id_tematica_relacionada NUMERIC(2), -- BUSCAR TABLA LLAVE FORANEA
    id_sub_tematica NUMERIC(2), -- BUSCAR TABLA LLAVE FORANEA
    antecedentes_hecho TEXT,
    poblacion_afectada VARCHAR(50),
    contraparte VARCHAR(50),
    perfil_actor VARCHAR(50),
    id_grupo_vulnerable NUMERIC(2) NOT NULL, -- BUSCAR TABLA LLAVE FORANEA
    demanda_solicitud TEXT,
    postura_autoridades TEXT,
    poblacion_ninos NUMERIC(2) NOT NULL,
    poblacion_ninas NUMERIC(2) NOT NULL,
    adolecentes_mujeres NUMERIC(2),
    adolecentes_hombres NUMERIC(2),
    poblacion_hombres NUMERIC(2), 
    poblacion_mujeres NUMERIC(2),
    poblacion_hombre_mayor NUMERIC(2),
    poblacion_mujer_mayor NUMERIC(2), 
    cantidad_aproximada NUMERIC(5),
    --
    id_tipo_agresion NUMERIC(2) NOT NULL,
    dialogo_conflicto NUMERIC(1) NOT NULL,
    medida_conflicto NUMERIC(1) NOT NULL,
    dialogo_roto_conflicto NUMERIC(1) NOT NULL,
    crisis_conflicto NUMERIC(1) NOT NULL,
    id_fase_conflicto NUMERIC(2) NOT NULL, 
    cant_persona_involucrada NUMERIC(2) NOT NULL,
    --
    id_tipo_alerta NUMERIC(2), -- BUSCAR TABLA LLAVE FORANEA 
    id_accion_pddh INT, -- BUSCAR TABLA LLAVE FORANEA 
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2) NOT NULL,
    cod_usu_mod NUMERIC(2) NOT NULL,
    estado_modulo NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_alerta_temprana_pkey PRIMARY KEY (id_alerta_temprana)
);

-------------------------------------------------------------------------------------

DROP TABLE sat_atencion_crisis;
CREATE SEQUENCE sat_atencion_crisis_id_atencion_crisis;
CREATE TABLE sat_atencion_crisis(
    id_atencion_crisis NUMERIC(2) NOT NULL DEFAULT nextval('sat_atencion_crisis_id_atencion_crisis'),
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    id_situacion_atendible NUMERIC(2),
    id_tipo_via_entrada NUMERIC(2),
    via_entrada VARCHAR(70),
    id_calidad_crisis NUMERIC(2),
    id_naturaleza NUMERIC(2),   
    participante_nombre VARCHAR(50),
    participante_dependencia VARCHAR(50), 
    participante_nivel VARCHAR(50),
    id_participante_nivel NUMERIC(2), 
    nombre_solicitante VARCHAR(50) NOT NULL,
    id_documento_solicitante INT NOT NULL, 
    fecha_nacimiento date,
    edad NUMERIC(2) NOT NULL DEFAULT 0,
    id_sexo_solicitante NUMERIC(2),
    id_genero_solicitante NUMERIC(2), 
    id_orientacion_solicitante NUMERIC(2),
    id_ocupacion NUMERIC(2) NOT NULL, 
    id_grupo_vulnerabilidad NUMERIC(2),     
    id_zona_domicilio NUMERIC(2), 
    id_departamento NUMERIC(2),  
    id_municipio NUMERIC(2),   
    direccion VARCHAR(50),
    id_otr_med_notificacion NUMERIC(2),
    medio_notificacion_solicitante VARCHAR(50),
    detalle_persona VARCHAR(150),
    fuente_informacion VARCHAR(50),
    fecha_informacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_emision  VARCHAR(50),
    fecha_recepción TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_referencia_emision NUMERIC(2),
    poblacion_ninos NUMERIC(2),
    poblacion_ninas NUMERIC(2),
    poblacion_hombres NUMERIC(2), 
    poblacion_mujeres NUMERIC(2),
    poblacion_hombre_mayor NUMERIC(2),
    poblacion_mujer_mayor NUMERIC(2),
    id_poblacion NUMERIC(2),
    cantidad_aproximada NUMERIC(5),
    sector_poblacion_afectada VARCHAR(50),
    nombre_notificacion_medio VARCHAR(50), 
    resumen_hecho TEXT,
    id_calificacion NUMERIC(2), 
    nombre_funcionario VARCHAR(50), 
    cargo VARCHAR(50),
    nombre_otros VARCHAR(50), 
    institucion_otros VARCHAR(50), 
    cargo_otros VARCHAR(50), 
    id_calificacion_otros NUMERIC(2),  
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2),
    cod_usu_mod NUMERIC(2),
    estado_modulo NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_atencion_crisis_pkey PRIMARY KEY (id_atencion_crisis)
);

-- Tabla sincronizada con el formulario
CREATE TABLE sat_atencion_crisis(
    id_atencion_crisis NUMERIC(2) NOT NULL DEFAULT nextval('sat_atencion_crisis_id_atencion_crisis'),
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    --id_situacion_atendible NUMERIC(2),
    id_tipo_via_entrada NUMERIC(2),
    via_entrada VARCHAR(70),
    id_calidad_crisis NUMERIC(2),
    id_naturaleza NUMERIC(2),   
    participante_nombre VARCHAR(50),
    participante_dependencia VARCHAR(50), 
    participante_nivel VARCHAR(50),
    --id_participante_nivel NUMERIC(2), 
    nombre_solicitante VARCHAR(50) NOT NULL,
    id_documento_solicitante INT NOT NULL, 
    fecha_nacimiento date,
    edad NUMERIC(2) NOT NULL DEFAULT 0,
    id_sexo_solicitante NUMERIC(2),
    id_genero_solicitante NUMERIC(2), 
    id_orientacion_solicitante NUMERIC(2),
    id_ocupacion NUMERIC(2) NOT NULL, 
    id_grupo_vulnerabilidad NUMERIC(2),     
    id_zona_domicilio NUMERIC(2), 
    id_departamento NUMERIC(2),  
    id_municipio NUMERIC(2),   
    direccion VARCHAR(50),
    id_otr_med_notificacion NUMERIC(2),
    --medio_notificacion_solicitante VARCHAR(50),
    detalle_persona VARCHAR(150),
    fuente_informacion VARCHAR(50),
    fecha_informacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_emision  VARCHAR(50),
    fecha_recepción TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    --id_referencia_emision NUMERIC(2),
    --poblacion_ninos NUMERIC(2),
    --poblacion_ninas NUMERIC(2),
    --poblacion_hombres NUMERIC(2), 
    --poblacion_mujeres NUMERIC(2),
    --poblacion_hombre_mayor NUMERIC(2),
    --poblacion_mujer_mayor NUMERIC(2),
    id_poblacion NUMERIC(2),
    cantidad_aproximada NUMERIC(5),
    sector_poblacion_afectada VARCHAR(50),
    --CREAR ESTE CAMPO
    grupo_vulnerabilidad VARCHAR(150),
    --
    nombre_notificacion_medio VARCHAR(50), 
    resumen_hecho TEXT,
    id_calificacion NUMERIC(2), 
    nombre_funcionario VARCHAR(50), 
    cargo VARCHAR(50),
    nombre_otros VARCHAR(50), 
    institucion_otros VARCHAR(50), 
    cargo_otros VARCHAR(50), 
    id_calificacion_otros NUMERIC(2), 
    id_accion_pddh NUMERIC(2),
    analisis TEXT,
    id_unidad_administrativa NUMERIC(2), 
    texto_mensaje TEXT,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC(2),
    cod_usu_mod NUMERIC(2),
    estado_modulo NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_atencion_crisis_pkey PRIMARY KEY (id_atencion_crisis)
);




