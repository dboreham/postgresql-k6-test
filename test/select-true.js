import sql from 'k6/x/sql';

const db = sql.open("postgres", "postgresql://md:md@host.docker.internal:5432/md?sslmode=disable");

export function setup() {
	  db.exec(`select true;`);
}

export function teardown() {
	  db.close();
}

export default function () {
	  db.exec('select true;');
}
