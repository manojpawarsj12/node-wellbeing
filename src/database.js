const { runMain } = require("module");
const sqlite = require("sqlite3");
const db = new sqlite.Database("./activity.db", (err) => {
  if (err) {
    console.error(err.message);
  }
});
const { promisify } = require("util");

const query = promisify(db.all).bind(db);
const selectQuery = promisify(db.get).bind(db);
async function createTable() {
  const sql = `CREATE TABLE IF NOT EXISTS  App (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(255) NOT NULL,
        "pid" INTEGER NOT NULL,
        "windowName" text NOT NULL
        )`;
  const timeSql = `CREATE TABLE IF NOT EXISTS TimeEntry(
        
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        
        "start" TIMESTAMP  NOT NULL,
        "end" TIMESTAMP  NOT NULL,
        "appid" INTEGER NOT NULL,
        FOREIGN KEY(appid) REFERENCES App(id)
    )`;
  await query(sql);
  await query(timeSql);
}
async function InsertApp(name, pid, windowName) {
  const sql = `INSERT INTO App(name,pid,windowName) VALUES(?,?,?)`;
  await query(sql, [name, pid, windowName]);
}

async function InsertTime(start, end, appid) {
  const sql = `INSERT INTO TimeEntry(start,end,appid) VALUES(?,?,?)`;
  await query(sql, [start, end, appid]);
}
async function AppId(name) {
  const sql = `SELECT id FROM App WHERE name="${name}"`;
  const data = await selectQuery(sql);
  return data;
}

async function AppExists(name) {
  const sql = `SELECT 1 FROM App WHERE name="${name}"`;
  const res = await selectQuery(sql);
  if (res) {
    return true;
  }
  return false;
}
function getDiff(entry) {
  let diff = entry["end"] - entry["start"];
  return diff
}

async function getTotal(appid) {
  const sql = `SELECT  * from TimeEntry where appid=(?)`;
  let res = await query(sql, [appid]);


  console.log(
    res.reduce((total, entry) => {

      return total + getDiff(entry)
    }, 0)
  );

  return res;
}
async function run() {
  const data = await getTotal(1);
  //console.log(data);
}
run();
module.exports = { createTable, InsertApp, InsertTime, AppId, AppExists };
