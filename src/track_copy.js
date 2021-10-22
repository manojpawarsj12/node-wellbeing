const fs = require("fs");
const path = require("path");


const activeWin = require("electron-active-window");

const {
  createTable,
  InsertApp,
  InsertTime,
  AppId,
  AppExists,
  getTotal,
  getAllApps,
} = require("./database");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const printDiv = document.getElementById("printdetail");

const getActiveWin = async () => {
  return await activeWin().getActiveWindow();
};

let appid;

let previous_window = null;
let timer;

let start = Date.now();

createTable();

async function getActive() {
  const current_window = await getActiveWin();
  //console.log(current_window)

  if (current_window === undefined) return;
  if (current_window === "") return;

  if (
    previous_window != null &&
    current_window.windowClass != previous_window.windowClass
  ) {
    let name = previous_window.windowClass;
    let end = Date.now();
    const appexists = await AppExists(name);

    if (appexists) {
      appid = await AppId(name);

      appid = appid["id"];

      await InsertTime(start, end, appid);
    } else {
      let pid = previous_window.windowPid;
      let windowName = previous_window.windowName;

      await InsertApp(name, pid, windowName);

      appid = await AppId(name);
      appid = appid["id"];
      console.log(appid);
      await InsertTime(start, end, appid);
    }
    start = Date.now();
    let names = await getAllApps();
    names
    
    // console.clear();
    // for (let i in names) {
    //   //console.log(i);
    //   const appname=names[i]['name'];
    //   let appid = await AppId(appname);
    //   appid=appid["id"]
    //   const time = await getTotal(appid)

    //   console.log(`${appname} is used for ${time}`);
    // }
  }

  previous_window = current_window;
}

startBtn.onclick = (e) => {
  console.log("on start button");

  timer = setInterval(getActive, 500);
  startBtn.disabled = true;

  e.preventDefault();
};

stopBtn.onclick = (e) => {
  printDiv.innerHTML = "";
  startBtn.disabled = false;
  clearInterval(timer);
  console.clear();
  console.log("recording stopped");
  e.preventDefault();
};
