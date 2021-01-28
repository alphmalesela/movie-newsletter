import { reject } from "bcrypt/promises";
import { resolve } from "path";

class UserRepository{
    
    constructor(db){
        this._db = db;
    }

    createUser(name,email,password,verif_code){
        const stmt = this._db.prepare('INSERT INTO user(fullname, email, password, verification_code) VALUES (?,?,?,?)');
        stmt.run([name,email,password,verif_code], (err,row) => {
            if (err) {
                console.error(err);
            }
            console.log('row:.', row);
        });
        stmt.finalize();
    }

    async getUsers() {
        return new Promise((resolve, reject) => {
            this._db.all('SELECT email FROM user', (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
    }

    getUserByEmail(email, verif_code) {
        return new Promise((resolve, reject) => {
            this._db.get('SELECT fullname, email FROM user WHERE email = ? AND verification_code = ?', [email, verif_code], (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        })
    }
}

export { 
    UserRepository
};