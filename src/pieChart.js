const stowBtn = document.getElementById("showBtn");
const ctx = document.getElementById("myChart").getContext("2d");
canvas = document.getElementById('myChart');

const getName = async () => {
    return await getAllApps();
};

let myChart;
function createChart(myChart, ctx, config) {

    myChart = new Chart(ctx, config);
    return myChart
}
let check = 1; 

const main = async () => {
    let names = await getName();
    let labels = [];
    let times = []
    for (let i in names) {
        labels.push(names[i]["name"]);
        let appid = await AppId(names[i]["name"]);
        appid = appid["id"]
        const time = await getTotal(appid, secc = true)
        times.push(time)
    }
    console.log(times, labels)

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
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4,
    };
    
    
    
    if(check & 1){
        myChart.destroy();
    }
    else{
        myChart = createChart(myChart, ctx, config);
    }

};

showBtn.onclick = (e) => {


    main()
    check++; 
    e.preventDefault();
};
