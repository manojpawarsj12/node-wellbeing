const stowBtn = document.getElementById("showBtn");
const ctx = document.getElementById("myChart").getContext("2d");

const getName = async () => {
    return await getAllApps();
};

const main = async () => {
    let names = await getName();
    let labels = [];
    let times = []
    for (let i in names) {
        labels.push(names[i]["name"]);
        let appid = await AppId(names[i]["name"]);
        appid = appid["id"]
        const time = await getTotal(appid)
        times.push(time)
    }
    console.log(labels)
    console.log(times)
    const data = {
        labels,
        datasets: [
            {
                data: times,
                label: "in miliseconds"
            },
        ],

    };
    const config = {
        type: "doughnut",
        data: data,
        options: {
            responsive: true,
        },
    };

    const myChart = new Chart(ctx,config)

};

showBtn.onclick = (e) => {
    main()
    e.preventDefault();
};
