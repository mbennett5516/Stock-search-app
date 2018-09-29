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