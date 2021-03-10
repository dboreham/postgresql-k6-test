import sql from 'k6/x/sql';
import { uuidv4, randomIntBetween, randomItem } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { words } from './lib/lorem-ipsum.js';

const db = sql.open("postgres", "postgresql://testuser:secret@server:5432/testdb?sslmode=disable");

const wordArray = words();
const wordCount = 10;

function randomWords(n) {
  let text = '';
  let sep = '';
  for (let x = 0; x < n; x++) { text += (sep + randomItem(wordArray)); sep = ' ';}
  return text;
}

export function setup() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS testtable
(
    field1 uuid NOT NULL,
    field2 integer,
    field3 text NOT NULL,
    CONSTRAINT testtable_pkey PRIMARY KEY (field1) )
	`);

  db.exec(`
CREATE INDEX if not exists testable_field2_index
    ON public.testtable USING btree
    (field2 ASC NULLS LAST)
    TABLESPACE pg_default;
`);
}

export function teardown() {
  db.close();
}

export default function () {
  var field1value = uuidv4();
  var field2value = randomIntBetween(0,100000);
  var field3value = randomWords(wordCount);
  var statement = `INSERT INTO testtable(field1, field2, field3) VALUES ('${field1value}', '${field2value}', '${field3value}')`;
  // console.log(statement);
  db.exec(statement);
}
