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

const { filterApps } = require("./filterApps");

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
function secToDate(sec){
  let min = Math.floor(sec / 60);
  let hr = Math.floor(sec / 60 / 60);
  hr = hr >= 10 ? hr : '0' + hr;

  min = min >= 10 ? min : '0' + min;

  sec = Math.floor(sec % 60);
  sec = sec >= 10 ? sec : '0' + sec;


  return hr + ' hours, ' + min + ' mins, ' + sec + ' secs';
}

async function getActive() {
  const current_window = await getActiveWin();
  //console.log(current_window)

  if (current_window === undefined) return;
  if (current_window.windowClass === "") return;
  if (current_window.windowClass.length === 0) return;
  filterApps(current_window);

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
    


    console.clear();
    printDiv.innerHTML = "";
    let obj = {}
    let names = await getName();


    for (let i in names) {


      let appid = await AppId(names[i]["name"]);
      appid = appid["id"]
      const time = await getTotal(appid, secc = true)
      obj[names[i]["name"]] = time;
      
    }
    const sortable = Object.fromEntries(
      Object.entries(obj).sort(([, a], [, b]) => b - a)
    );
    Object.entries(sortable).forEach(([key, value]) => {
      const divv = document.createElement("div");
      divv.innerHTML = `${key} is used for ${secToDate(value)}`;
      printDiv.appendChild(divv);
      console.log(`${key} is used for ${secToDate(value)}`)
      
    });



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

  clearInterval(timer);
  console.clear();
  console.log("recording stopped");
  e.preventDefault();
};
