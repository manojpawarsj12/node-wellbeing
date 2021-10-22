
class TimeEntry {
    constructor(start, end,DateObj) {
        this.start = start;
        this.end = end;

    }

    getDiff() {
        return this.end - this.start
    }
}

class Process {
    constructor(name, path, first_time_entry) {
        this.name = name;
        this.path = path;
        this.time_entries = [...first_time_entry];
    }

    addEntry(start, end) {
        this.time_entries.push(new TimeEntry(start, end));
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        return new Process(json.name, json.path, json.time_entries.map((i) => new TimeEntry(i.start, i.end)));
    }


    getTotal() {
        return this.time_entries.reduce((total, entry) => {
            return total + entry.getDiff();
        }, 0);
    }


    prettyTotal() {
        let ok = this.getTotal()
        console.log(ok)


        let sec = Math.floor(ok / 1000);
        let min = Math.floor(sec / 60);
        let hr = Math.floor(sec / 60 / 60);
        hr = hr >= 10 ? hr : '0' + hr;

        min = min >= 10 ? min : '0' + min;

        sec = Math.floor(sec % 60);
        sec = sec >= 10 ? sec : '0' + sec;

        return hr + ' hours, ' + min + ' mins, ' + sec + ' secs';


    }
}

module.exports = { TimeEntry, Process }