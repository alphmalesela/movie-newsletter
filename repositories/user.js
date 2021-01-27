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

    getUsers() {
        this._db.all('SELECT fullname, email FROM user', (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                console.log('rows:', rows);
                return rows;
            }
        });
    }

    getUserByEmail() {
        return this._db.get('SELECT fullname, email FROM user', (err, row) => {
            if (err) {
                console.error(err);
                return null;
            } else {
                console.log('row:', row);
                return row;
            }
        });
    }
}

export { 
    UserRepository
};