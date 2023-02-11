
function randomColor(){
    randInt= (a=0,b=256) => Math.random()*(b-a)+a; // randInt = function(a=0,b=255){return Math.random()*(b-a)+a} // [0, 1) -> [0, b-a) -> [a, b)
    return `rgb(${randInt()},${randInt()},${randInt()})`;
}
let chartInvoices=null;
/*
async function createChartExample() {
  const days = {
    monday:30,
    tuesday:20,
    wednesday:15,
    thursday:10,
    friday:8,
    saturday:2,
    sunday:15
  }

  new Chart(
    document.getElementById('chart-example'),
    {
      type: 'polarArea',
      data: {
        labels: Object.keys(days),
        datasets: [
          {
            label: 'Level',
            data: Object.values(days), // number of data = number of labels
            backgroundColor: [
                'red',
                'green',
                'blue',
                'pink',
                'orange',
                'fuchsia',
                'skyblue'
              ]
          }
        ]
      }
    }
  );
}
*/
async function createChartInvoices(chartData) {
    let culoriRandom=[];
    for (let _ in chartData) culoriRandom.push(randomColor());
    if (!chartInvoices){
    chartInvoices=new Chart(
        document.getElementById('chart-invoices'),
        {
          type: 'bar',
          data: {
            labels: [], //Object.keys(chartData),
            datasets: [
              {
                label: 'Number of sells:',
                data: [], //Object.values(chartData),
                backgroundColor: [] //randomColor
              }
            ]
          }
        }
      );}
      else{
        //let date=Array.from(chartInvoices.data.datasets[0].data); 
        // Object.keys(chartData).forEach(function(label, idx){
        //     if (!chartInvoices.data.labels.includes(label)){
        //         chartInvoices.data.labels.splice(idx,1);
        //         chartInvoices.data.datasets[0].backgroundColor.splice(idx,1);
        //         date.splice(idx,1);
        //     }
            
        //     if (!chartInvoices.data.labels.includes(label)){
        //         chartInvoices.data.labels.splice(idx,1);
        //         chartInvoices.data.datasets[0].backgroundColor.splice(idx,1);
        //         date.splice(idx,1);
        //     }
        // }

      // set labels
      chartInvoices.data.labels.splice(0, chartInvoices.data.labels.length)
      chartInvoices.data.labels=Object.keys(chartData);

      chartInvoices.data.datasets[0].data.splice(0, chartInvoices.data.datasets[0].data.length)
      let orderedColors=[]
      Object.values(chartData).forEach( (val,i) =>
            {
                chartInvoices.data.datasets[0].data.push(val); // set numeric values
                orderedColors.push(colors[Object.keys(chartData)[i]]) // create vector of colors for every label
            });
      chartInvoices.data.datasets[0].backgroundColor=orderedColors; // set color
      chartInvoices.update();
      }
}

let colors={}
function updateInvoices(){
    fetch("/update_invoices", {		
        method: "GET",
        headers:{'Content-Type': 'application/json'},       
        mode: 'cors',		
        cache: 'default'
    })
    .then(function(answ){ console.log(answ); x=answ.json(); console.log(x); return x})
    .then(function(objInvoices) {
        console.log(objInvoices);
        let chartData={}
        for (let invoice of objInvoices){
            for(let disc of invoice.products){
                // counter: for each key, count the number of apparitions
                chartData[disc.album]=chartData[disc.album]?chartData[disc.album]+1:1
                if(!colors[disc.album])colors[disc.album]=randomColor();
            }
        }
        createChartInvoices(chartData);
    })
}

window.addEventListener("load", function(){
    updateInvoices();
    this.setInterval(updateInvoices, 5000);
})