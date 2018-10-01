const name = $('#name');
const ceo = $('#ceo');
const price = $('#price');
const chg = $('#chg');
const chgPer = $('#chgPer');
const high = $('#high');
const low = $('#low');
const logo = $('#logo');
const input = $('#symbol-input');
const news = $('#news');
let ctx = $('#chart');
const favsDropdown = $('#favs-dropdown');
const favsMenu = $('#favs-slider');
let chartData = [];
let allStocks = [];
const stockList = ['AAPL', 'GOOG', 'AMZN', 'TSLA', 'BRK.A'];

$(document).ready(function () {
    $.ajax({
        url: `https://api.iextrading.com/1.0/ref-data/symbols`,
        method: 'GET',
    }).then(function (response) {

        console.log(response);
        for (let i = 0; i < response.length; i++) {
            allStocks.push(response[i].symbol);
        }
        console.log(allStocks);
    })
    for (let i = 0; i < stockList.length; i++) {
        favsMenu.append(`<div class="row">
            <a class="favorite col-12 list-group-item" href="#" id="${stockList[i]}">${stockList[i]}</a>
        </div>`);
        favsDropdown.append(`<a class="favorite dropdown-item" href="#" id="${stockList[i]}">${stockList[i]}</a>`);
    }
})

const getInfo = function (event) {
    event.preventDefault();
    const stockSymbol = input.val().toUpperCase();
    if (allStocks.includes(stockSymbol)) {
        const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,chart&range=1d&last=10`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            render(response);
        })
    }
    else {
        emptyAll();
        name.text("Please enter a valid United States trading symbol.");
        name.css('color', 'red');
    }
}

const getFavInfo = function (event) {
    console.log("function is running");
    event.preventDefault();
    const stockSymbol = $(this).text();
    console.log(stockSymbol);
    if (allStocks.includes(stockSymbol)) {
        const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,chart&range=1d&last=10`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            name.css('color', 'black')
            console.log(response);
            render(response);
        })
    }
    else {
        emptyAll();
        name.text("Please enter a valid United States trading symbol.");
        name.css('color', 'red');
    }
    $('#favs-menu').css("width", "0");
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
    input.val('');
    $('#graph-title').empty();
    news.empty();
    resetCanvas();
}

const resetCanvas = function () {
    $('#chart').remove(); // this is my <canvas> element
    $('#graph').append('<canvas id="chart"></canvas>');
    canvas = document.querySelector('#chart'); // why use jQuery?
    ctx = canvas.getContext('2d');
    ctx.canvas.width = $('#graph').width(); // resize to parent width
    ctx.canvas.height = $('#graph').height();
}

const getChartData = function (response) {
    resetCanvas();
    let arr = [];
    let y = []
    response.forEach(function (data) {
        arr.push(data.marketAverage);
        y.push(data.minute);
    })
    console.log(arr);
    renderGraph(arr, y);
}

const renderGraph = function (arr, y) {

    var x = new Chart(ctx, {
        type: 'line',
        data: {
            labels: y,
            datasets: [{
                data: arr,
                radius: 0,
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false,
            }
        }
    });
    $('#graph-title').text(`Market Average`);
    $('#graph-title').css('text-align', 'center');
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
    getNews(response.news)
}

const getNews = function (data) {
    for (let i = 0; i < data.length; i++) {
        let block = `<div class="col-12 col-md-6 col-lg-3" id="block">
        <div id="news-image">
            <img src=${data[i].image}/>
        </div>
        <div id="news-headline">
            ${data[i].headline}
        </div>
        </div>`;
        news.append(block);
        console.log(data[i].image);
    }
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
$('#favs-dropdown').on('click', '.favorite', getFavInfo);
$('#favs-slider').on('click', '.favorite', getFavInfo);