const sqlite3 = require('sqlite3').verbose();
let db = null;

class Database {
    constructor(config){
        this.config = config;
    }

    connect(){ 
        db = new sqlite3.Database(this.config.SQLITE_STORAGE);
        db.serialize(function () {
            db.run('CREATE TABLE user (fullname TEXT, email TEXT, password TEXT, verification_code TEXT)',(err) => {
                if (err) {
                    //console.error(err);
                }
            });
        });
    }    

    db(){
        return db;
    }
}

module.exports = Database;