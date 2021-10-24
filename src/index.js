const { app, BrowserWindow, nativeImage, Tray, Menu } = require("electron");
const path = require("path");


if (require("electron-squirrel-startup")) {
  app.quit();
}

const mainWindow = {};

const createTray = () => {
  mainWindow.tray = new Tray(nativeImage.createEmpty());

  const menu = Menu.buildFromTemplate([
    {
      label: "Actions",
      submenu: [
        {
          label: "Open Apptracker",
          click: (item, window, event) => {
            //console.log(item, event);
            mainWindow.win.show();
          },
        },
      ],
    },
    {
      type: "separator",
    },
    {
      role: "quit",
    },
  ]);
  mainWindow.tray.setToolTip("Apptracker");
  //top.tray.setTitle("Tray Example"); // macOS only
  mainWindow.tray.setContextMenu(menu);

  mainWindow.icons = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });
  mainWindow.icons.loadURL(
    "https://trends.google.com/trends/hottrends/visualize"
  );
  mainWindow.icons.webContents.on("paint", (event, dirty, image) => {
    if (mainWindow.tray)
      mainWindow.tray.setImage(
        image.resize({
          width: 16,
          height: 16,
        })
      );
  });
};

const createWindow = () => {
  // Create the browser window.
  mainWindow.win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.win.loadFile(path.join(__dirname, "index.html"));
  mainWindow.win.on("close", (ev) => {
    //console.log(ev);
    ev.sender.hide();
    ev.preventDefault();
  });
  createTray();

  mainWindow.win.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", (ev) => {
  mainWindow.win.removeAllListeners("close");

  mainWindow = null;
});


