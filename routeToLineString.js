function routeToLineString(route){
  console.log(route);
  var LineString = {type: "LineString"};
  var coords = [];

  var legs = route.legs;
  var leg, step;

  for(var i = 0, ii = legs.length; i < ii; i++){
    leg = legs[i];
    coords.push([leg.start_location.lng, leg.start_location.lat]);
      
    for(var j = 0, jj = leg.steps.length; j < jj; j++){
      step = leg.steps[j];
      coords.push([step.end_location.lng, step.end_location.lat]);
    }

  }

  LineString.coordinates = coords;

  return LineString;
}


module.exports = routeToLineString;
