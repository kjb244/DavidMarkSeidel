var app = angular.module("myApp", ["ngRoute","ngAnimate", "ngSanitize"]);

app.config(function($routeProvider) {
    $routeProvider

    .when('/', {
        templateUrl: 'route_templates/route-welcome.html',
        controller: 'ctrlMain'
    })
    .when('/welcome', {
        templateUrl: 'route_templates/route-welcome.html',
        controller: 'ctrlMain'
    })
    .when('/about', {
        templateUrl: 'route_templates/route-about.html',
        controller: 'ctrlMain'
    })
    .when('/services', {
        templateUrl: 'route_templates/route-services.html',
        controller: 'ctrlMain'
    })
    .when('/testimonial', {
        templateUrl: 'route_templates/route-testimonial.html',
        controller: 'ctrlMain'
    })
    .when('/contact', {
        templateUrl: 'route_templates/route-contact.html',
        controller: 'ctrlMain'
    })

});



app.controller("ctrlMain", function($scope,ajaxFetch, angularStore) {
    $scope.menuChange = window.location.hash.replace(/#\//g,'');
    if(angularStore.getContent('copy') === null) {
        ajaxFetch.getData('/getContent')
            .then(function (res) {
                angularStore.setContent('copy', res.data);
                $scope.copy = res.data;
                var buffer = 15;
                document.querySelector('.main-wrapper').style.minHeight = window.innerHeight + buffer + 'px';
            });
    }

});




