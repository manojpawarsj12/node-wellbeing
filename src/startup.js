module.exports = {
  install,
  uninstall,
};

const AutoLaunch = require("auto-launch");
const { app } = require("electron");

const appLauncher = new AutoLaunch({
  name: app.getName(),
  isHidden: true,
});

function install() {
  return appLauncher.isEnabled().then((enabled) => {
    if (!enabled) return appLauncher.enable();
  });
}

function uninstall() {
  return appLauncher.isEnabled().then((enabled) => {
    if (enabled) return appLauncher.disable();
  });
}
