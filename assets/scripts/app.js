//Setting lots of global variables to make code more readable
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
let chartData = []; //global variable for chart data to make it more accessable to use multiple functions
let allStocks = []; //global variable for pulling every stock symbol supported by IEX
let userStocks = []; //global variable for storing every non-favorite input by the user
let stockList; //global variable for holding every favorite stock selected by the user. Will be initialized by localStorage OR on document.ready
let lastSelection = {}; //global variable for holding the last stock that was searched. Used to make re-renders invisible to the user when they add or remove favorites


// When the document is ready after loading or after refresh...
$(document).ready(function () {
    stockList = JSON.parse(localStorage.getItem("stockList")); // check to see if there is data stored locally for favorites (There will be if the user has used this app before and did not reset or clear it another way. If there is local storage, use stored favorites)
    if (!stockList) { // if there isn't any local data, set the favorites to these five symbols
        stockList = ['AAPL', 'GOOG', 'AMZN', 'TSLA', 'BRK.A'];
    }
    // Loop through favorites, putting them both in the dropdown and slide menu
    for (let i = 0; i < stockList.length; i++) {
        favsMenu.append(`<div class="row">
            <a class="favorite col-12 list-group-item" href="#" id="${stockList[i]}">${stockList[i]}</a>
        </div>`);
        favsDropdown.append(`<a class="favorite dropdown-item" href="#" id="${stockList[i]}">${stockList[i]}</a>`);
    }

    // AJAX call to get all valid symbols from IEX
    $.ajax({
        url: `https://api.iextrading.com/1.0/ref-data/symbols`,
        method: 'GET',
    }).then(function (response) {

        // console.log(response);
        for (let i = 0; i < response.length; i++) { // push each valid stock symbol into allStocks[] one after another
            allStocks.push(response[i].symbol);
        }
        // console.log(allStocks);
    })
})

// function to pull data from searches started from the input bar
const getInfo = function (event) {
    event.preventDefault();
    const stockSymbol = input.val().trim().toUpperCase(); // grabs any non '' string from the input bar, forces each character to be uppercase
    if (allStocks.includes(stockSymbol)) { // check to see if it's a valid IEX symbol. If it is, continue here
        if (!stockList.includes(stockSymbol)) { // check to see that it's NOT a favorite. If not, continue here
            if (!userStocks) { // check to see if userStocks has been initialized yet. It should always be...I had this from a previous version. I shouldn't need this check now but for some reason, if I take it out, it slows down the page and makes it almost unusable, so....it stays in.
                userStocks = []; // initialize userStocks to empty array
                $('#btn-bar').append(`<button class="btn stock-btn" id="${stockSymbol}">${stockSymbol}</button>`); // Make a new button on the button bar with the symbol
                userStocks.push(stockSymbol); // add the symbol to the userStocks [] so we won't make duplicate buttons
            }
            else if (!userStocks.includes(stockSymbol)) { // checks to see if the symbol already has a button. If it does NOT, continue here
                $('#btn-bar').append(`<button class="btn stock-btn" id="${stockSymbol}">${stockSymbol}</button>`); // Make a new button on the button bar with the symbol
                userStocks.push(stockSymbol); // add the symbol to the userStocks [] so we won't make duplicate buttons
            }

        }
        const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,chart&range=1d&last=10`;
         
        // AJAX call to get specific stock data. Gets quote, logo, last 10 news, company, and 1d chart
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            // console.log(response);
            render(response); // passes the response info on to render ();
        })
        name.css('color', 'black'); // sets the color of company name info to black. It's black by default, but in the case below to handle if there is no matching symbol in the IEX API, it sets the color to red and doesn't set it back to black afterwards, so this just re-sets the default text color to black in case the last search resulted in the following error.
    }
    else { // if the search value is NOT a valid IEX symbol
        emptyAll(); // empty the page below the button bar
        name.text("Please enter a valid United States trading symbol."); // display this as an on-page error
        name.css('color', 'red'); // in red text
    }
}

// separate function to get info on button clicks instead of input box
const getFavInfo = function (event) {
    // console.log("function is running");
    event.preventDefault();
    const stockSymbol = $(this).text(); // this handles taking info from the HTML of the button or dropdown item and setting it as the symbol to search
    // console.log(stockSymbol);
    if (allStocks.includes(stockSymbol)) { // if it's a valid symbol...shouldn't be necessary as I can't imagine a case where a user can make a button with an invalid symbol, but you know...
        const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,chart&range=1d&last=10`;

        //AJAX call to IEX to get quote, logo, last 10 news, company and 1d chart for the symbol user clicked on
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            name.css('color', 'black')
            // console.log(response);
            render(response); // sends the response object to render();
        })
    }
    else { // if the button clicked has an invalid symbol
        emptyAll(); // empty the page below the button bar
        name.text("Please enter a valid United States trading symbol."); // display error message on-page
        name.css('color', 'red'); // in red text
    }
    $('#favs-menu').css("width", "0"); // sets the width of the favorites slider to 0. If the button clicked is not from favorites, or the page is larger than a portrait tablet this code is redundant. Otherwise, it forces the favorites slider closed since the user most likely just selected a stock symbol from the slider and would like to see the data behind the slider without having to click the close button.
}

// quick function to clear most of the stock data on the page. Used in the render function and other places I found it useful. Clear button calls this and a few more .empty methods.
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

// I had to clear the canvas between calling different symbols or the graphs would stack one on another and flash between them when mouse-over. Used in emptyAll() and getChartData()
const resetCanvas = function () {
    $('#chart').remove(); // removes the HTML canvas element and all its data
    $('#graph').append('<canvas id="chart"></canvas>'); // adds a new canvas
    canvas = document.querySelector('#chart'); // tried using JQuery to do this but...wouldn't work for ... reasons I guess?
    ctx = canvas.getContext('2d'); // sets chart to 2d
    ctx.canvas.width = $('#graph').width(); // resize to parent width
    ctx.canvas.height = $('#graph').height(); // resize to parent height
}

// Get data from response and set them equal to variables. I tried doing this as part of renderGraph but it wouldn't work that way. Separate it seems fine... called in render()
const getChartData = function (response) {
    resetCanvas(); // clean the canvas element of any data
    let arr = []; // empty arrays
    let y = []
    response.forEach(function (data) {
        y.push(data.marketAverage); //fill array with price data on selected stock - y axis
        arr.push(data.minute); //fill array with time data on selected stock - x axis
    })
    // console.log(arr);
    renderGraph(arr, y); // calls renderGraph using filled arrays
}

// separate function for rendering a graph. Called in getChartData() 
const renderGraph = function (arr, y) {

    var x = new Chart(ctx, { // ctx is the canvas set to 2d
        type: 'line', //sets type
        data: {
            labels: arr, // labels = x-axis
            datasets: [{
                data: y, // data = y-axis
                radius: 0, // sets the radius of circles on each data point. I don't want dots showing on the line so set to 0
            }]
        },
        options: {
            responsive: true, // makes the chart shrink when the page shrinks
            legend: {
                display: false, // gets rid of the legend label
            }
        }
    });
    $('#graph-title').text(`Market Average`); // Title of the graph...made dynamic so it comes in with the graph and disappears when not needed
    $('#graph-title').css('text-align', 'center'); // didn't bother adding this formatting to the css page since it's dynamic and only one element anyways
}

// main render() function. Most of the content on the page goes through this
const render = function (response) {
    emptyAll(); // empty stock data each time
    favsDropdown.empty(); // empties favorites so they can update if they need to
    favsMenu.empty(); // "
    let per = response.quote.changePercent; // makes the next line more readable
    per = per.toFixed(2); // changing the stock's change percent to a rounded version. I only want to show 2 decimal places
    if (response.quote.changePercent >= 0) { // If change percent is POSITIVE
        chgPer.html(`(+${per}%)`);
        chgPer.css('color', '#025928'); // render in green
    }
    else {                              // if change percent is NEGATIVE
        chgPer.html(`(${per}%)`);
        chgPer.css('color', 'red');     // render in red
    }
    let change = response.quote.change
    if (change >= 0) {                  //if change is POSITIVE
        chg.html(`+${change}`);
        chg.css('color', '#025928')    // render in green
    }
    else {                              // if change is NEGATIVE
        chg.html(`${change}`);
        chg.css('color', 'red');        //render in red
    }
    let CEO = response.company.CEO;
    if (CEO) {                                      // if CEO data is available
        ceo.text(`CEO: ${response.company.CEO}`);   // show CEO data
    }
    else {                                          // if CEO data is not available
        ceo.text(`CEO data not found`);             // display CEO data not found
    }
    if (stockList.includes(response.company.symbol)) {                                          // if the stock searched is a favorite
        name.html(`<i class="fas fa-star" id="favs-off"></i>${response.company.companyName}`);  //display a GOLD star that when clicked will toggle favorites off
    }
    else {                                                                                      // if the stock searched is NOT a favorite
        name.html(`<i class="far fa-star" id="favs-on"></i>${response.company.companyName}`);   // display a BLACK star outline when clicked will toggle favorites on
    }       
    price.text(response.quote.latestPrice);          // next bit isn't too complicated. Display all this data where it goes
    high.text(`HIGH: ${response.quote.high}`);
    low.text(`LOW: ${response.quote.low}`);
    logo.html(`<img src="${response.logo.url}"/>`);
    input.val('');
    getChartData(response.chart); // Grab chart data, this function also calls renderGraph()
    getNews(response.news) // Grab news data and render it
    favsMenu.html(`<i class="col-auto list-group-item fas fa-times fa-2x" id="close-favs"></i>`)  // This code and the code following re-sets the favorites in the slide-menu and dropdown. See this same code in document.ready above for more details
    for (let i = 0; i < stockList.length; i++) {
        favsMenu.append(`<div class="row">
            <a class="favorite col-12 list-group-item" href="#" id="${stockList[i]}">${stockList[i]}</a>
        </div>`);
        favsDropdown.append(`<a class="favorite dropdown-item" href="#" id="${stockList[i]}">${stockList[i]}</a>`);
    }
    lastSelection = response; // remember the response object globally in case we need to re-run anything before something else is input.
}

//function for getting and rendering news headlines
const getNews = function (data) {
    for (let i = 0; i < data.length; i++) { //loop through the array of news from the API
        let block = `<div class="col-12 col-md-6 col-lg-3 align-top" id="block">`; // make a 'block' to represent the visual blocking off of the page...make it responsive to smaller sizes
        block += `<div id="news-headline">
            <a href="${data[i].url}" target="_blank">${data[i].headline}</a>
        </div>
        </div>`; // all this text is HTML inserted into the page that makes a headline in a box basically. Sets it to open it's target url in a new page
        news.append(block);
    }
}

// function that controls changing stocks to and from favorites. Called when the star next to company name is clicked
const toggleFavs = function () {
    // console.log('function is running');
    if (stockList.includes(lastSelection.company.symbol)) { // if the stock IS a favorite... 
        let i = stockList.indexOf(lastSelection.company.symbol); // find where it is in the favorites array
        // console.log(stockList[i]);
        // console.log(lastSelection.company.symbol);
        stockList.splice(i, 1); // cut this stock out from the favorites array
        render(lastSelection); // re-render the page. On first look it's exactly the same as it was, except with a different star type and color next to company name, but it also re-sets the favorites slide menu and dropdown
    }
    else { // if the selected stock is NOT a favorite
        stockList.push(lastSelection.company.symbol); // push it into the favorites array
        render(lastSelection); // re-render the page. On first look it's exactly the same as it was, except with a different star type and color next to company name, but it also re-sets the favorites slide menu and dropdown
    }
    localStorage.setItem("stockList", JSON.stringify(stockList)); // key line of code here. Changes were made to the favorites list if this function was called, so after the changes are made, save them as a string in localStorage
}

// function to reset local storage
const resetLS = function () {
    localStorage.clear(); // built-in method to clear ALL local storage relating to my page
    emptyAll(); // empties the page so that...
    name.text("Local storage cleared"); // if the user is quick enough they'll see a confirmation that local storage was cleared on the page before...
    location.reload() // the page refreshes to reflect the changes in their favorites
}

$('#close-menu').on('click', function () { // literally just to close a slide-menu by setting its width to 0
    const menu = $('#side-menu');
    menu.css("width", "0");
});

$('#open-menu').on('click', function () { // opens side-menu to full screen
    const menu = $('#side-menu');
    menu.css("width", "100%");
});

favsMenu.on('click', '#close-favs', function () {// literally just to close a slide-menu by setting its width to 0
    const favs = $('#favs-menu');
    favs.css("width", "0");
})

$('#open-favs').on('click', function () { // opens side-menu to full screen
    const favs = $('#favs-menu');
    favs.css("width", "100%");
});

$('.menu-item').on('click', function () { // cool function that lights up selected API...doesn't really do anything yet though...I didn't get to that yet
    $('.menu-item').removeClass('active');
    $(this).addClass('active');
})


// all my on-click functions. last paramater is the function they run, first bit is the element you can click on, unless there are three paramaters. If there are, then I had to make something that was dynamically created clickable. In that case, the second paramater is the element you click on and the third paramater is the function that runs.
$('#submit').on('click', getInfo);
$('#clear').on('click', emptyAll);
$('#favs-dropdown').on('click', '.favorite', getFavInfo);
$('#favs-slider').on('click', '.favorite', getFavInfo);
$('#btn-bar').on('click', '.stock-btn', getFavInfo);
name.on('click', '#favs-on', toggleFavs);
name.on('click', '#favs-off', toggleFavs);
$('#reset').on('click', resetLS)