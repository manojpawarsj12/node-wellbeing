module.exports = {
  install,
  uninstall,
};

const AutoLaunch = require("auto-launch");
const { app } = require("electron");

const appLauncher = new AutoLaunch({
  name: 'apptracker',
  isHidden: true,
});

function install() {
  return appLauncher.isEnabled().then((enabled) => {
    if (!enabled)
      console.log("enabled")
      return appLauncher.enable();
  });
}

function uninstall() {
  return appLauncher.isEnabled().then((enabled) => {
    if (enabled) 
      console.log("disabled") 
      return appLauncher.disable();
  });
}

const DisabledAutoStartbuttons = document.getElementById(
  "Disable-autostartBtn"
);
const autostartBtn = document.getElementById("autostartBtn");
autostartBtn.onclick = (e) => {
  install();

  e.preventDefault();
};
DisabledAutoStartbuttons.onclick = (e) => {
  uninstall();
  e.preventDefault();
};