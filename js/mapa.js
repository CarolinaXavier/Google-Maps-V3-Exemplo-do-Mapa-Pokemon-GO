var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];
//aqui controi somente o mapa simples
function initialize() {
	var latlng = new google.maps.LatLng(-1.4557549, -48.4901799);

    var options = {
        zoom: 15,
		center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);


}

initialize();

function abrirInfoBox(id, marker) {
	if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
		infoBox[idInfoBoxAberto].close();
	}

	infoBox[id].open(map, marker);
	idInfoBoxAberto = id;
}

function showMarkers() {

        console.log("chamando show markers");
        //recupero via ajax meu arquivo json com os pontos que vou precisar para montar os markes do maps
        var aurl = 'http://localhost/js/json/geral.json';
        $.ajax({
            type: "GET",
            url: aurl,
            dataType: "json",
            success: function (data) {


            	//se arquivo for diferente de vazio
                if (data.length !== 0) {
                	//aqui instancia da latidude e longitude para montar os markes
                	var latlngbounds = new google.maps.LatLngBounds();

                	var ginasio=1;
                    var pokestop=1;
                    //for do json
                    $.each(data, function (marker, ponto) {
                    			//se v2 for maior que v1 significa que esse ponto e um ginasio monto o ginasio
                              if(ponto.v2 > ponto.v1){
                              			
                              		//aqui instancia de um objeto tipo marker
						                    var marker = new google.maps.Marker({
						                    	animation: google.maps.Animation.DROP,
						                    	//instancio dentro do mapa sua latitude e longitude
												position: new google.maps.LatLng(ponto.loc[1], ponto.loc[0]),
												//titulo aparece se passar mouse por cima do ponto
												title: "Aqui é um Ginásio",
												
												icon: 'img/ginasio.png'

											});

											
											//aqui é o que vai conter dentro da infobox quando clicar no marker
											 var html = "<div class='infoBox'><h5><p id='nome'>"+ponto.nome +"</h5></p><p><img src="+ponto.image+" width='200' height='100'></img></p><p>Aqui é uma Pokerstop</p>"+
											 			"<div><button class='btn btn-default' id='sim' onclick='voto_sim();'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span> Sim</button><button  class='btn btn-default' onclick='voto_nao();' id='nao'><span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span> Não</button><button  class='btn btn-default'id='existe' onclick='nao_existe();'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Não existe</button><p id='msg' style='display:none;'>Voto cadastrado com sucesso !</p></div></div>";
											var myOptions = {
												content: html,
												pixelOffset: new google.maps.Size(-150, 0)
								        	};
                              			
                              		
							        	//passo para função infobox que abre e fecha o infobox qual id
										infoBox[ponto.Id] = new InfoBox(myOptions);
										infoBox[ponto.Id].marker = marker;

										infoBox[ponto.Id].listener = google.maps.event.addListener(marker, 'click', function (e) {
											abrirInfoBox(ponto.Id, marker);
											 
										});
										marker.mycategory = 'ginasio';     
										//puxo cada ponto criado para dentro de um array de pontos
										markers.push(marker);

										latlngbounds.extend(marker.position);
                    //faço a contagem de quantos ginasios eu tenho
										ginasio++;
                                }else{
                                		var marker = new google.maps.Marker({
                                			animation: google.maps.Animation.DROP,
											position: new google.maps.LatLng(ponto.loc[1], ponto.loc[0]),
											title: "Aqui é uma Pokestop",
											icon: 'img/pokestop.png'
										});
										 var html = "<div class='infoBox'><h5><p id='nome'>"+ponto.nome +"</h5></p><p><img src="+ponto.image+" width='200' height='100'></img></p><p>Aqui é uma Pokerstop</p>"+
										 			"<div><button class='btn btn-default' id='sim' onclick='voto_sim();'><span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span> Sim</button><button  class='btn btn-default' onclick='voto_nao();' id='nao'><span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span> Não</button><button  class='btn btn-default'id='existe' onclick='nao_existe();'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Não existe</button><p id='msg' style='display:none;'>Voto cadastrado com sucesso !</p></div></div>"	;
										var myOptions = {
											content: html,
											pixelOffset: new google.maps.Size(-150, 0)
							        	};

										infoBox[ponto.Id] = new InfoBox(myOptions);
										infoBox[ponto.Id].marker = marker;

										infoBox[ponto.Id].listener = google.maps.event.addListener(marker, 'click', function (e) {
																					
											abrirInfoBox(ponto.Id, marker);

										});
										marker.mycategory = 'pokestop';   
										markers.push(marker);

										latlngbounds.extend(marker.position);
                    //faço a contagem de quantos pokestop eu tenho
										 pokestop++;
                                }




                    });
                    //aqui codigo para mudar a cor dos pontos unidos por proximidade
                   var options = {
						  imagePath: 'img/m'
						};

						var markerCluster = new MarkerClusterer(map, markers,options);

						map.fitBounds(latlngbounds);


               		 }
               		 //aqui coloco quantidade de ginasio e pokestop
               		 $("#ginasio1").html(ginasio);
               		 $("#ginasio").html(ginasio);
               		 $("#pokestop1").html(pokestop);
               		 $("#pokestop").html(pokestop);



            },
            //caso não gere o mapa mostra o erro
            error: function (data) {
                console.log('Não foi possivel carregar o mapa');
            }

        });

      }
//função ára animacão do mapa
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
//função para cadastrar o voto
function voto_sim(){

   
               $.ajax({
                type: "GET",
                url: "suaurldoaquivo",
                data: {
                    
                     voto:'sim',
                     nome:no
                },
                success: function (result) {
                	 $("#msg").css('display','block');
                 }

             });

}
function voto_nao(){

        $.ajax({
                type: "GET",
                url: "suaurldoaquivo",
                data: {
                    
                     voto:'nao',
                     nome:no
                },
                success: function (result) {
                	 $("#msg").css('display','block');
                 }

             });


}
function nao_existe(){
		var no=$("#nome").val();
       $.ajax({
                type: "GET",
                url: "suaurldoaquivo",
                data: {
                    
                     voto:'nao_existe',
                     nome:no
                },
                success: function (result) {
                	 $("#msg").css('display','block');
                 }

             });


}
///chamo a função do mapa quando clico no checbox para aparecer por cateroria
  showMarkers();
      // ==quando checkbox for clicked passa a sua categoria para a função ==
      function boxclick(box,category) {
        if (box.checked) {
          hide(category);
        } else {
          show(category);
        }
     
      }


      // == a função recebe a caterogia clicada e mostra somente o array do marcadores da categoria ==
      function show(category) {
        for (var i=0; i<markers.length; i++) {
          if (markers[i].mycategory == category) {
            markers[i].setVisible(true);
          }
        }
        // == check the checkbox ==
        document.getElementById(category+"box").checked = true;
		
      }

        // == a função recebe a caterogia clicada e esconde a somente o array do marcadores da categoria ==
      function hide(category) {
        for (var i=0; i<markers.length; i++) {
          if (markers[i].mycategory == category) {
            markers[i].setVisible(false);
          }
        }
        // == clear the checkbox ==
        document.getElementById(category+"box").checked = false;
      
      }