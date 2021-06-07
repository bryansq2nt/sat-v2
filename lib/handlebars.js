var moment = require('moment');

moment.locale('es');
moment.defaultFormat = "DD/MM/YYYY";

module.exports = {
    ifeq: function (a, b, options) {

        if (a === b) {

            return options.fn(this);
        }
        return options.inverse(this);
    },
    contains: function (value, array, options) {

        array = (array instanceof Array) ? array : [array];

        if (array.includes(value)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    containsTwo: function (value1, value2, array, options) {

        array = (array instanceof Array) ? array : [array];

        if (array.includes(value1)) {
            return options.fn(this);
        } else if (array.includes(value2)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    containsFour: function (value1, value2, value3, value4, array, options) {

        array = (array instanceof Array) ? array : [array];

        if (array.includes(value1)) {
            return options.fn(this);
        } else if (array.includes(value2)) {
            return options.fn(this);
        } else if (array.includes(value3)) {
            return options.fn(this);
        } else if (array.includes(value4)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    timeago: function (timestamp) {
        return moment(timestamp).format();

    },
    datenotification: function (date) {
        return moment(date).format('LLLL');

    },
    dateAppointment: function (date) {
        return moment(date).format('L');
    },
    inc: function (value1, value2, options) {
        value1++;

        var id = value1 + (8 * (value2 - 1));
        return parseInt(id);

    },

    elementshasta: function (value1, value2, value3, options) {

        var elements = value1 + (8 * (value2 - 1));
        if (elements > value3) {
            return parseInt(value3);
        }
        return parseInt(elements);

    },

    elementsdesde: function (value1, value2, value3, options) {

        var elements = value1 + (8 * (value2 - 1)) - 7;

        return parseInt(elements);

    },
    ifmayorque: function (value1, value2, options) {

        if (value1 > value2) {

            return options.fn(this);
        }
        return options.inverse(this);

    },

    getSelected: function (value1, value2, options) {
        if (value1 == value2) {
            return `selected`;
        }
    },



    showSexo: function (sexo, options) {
        if (sexo == 'M') {
            return 'Masculino';
        }
        else {
            return 'Femenino';
        }
    },

    AgeBirhtday: function(birthday){
        return moment().diff(birthday, 'years');
    },

    Name: function (name_employee, options) {
        if (name_employee != ' ') {
            return name_employee;
        }
        else {
            return 'Disponible en Local';
        }
    },


    weekday: function (day, options) {
        if (day == 1) {
            return 'Lunes';
        }
        else if (day == 2) {
            return 'Martes';
        }
        else if (day == 3) {
            return 'Mi&eacute;rcoles';
        }
        else if (day == 4) {
            return 'Jueves';
        }
        else if (day == 5) {
            return 'Viernes';
        }
        else if (day == 6) {
            return 'S&aacute;bado';
        }
        else if (day == 0) {
            return 'Domingo';
        }
    },

    
    reportsName: function (day, options) {
        if (day == 1) {
            return 'Listado de clientes';
        }
        else if (day == 2) {
            return 'Servicios por cliente';
        }
        else if (day == 3) {
            return 'Servicios m&aacutes demandados';
        }
        else if (day == 4) {
            return 'Registro de reservas';
        }
        else if (day == 5) {
            return 'Servicios por empleado';
        }
        else if (day == 6) {
            return 'Flujo';
        }
        else if (day == 7) {
            return 'Flujo por cliente';
        }
        else if (day == 8) {
            return 'Flujo por empleado';
        } 
        else if (day == 9) {
            return 'Integral reservalo';
        } 
        else if (day == 10) {
            return 'Integral';
        }
    },

    status: function (status, options) {
        if (status == 1) {
            return 'Solicitada';
        }
        else if (status == 2) {
            return 'Aprobado';
        }
        else if (status == 3) {
            return 'Completado';
        }
        else if (status == 4) {
            return 'Cancelado';
        }

    },

    
    stateDetails: function (estado, options) {
        if (estado == 1) {
            return 'Activo';
        } else {
            return 'Inactivo';
        }
    },

    statusboton: function (status, options) {
        if (status == 1) {
            return 'warning';
        }
        else if (status == 2) {
            return 'success';
        }
        else if (status == 3) {
            return 'info';
        }
        else if (status == 4) {
            return 'danger';
        }

    },

    RolUser: function (is_manager, options) {
        if (is_manager == 1) {
            return 'Administrador';
        }
        else if (is_manager == 0) {
            return 'Empleado';
        }
    },

    state: function (active, options) {
        if (active == 0) {
            return 'No Disponible';
        }
        else if (active == 1) {
            return 'Disponible';
        }
    },

    stateBranch: function (custom_appointment_notes, options) {
        if (custom_appointment_notes == 1) {
            return 'Habilitado';
        }
        else if (custom_appointment_notes == 0) {
            return 'Deshabilitado';
        }
    },

    stateDetails: function (has_details, options) {
        if (has_details == 1) {
            return 'Activo';
        }
        else if (has_details == 0) {
            return 'Inactivo';
        }
    },

    stateBranchII: function (select_employee, options) {
        if (select_employee == 1) {
            return 'Habilitado';
        }
        else if (select_employee == 0) {
            return 'Deshabilitado';
        }
    },

    type_question: function (question_type, options) {
        if (question_type == 0) {
            return 'Abierta';
        }
        else if (question_type == 1) {
            return 'Numérica';
        }
        else if (question_type == 2) {
            return 'Cerrada';
        }
        
    },

    userVerfication: function (est_reg, options) {

        if (est_reg == 'A') {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    HoursMinutes: function (service_time) {
        //return moment(service_time, "hmm").format("HH:mm"); 
        return moment.utc(service_time*3600*1000).format('HH:mm')   
    },

    featuredNotNull: function (featured_picture, options) {
  
        if (featured_picture != null && featured_picture != undefined) {
            return options.fn(this);
        }else{
            return options.inverse(this);
        }

    },

    landscapeNotNull: function (landscape_picture, options) {

        if (landscape_picture != null && landscape_picture != undefined) {
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    pictureNotNull: function (picture_1, options) {

        if (picture_1 != null && picture_1 != undefined) {
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    ShowButton: function (id_banner, options){
        if(id_banner == undefined){
            return options.fn(this);
        }
    },

    s3 : function (path){
        return `${process.env.AWS_S3_HOST}${path}`;
    },

    Authorization: function (id_usuario, options){
        if(id_usuario == undefined){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    showFormElements: function (value, options){
        if(value == 1){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    showFormElementsShowModife: function(value,options){
        if(value == 1){
            return 'checked';
        }else if(value == 2){
            return 'checked';
        }else{
            return '';
        }
    },

    showFormElementsSiderbar: function (value, options){
        if(value != 1){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    // Ejemplo de usuario administrador    
    isAdmin: function (id_perfil, options) {
        if(id_perfil == 1){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },

    siderbardOptionsAdministracion: function(administration, options){
        if(administration != 0){
            return options.fn(this);
        }
    },

    siderbardOptionsCatalogos: function(catalogos, options){
        if(catalogos != 0){
            return options.fn(this);
        } 
    },

    siderbardOptionsDashboard: function(dashboard, options){
        if(dashboard != 0 ){
            return options.fn(this);
        }
    },

    userVerfication: function (est_reg, options) {

        if (est_reg == 'A') {
            return options.fn(this);
        }

        return options.inverse(this);
    },

}