// Darkode button data
$(document).on('click', '#darkmode-btn', function() {
    //$('#darkmode-btn').click(function() {
        $('#sidebar-dark').toggleClass('main-sidebar elevation-4 sidebar-light-info');
        $('#sidebar-dark').toggleClass('main-sidebar sidebar-dark-primary elevation-4');
    
        $('#headbar-dark').toggleClass('main-header navbar navbar-expand navbar-white navbar-light');
        $('#headbar-dark').toggleClass('main-header navbar navbar-expand navbar-dark');
    
        $('#body-dark').toggleClass('sidebar-mini layout-navbar-fixed layout-fixed');
        $('#body-dark').toggleClass('sidebar-mini layout-fixed layout-navbar-fixed dark-mode');
    });