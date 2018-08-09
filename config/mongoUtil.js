// var MongoClient = require('mongodb').MongoClient
// var dbURL       = require('./dbURL').dbURL

// var _db;

// module.exports = {

//     conToServer: function(callback){
//             MongoClient.connect(dbURL, function(err,db){
//                 _db = db;
//                 console.log('[*] Infolog: connected do '+dbURL)
//                 console.log('value of _db: '+_db+'and db: '+db)
//                 return callback(err);
//             });
//         },
//         getDB: function(){
//             console.log('[*] Infolog: got called and value of _db: '+_db)
//             return _db;
//         }
// }

// maybe later using as wrapper ... maybe if I figured out how