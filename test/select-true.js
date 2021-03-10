import sql from 'k6/x/sql';

const db = sql.open("postgres", "postgresql://testuser:secret@server:5432/testdb?sslmode=disable");

export function setup() {
	  db.exec(`select true;`);
}

export function teardown() {
	  db.close();
}

export default function () {
	  db.exec('select true;');
}
