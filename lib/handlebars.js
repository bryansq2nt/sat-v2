var moment = require('moment');
moment.locale('es');
moment.defaultFormat = "DD/MM/YYYY";

module.exports = {

    stateDetails: function (has_details, options) {
        if (has_details == 1) {
            return 'Activo';
        }
        else if (has_details == 0) {
            return 'Inactivo';
        }
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
    }

}