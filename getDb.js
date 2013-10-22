console.log('included 2');

var MongoClient = require('mongodb').MongoClient;

/**
 * Get the db connection
 */
var mongourl = 'mongodb://localhost/Chicago';
var dbObj = {};

MongoClient.connect(mongourl, function(err, db){
  if(err) {
    dbObj.err = err;
    console.log('error', err);
  }
  else {
    dbObj.db = db;
    db.collection('neighborhoods', function(err, coll){
      dbObj.neighborhoods = coll;
    });
  }
});



module.exports = dbObj;
