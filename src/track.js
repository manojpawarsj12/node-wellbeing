const fs = require("fs");
const path = require("path");

const activeWin = require("electron-active-window");

const { TimeEntry, Process } = require("./module");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const printDiv = document.getElementById("printdetail");

const getActiveWin = async () => {
  return await activeWin().getActiveWindow();
};

const jsonpath = path.join(__dirname, "activities.json");
let previous_window = null;
let timer;
let process_list = {};
let start = Date.now();
let DateObj= new Date(start);

if (fs.existsSync(jsonpath)) {
  /*true condition executes if json file already exists*/
  try {
    const temp = JSON.parse(
      fs.readFileSync(jsonpath, {
        encoding: "utf-8",
      })
    );

    for (let proc in temp) {
      process_list[proc] = Process.fromJson(temp[proc]);
    }
  } catch {
    console.log("JSON parsing error.");
  }
} else {
  fs.writeFileSync(jsonpath, "{}", {
    encoding: "utf-8",
  });
}

function saveChanges({ formatted }) {
  let formatting_options = formatted ? [null, 5] : [];

  fs.writeFileSync(
    jsonpath,
    JSON.stringify(process_list, ...formatting_options),
    {
      encoding: "utf-8",
    }
  );
}

async function getActive() {
  const current_window = await getActiveWin();
  //console.log(current_window)

  if (current_window === undefined) return;
  if (current_window === "") return;

  if (
    previous_window != null &&
    current_window.windowClass != previous_window.windowClass
  ) {
    let previous_path = previous_window.windowClass;
    let end = Date.now();

    if (previous_path in process_list) {
      process_list[previous_path].addEntry(start, end,DateObj);
    } else {
      process_list[previous_path] = new Process(
        previous_window.windowClass,
        previous_window.windowName,
        [new TimeEntry(start, end,DateObj)]
      );
    }
    start = Date.now();
    DateObj = new Date(start);
   

    console.clear();
    printDiv.innerHTML = "";
    for (let proc in process_list) {
      const divv = document.createElement("div")
      divv.innerHTML = process_list[proc].name + " used for " + process_list[proc].prettyTotal()
      printDiv.appendChild(divv)


      console.log(
        process_list[proc].name + " used for",
        process_list[proc].prettyTotal()
      );
    }

    saveChanges({
      formatted: true,
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
  startBtn.disabled = false;
  clearInterval(timer);
  console.clear();
  console.log("recording stopped")
  e.preventDefault();

};
