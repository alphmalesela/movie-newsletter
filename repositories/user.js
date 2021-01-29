class UserRepository{
    
    constructor(db){
        this._db = db;
    }

    createUser(name,email,password,verif_code){
        console.log('createUser:.');
        console.log('name:', name);
        console.log('email:', email);
        console.log('verif_code:', verif_code);
        const stmt = this._db.prepare('INSERT INTO user(fullname, email, password, verification_code, verified) VALUES (?,?,?,?,?)');
        stmt.run([name,email,password,verif_code,0], (err,row) => {
            if (err) {
                console.error(err);
                throw err;
            }
        });
        stmt.finalize();
    }

    async getUsers() {
        return new Promise((resolve, reject) => {
            this._db.all('SELECT email FROM user WHERE verified = 1', (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
    }

    getUserByEmailVerif(email, verif_code) {
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

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this._db.get('SELECT fullname, email, password, verified FROM user WHERE email = ?', [email], (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        })
    }
    
    updateVerifiedUser(email) {
        const stmt = this._db.prepare('UPDATE user SET verified = 1 WHERE email = ?');
        stmt.run([email], (err,row) => {
            if (err) {
                console.error(err);
                throw err;
            }
        });
        stmt.finalize();
    }

    deleteUser(email) {
        const stmt = this._db.prepare('DELETE FROM user WHERE email = ?');
        stmt.run([email], (err,row) => {
            if (err) {
                throw err;
            }
        });
        stmt.finalize();
    }
    
}

module.exports = UserRepository;