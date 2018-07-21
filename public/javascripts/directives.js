

app.directive('navBarDir', function($timeout){
  return {
    restrict: 'EA',
    scope: false,
    templateUrl: 'directive_templates/nav-bar.html',
    link: function($scope, elem, attrs){
        $(document).foundation();

    },
    controller: function($scope, angularStore, utilityFunctions){


        $scope.$on('footerLinkClick', function(event, hash){
            var copy = angularStore.getContent('copy');
            copy = copy.navBar;
            var linkElm = copy.links.filter(function(e){
                return hash.indexOf(e.route) > -1;
            });


            utilityFunctions.scrollTop('top', 400);

            setTimeout(function(){
                window.location.hash = hash;
                $scope.menuChangeClick(linkElm[0].route);

            },400);


        });

        $scope.menuChangeClick = function(route){
            $('#offCanvasLeft').foundation('close');
            window.location.hash = '#/' + route;

        }

    }
  };
});

app.directive('footerDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/footer.html',
        link: function($scope, elem, attrs){


        },
        controller: function($scope){
            $scope.now = function(){
                return new Date();
            }

            $scope.hashChange = function(hash){
                $scope.$emit('footerLinkClick', hash);
            }


        }
    };
});

app.directive('welcomeDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/welcome.html',
        link: function($scope, elem, attrs){

        },
        controller: function($scope){

            $scope.initFoundation = function(last){
                if(last){
                    $(document).foundation();
                }
            }

        }
    };
});

app.directive('galleryDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/gallery.html',
        link: function($scope, elem, attrs){


        },
        controller: function($scope, $timeout){

            $scope.openModalArr = $scope.copy.routes.gallery.photos.map(function(){
                return false;
            });

            $scope.imageHash = $scope.copy.routes.gallery.photos.reduce(function(accum, e, i){
                accum[i] = e.photoDetails.map(function(e2){
                    return e2.imageLocation;
                });
                return accum;
            },{});

            $scope.photoClick = function(idx){
                $scope.openModalArr[idx] = !$scope.openModalArr[idx];
            };

            $scope.initImagesCss = function(run){
                if(run){
                    $timeout(function(){
                        var images = document.querySelectorAll('.image-div');

                        for(var i=0; i<images.length; i++){
                            var src = images[i].getAttribute('data-src');
                            images[i].style.backgroundImage = "url('" + src + "')";
                        }
                    },1);

                }

            }




        }
    };
});

app.directive('servicesDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/services.html',
        link: function($scope, elem, attrs){

        },
        controller: function($scope){



        }
    };
});

app.directive('contactDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/contact.html',
        link: function($scope, elem, attrs){
            $scope.form = {};

        },
        controller: function($scope){



        }
    };
});

app.directive('testimonialDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/testimonial.html',
        link: function($scope, elem, attrs){$scope.form = {};

        },
        controller: function($scope){



        }
    };
});



app.directive('modalOverlayDir', function($timeout){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/modal-overlay.html',
        link: function($scope, elem, attrs){
            $scope.showModal = false;
            $timeout(function(){
                if(window.location.origin.indexOf('localhost') > -1){
                    document.querySelector('body .overlay').classList.add('hidden');
                    document.querySelector('body').classList.remove('hide-scroll')
                    return true;
                }

                document.querySelector('body').classList.add('hide-scroll');
                $scope.showModal=true;
                
            },1000);

        },
        controller: function($scope){
            $scope.inputs = [];
            $scope.submitModal = function(){
                if ($scope.inputs[0] === 'test') {
                    document.querySelector('body .overlay').classList.add('hidden');
                    document.querySelector('body').classList.remove('hide-scroll');
                    $scope.showModal=false;
                }
            }

        }
    };
});

app.directive('imageModalDir', function() {
    return {
        restrict: 'EA',
        scope: {
            open: '=',
            images: '=',
            index: '='
        },
        templateUrl: 'directive_templates/image-modal.html',
        link: function ($scope, elem, attrs) {

            $scope.$watch('open', function(newValue, oldValue) {
                if(newValue == true){

                    var modalqs = document.querySelectorAll('[data-container="image-modal"]');
                    for(var i=0; i<modalqs.length; i++){
                        var attr = modalqs[i].getAttribute('data-reveal');
                        if (!attr){
                            modalqs[i].setAttribute('data-reveal','');
                        }
                    }

                    $(document).foundation();
                    $('#exampleModal' + $scope.index).foundation('open');

                }
            });

        },
        controller: function ($scope) {
            $scope.closeModal = function(){
                $scope.open = false;
            }
        }
    }
});

app.directive('spinnerOverlayDir', function(){
    return {
        restrict: 'EA',
        scope: {
            toggle: '='
        },
        link: function($scope, elem, attrs){
            var spinnerOverlay = document.createElement('div');
            spinnerOverlay.setAttribute('data','spinner-overlay');
            spinnerOverlay.classList.add('hide');
            spinnerOverlay.style.cssText = 'top: 0; position: fixed; height: 100%; background-color: gray; width: 100%; opacity: .7';
            document.body.appendChild(spinnerOverlay);

            var spinnerOverlaySpinner = document.createElement('div');
            spinnerOverlaySpinner.setAttribute('data','spinner-modal');
            spinnerOverlaySpinner.classList.add('hide');
            spinnerOverlaySpinner.style.cssText = 'height: 100%; position: fixed; top: 0; left: 0; width: 100%;';
            var spinnerOverlaySpinnerChild = document.createElement('div');
            spinnerOverlaySpinnerChild.innerHTML = '<div class="wrapper" style="margin: auto; width: 80%; background-color: white; padding: 30px; border-radius: 5px; "><div class="loader"></div><div class="loading-text" style="text-align: center; margin-top: 10px;">Loading...</div></div></div>';
            spinnerOverlaySpinnerChild.style.cssText = 'position: absolute; width:100%; color: #7676d0';
            spinnerOverlaySpinner.appendChild(spinnerOverlaySpinnerChild);
            document.body.appendChild(spinnerOverlaySpinner);


        },
        controller: function($scope){

            $scope.$watch('toggle', function(newVal){
                var spinnerModal = document.querySelector('[data="spinner-modal"]');
                var spinnerOverlay = document.querySelector('[data="spinner-overlay"]');
                var spinnerLoadingText = spinnerModal.querySelector('.loading-text');
                if (spinnerModal === null || spinnerOverlay === null) return false;
                if (newVal === true){
                    spinnerModal.classList.remove('hide');
                    spinnerOverlay.classList.remove('hide');
                    //add in animation class
                    spinnerLoadingText.classList.add('loading-text-animation');
                    var windowHeight = window.innerHeight;
                    var wrapperHeight = document.querySelector('[data="spinner-modal"] .wrapper').clientHeight;
                    var topPos = (windowHeight - wrapperHeight) /2;
                    document.querySelector('[data="spinner-modal"] .wrapper').parentNode.style.top = topPos + 'px';

                }
                else{
                    spinnerModal.classList.add('hide');
                    spinnerOverlay.classList.add('hide');
                    spinnerLoadingText.classList.remove('loading-text-animation');
                }
            });


        }
    };
});

