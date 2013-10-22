var mongo = require('../getDb');
var request = require('request');
var routeToLineString = require('../routeToLineString');
/*
 * GET home page.
 */

exports.search = function(req, res){
  var origin = req.query.or;
  var dest = req.query.dest;
  
  if(!origin || !dest){
    res.send({error: true, errorMessage: "Both starting and ending addresses must be supplied!"});
  }

  console.log(origin, dest);

  var gStr = 'http://maps.googleapis.com/maps/api/directions/json?';
  gStr += 'mode=bicycling&';
  gStr += 'sensor=false&';
  gStr += 'mode=bicycling&';
  gStr += 'origin='+origin+'&';
  gStr += 'destination='+dest;

  console.log(gStr);

  request({url: gStr, json: true}, function(err, response, body){
    var json = body;
    if(json.routes && json.routes.length){
      var LineString = routeToLineString(json.routes[0]);
      mongo.neighborhoods.find({geometry: {$geoIntersects: {$geometry: LineString}}})
        .toArray(function(err, docs){
          var names = docs.map(function(doc){return doc.properties.PRI_NEIGH;});
          res.send({route: LineString.coordinates, neighborhoodNames: names});
      });
    }
    else {
      return res.send({error: true, errorMessage: json.status});
    }
  });
};

exports.currentNeighborhood = function(req, res){
  var lat = req.query.lat,
      lng = req.query.lng;

  mongo.neighborhoods.find({geometry: {$geoIntersects: {$geometry: {
    type: "Point",
    coordinates: [parseFloat(lng), parseFloat(lat)]
  }}}}).toArray(function(err, docs){
    if(err){
      console.log(err);
      res.send({err: err});
    }
    else {
      res.send({name: docs[0].properties.PRI_NEIGH});
    }
  });
};
