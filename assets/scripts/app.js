const name = $('#name');
const ceo = $('#ceo');
const price = $('#price');
const chg = $('#chg');
const chgPer = $('#chgPer');
const high = $('#high');
const low = $('#low');
const logo = $('#logo');

const getInfo = function(){

    const stockSymbol = $('#symbol-input').val();
    const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,logo,news,company,chart&range=1d&last=5`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response);
        render(response);
    })
}

const emptyAll = function(){
    name.empty();
    ceo.empty();
    price.empty();
    chg.empty();
    chgPer.empty();
    high.empty();
    low.empty();
    logo.empty();
}

const render = function(response){
    emptyAll();
    name.text(response.company.companyName)
    ceo.text(response.company.CEO)
    price.text(response.quote.latestPrice);
    chg.text(response.quote.change);
    chgPer.text(response.quote.changePercent)
    high.text(response.quote.high);
    low.text(response.quote.low);
    logo.html(`<img src="${response.logo.url}"/>`);
}

$('#close-menu').on('click', function(){
    const menu = $('#side-menu');
    menu.css("width", "0");
});

$('#open-menu').on('click', function(){
    const menu = $('#side-menu');
    menu.css("width", "100%");
});

$('#close-favs').on('click', function(){
    const favs = $('#favs-menu');
    favs.css("width", "0");
})

$('#open-favs').on('click', function(){
    const favs = $('#favs-menu');
    favs.css("width", "100%");
});

$('.menu-item').on('click', function(){
    $('.menu-item').removeClass('active');
    $(this).addClass('active');
})

$('#submit').on('click', getInfo);