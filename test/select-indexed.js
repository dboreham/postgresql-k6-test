import sql from 'k6/x/sql';
import { uuidv4, randomIntBetween, randomItem } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { words } from './lib/lorem-ipsum.js';

const db = sql.open("postgres", "postgresql://testuser:secret@server:5432/testdb?sslmode=disable");

const rowCount = 100000;

const wordArray = words();
const wordCount = 10;

export let options = {
  setupTimeout: '300s',
};

function randomWords(n) {
  let text = '';
  let sep = '';
  for (let x = 0; x < n; x++) { text += (sep + randomItem(wordArray)); sep = ' ';}
  return text;
}

function getRowCount() {
  var countResult = sql.query(db, `select count(*) from testtable2`);
  return countResult[0].count;
}

export function setup() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS testtable2
(
    field1 uuid NOT NULL,
    field2 integer,
    field3 text NOT NULL,
    CONSTRAINT testtable2_pkey PRIMARY KEY (field1) )
	`);

  db.exec(`
CREATE INDEX if not exists testable2_field2_index
    ON public.testtable USING btree
    (field2 ASC NULLS LAST)
    TABLESPACE pg_default;
`);

  // Check if the current row count is what we exect 
  var currentRowCount = getRowCount();
  if (currentRowCount === rowCount) {
    // if so, then proceed
    console.log('Using existing table content');
  } else 
  {
    console.log('Inserting test data, this may take some time...');
    // otherwise, delete rows and insert new ones

    // Delete any existing content
    db.exec(`
      delete from testtable2
	  `);

    // Populate the table with data with known field values
    for (let x = 0; x < rowCount; x++) {
      var field1value = uuidv4();
      var field2value = x;
      var field3value = randomWords(wordCount);
      var statement = `INSERT INTO testtable2(field1, field2, field3) VALUES ('${field1value}', '${field2value}', '${field3value}')`;
      //console.log(statement);
      db.exec(statement);
    }
    // Check row count
    console.log(`Row count: ${getRowCount()}`);
  }
}

export function teardown() {
  db.close();
}

export default function () {
  var lookupKey = randomIntBetween(0,rowCount - 1);
  var statement = `select * from testtable2 where field2 = '${lookupKey}'`;
  //console.log(statement);
  sql.query(db,statement);
}
