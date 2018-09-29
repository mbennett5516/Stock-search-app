$('#close-menu').on('click', function(){
    const menu = $('#side-menu');
    menu.css("width", "0");
});

$('#open-menu').on('click', function(){
    const menu = $('#side-menu');
    menu.css("width", "100%");
})