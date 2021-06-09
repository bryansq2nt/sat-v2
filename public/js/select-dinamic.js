$(document).ready(function () {
    $('#id_tema').on('change', function () {
        var id_tema = $(this).children("option:selected").val();
        if ($.trim(id_tema) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/topic/subtopic/' + id_tema + '/list',
                success: function (result) {

                    $('#id_subtema').empty();
                    var value = Object.values(result.subtopics);
                    if (Object.values(result.subtopics).length == 0) {
                        $('#id_subtema').append("<option value =''>Ningún dato encontrado</option>");
                    } else {
                        $('#id_subtema').append("<option value =''>Desplegar sub-temas</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_subtema').append("<option value='" + value[i].id_subtema + "'>" + value[i].nombre_subtema + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_subtema').empty();
            $('#id_situacion_conflictiva').empty();
            $('#id_subtema').append("<option value =''>Seleccionar un tema</option>");
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_subtema').on('change', function () {
        var id_subtema = $(this).children("option:selected").val();
        if ($.trim(id_subtema) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/subtopic/situation/' + id_subtema + '/list',
                success: function (result) {

                    $('#id_situacion_conflictiva').empty();
                    var value = Object.values(result.situations);
                    if (Object.values(result.situations).length == 0) {
                        $('#id_situacion_conflictiva').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            $('#id_situacion_conflictiva').append("<option value='" + value[i].id_situacion_conflictiva + "'>" + value[i].nombre_sit_conflictiva + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_situacion_conflictiva').empty();
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_tema').on('change', function () {

        $('#id_situacion_conflictiva').empty();
        $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");

    });
});