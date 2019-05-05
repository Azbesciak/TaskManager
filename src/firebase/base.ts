import * as firebase from 'firebase';

let _db: firebase.database.Database | null = null;

function db() {
    if (!_db) {
        _db = firebase.database();
    }
    return _db;
}

export function reference(path?: string) {
    return db().ref(path);
}

export function auth() {
    return firebase.auth();
}
