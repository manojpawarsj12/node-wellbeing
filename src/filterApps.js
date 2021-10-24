module.exports = {
    filterApps
}
const path = require('path');

function filterApps(current_window) {

    let windowClass = current_window.windowClass;
    windowClass = path.parse(windowClass).name;
    current_window.windowClass = windowClass;

    if (windowClass === "ApplicationFrameHost") {
        current_window.windowClass = "Mail";
    }

    return current_window


}