


$(document).on('click', "#sim", function () {
    cont = 0;
    var id_enquete = $(this).attr("id")
    var $this = $(this);
    $("#sim").html("Aguarde...");
    $("#msg").css('display','block');
        $("#msg-" + id_enquete).html("<img src='../img/loading.gif' align='absmiddle'> Realizado voto, aguarde...");
        $.ajax({
            type: "POST",
            url: "registrar-voto-enquete.php",
            data: {
                fIdEnquete: id_enquete,
                fIdAlternativa: id_alternativa
            },
            success: function (result) {
              
                    $("#msg").html("Voto cadastrado com sucesso!<br/>")
                  
                }
            }
        })
    
});