const name = $('#name');
const ceo = $('#ceo');
const price = $('#price');
const chg = $('#chg');
const chgPer = $('#chgPer');
const high = $('#high');
const low = $('#low');
const logo = $('#logo');
const input = $('#symbol-input')
const ctx = $('#chart');
let chartData = [];

const verify = function(){

}

const getInfo = function (event) {
    event.preventDefault();
    const stockSymbol = input.val();
    const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,symbols,chart&range=1d&last=10`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        render(response);
    })
}

const emptyAll = function () {
    name.empty();
    ceo.empty();
    price.empty();
    chg.empty();
    chgPer.empty();
    high.empty();
    low.empty();
    logo.empty();
    input.val('')
}

const getChartData = function (response) {
    let arr = [];
    let y = []
    response.forEach(function(data){
        arr.push(data.marketAverage);
        y.push(data.minute);
    })
    console.log(arr);
    renderGraph(arr, y);
}

const renderGraph = function(arr, y){
    var x = new Chart(ctx, {
        type: 'line',
        data: {
            labels: y,
            datasets: [{
              data: arr, 
              radius:0,           
            }]
          },
        options: {
            responsive:true, 
        }
     });
}

const render = function (response) {
    emptyAll();
    let per = response.quote.changePercent;
    per = per.toFixed(2);
    if (response.quote.changePercent >= 0) {
        chgPer.html(`(+${per}%)`);
        chgPer.css('color', '#025928');
    }
    else {
        chgPer.html(`(${per}%)`);
        chgPer.css('color', 'red');
    }
    let change = response.quote.change
    if (change >= 0) {
        chg.html(`+${change}`);
        chg.css('color', '#025928')
    }
    else {
        chg.html(`${change}`);
        chg.css('color', 'red');
    }
    name.text(response.company.companyName)
    ceo.text(`CEO: ${response.company.CEO}`)
    price.text(response.quote.latestPrice);
    high.text(`HIGH: ${response.quote.high}`);
    low.text(`LOW: ${response.quote.low}`);
    logo.html(`<img src="${response.logo.url}"/>`);
    input.val('');
    getChartData(response.chart);
    // console.log(chartData);
    // ctx.html(renderChart);
}

$('#close-menu').on('click', function () {
    const menu = $('#side-menu');
    menu.css("width", "0");
});

$('#open-menu').on('click', function () {
    const menu = $('#side-menu');
    menu.css("width", "100%");
});

$('#close-favs').on('click', function () {
    const favs = $('#favs-menu');
    favs.css("width", "0");
})

$('#open-favs').on('click', function () {
    const favs = $('#favs-menu');
    favs.css("width", "100%");
});

$('.menu-item').on('click', function () {
    $('.menu-item').removeClass('active');
    $(this).addClass('active');
})

$('#submit').on('click', getInfo);
$('#clear').on('click', emptyAll);