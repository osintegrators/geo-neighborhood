$(function(){

  if('geolocation' in navigator){
    refreshCurrent();
  }
  else {
    $('#current-wrapper').html('(We can\'t seem to get this device\'s location)');
  }

  function refreshCurrent(ev){
    if(ev) ev.preventDefault();
    navigator.geolocation.getCurrentPosition(queryCurrentNeighborhood);
  }

  function queryCurrentNeighborhood(pos){
    $.getJSON('/currentNeighborhood?lat='+pos.coords.latitude+'&lng='+pos.coords.longitude, displayCurrentNeighborhood);
  }

  function displayCurrentNeighborhood(data){
    if(!data.name){
      $('#current-n-name').text('(unknown)');
    }
    else {
      $('#current-n-name').text(data.name);
    }
  }

  var originEl = $('#origin'),
      destEl = $('#dest'),
      searchBtnEl = $('#search'),
      neighborhoodEl = $('#neighborhoods');

  function displayResults(data){
    if(data.error) {
      alert(data.errorMessage);
    }

    else{
      listNeighborhoods(data.neighborhoodNames);
      redrawMap(data.route);
    }
  }

  function listNeighborhoods(neighborhoods){
    neighborhoodEl.empty();
    for( var i = 0, ii = neighborhoods.length; i < ii; i++){
      neighborhoodEl.append('<div class="hood">'+neighborhoods[i]+'</div>');
    }
  }

  var currentRoute;
  function redrawMap(route){
    if(currentRoute) map.removeLayer(currentRoute);
    var Lroute = route.map(function(coords){
      return new L.LatLng(coords[1], coords[0]);
    });

    currentRoute = L.polyline(Lroute, {color: 'blue'}).addTo(map);
    map.fitBounds(currentRoute.getBounds());
  }


  function getNeighborhoods(){
    var originAddress = originEl.val();
    var destAddress = destEl.val();

    if(!originAddress || !destAddress ){
      return alert('Please fill in both start and end addresses');
    }

    $.getJSON(
      '/searchNeighborhoods?or='+encodeURI(originAddress)+'&dest='+encodeURI(destAddress),
      displayResults
      );
  }

  searchBtnEl.bind('click', getNeighborhoods);


  //do the map thing
  var map = L.map('map').setView([41.875696,-87.634034], 13);
  var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
      subDomains = ['otile1','otile2','otile3','otile4'],
      mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
        var mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttrib, subdomains: subDomains});
        mapquest.addTo(map);
});
