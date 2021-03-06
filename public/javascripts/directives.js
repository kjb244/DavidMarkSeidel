

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

app.directive('aboutDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/about.html',
        link: function($scope, elem, attrs){

        },
        controller: function($scope){



        }
    };
});

app.directive('welcomeDir', function(utilityFunctions, $timeout, $sce){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/welcome.html',
        link: function($scope, elem, attrs){
            $timeout(function(){
                $scope.iframeVideoArr = [];
                $scope.iframeId = [];
                elem.find('[data-iframe]').each(function(i, el){
                    var iframe = el.getAttribute('data-iframe');
                    var matcher = iframe.match(/(id=[\"\']+)([A-z0-9]+)[\"\']+/);
                    var id = matcher[2] ? matcher[2] : '';
                    $scope.iframeId.push(id);
                    $scope.iframeVideoArr.push($sce.trustAsHtml(iframe));
                });
            },1);

            $scope.showVideoCoverArr = $scope.copy.routes.welcome.youtubeIframeVideoInfo.map(function(e){
                return true;
            });

          $scope.videoLearnAboutMeClass = function(){
            var classes = "small-12 columns ";
            var len = $scope.copy.routes.welcome.youtubeIframeVideoInfo.length;
            if (12 % len === 0){
              classes += 'large-' + 12/len;
            }
            else {
              classes += 'large-6';
            }
            return classes;
          };

            utilityFunctions.loadYTVideoControls();
        },
        controller: function($scope){

            $scope.videoCoverClick = function(idx){
              $scope.showVideoCoverArr[idx] = false;
              utilityFunctions.playYTVideo($scope.iframeId[idx]);
            };

            $scope.initFoundation = function(last){
                if(last){
                    $(document).foundation();
                }
            };

        }
    };
});

app.directive('galleryDir', function($timeout, $sce, utilityFunctions){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/gallery.html',
        link: function($scope, elem){
            $timeout(function(){
                $scope.iframeVideoArr = [];
                elem.find('[data-iframe]').each(function(i, el){
                    var iframe = el.getAttribute('data-iframe');
                    $scope.iframeVideoArr.push($sce.trustAsHtml(iframe));
                });
            },1);

            //wait for iframe to load then mess with css
            $timeout(function(){
                var hm = {
                    small: {
                        width: '100%'
                    },
                    medium: {
                        height: '330px',
                        width: '500px'
                    },
                    large: {
                        height: '360px',
                        width: '550px'
                    }
                };

                elem.find('.video-details iframe').each(function(i, el){
                    var ss = utilityFunctions.screenSize();
                    if(ss && hm[ss]){
                        var valu = hm[ss];
                        if(valu.height){
                            el.style.height = valu.height;

                        }
                        el.style.width = valu.width;
                    }
                });


            },1000);

        },
        controller: function($scope){

            $scope.openModalArr = $scope.copy.routes.gallery.photos.map(function(){
                return false;
            });

            $scope.photoIndexClicked = 0;

            $scope.imageHash = $scope.copy.routes.gallery.photos.reduce(function(accum, e, i){
                accum[i] = e.photoDetails.map(function(e2){
                    return e2.imageLocation;
                });
                return accum;
            },{});

            $scope.photoClick = function(idx, idx2){
                $scope.openModalArr[idx] = !$scope.openModalArr[idx];
                $scope.photoIndexClicked = idx2;
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

            $scope.commaCount = function(rec){
                rec = rec || '';
                return rec.split(',').length-1;
            }

        }
    };
});

app.directive('contactDir', function(ajaxFetch, angularStore){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/contact.html',
        link: function($scope, elem, attrs){
            var copy = angularStore.getContent('copy');
            $scope.form = {};
            var checkboxArr = copy.routes.services.data.reduce(function(accum,e){
                var arr = e.points.filter(function(e2){
                    if(e2.split(',').length-1 > 7){
                        return e2;
                    }
                });
                if(arr.length){
                    accum.push(arr[0]);
                }
                return accum;

            },[]);

            $scope.form.checkboxModel = checkboxArr[0].split(',').map(function(e){
              return {name: e.trim(), value: false}
            });


        },
        controller: function($scope){
            $scope.submitForm = function(){
                ajaxFetch.getData('/submitContactInfo', 'POST', $scope.form)
                    .then(function (res) {
                        var success = res.data.indexOf('success') > -1;
                        $scope.openModal=true;
                        if(success){
                            $scope.modalHeading="Email successfully sent!";
                            $scope.modalBody="David Seidel will be in touch shortly";
                        }
                        else{
                            $scope.modalHeading="Error emailing - please try again";
                        }

                    });
            }


        }
    };
});

app.directive('cmsDir', function(ajaxFetch){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/cms.html',
        link: function($scope, elem, attrs){
            $scope.form = {};
            $scope.form.lookupCMSForm = {};
            $scope.form.choices = ['About', 'Welcome', 'Testimonial', 'Services', 'Contact' ];
            $scope.form.choicesModel = null;

            $scope.cms = {};
            $scope.authenticationError=false;

        },
        controller: function($scope){

            $scope.removeNode = function(route, masterKey, index){
                if($scope.cms.model.routes[route] && $scope.cms.model.routes[route][masterKey]){
                    if(Array.isArray($scope.cms.model.routes[route][masterKey])){
                        $scope.cms.model.routes[route][masterKey].splice(index,1);
                        $scope.updateModel();
                    }

                }
            }

            $scope.updateModel = function($event){
                var payload = angular.extend({},
                    {model: $scope.cms.model},
                    {login: $scope.form.lookupCMSForm});

                ajaxFetch.getData('/submitCmsUpdate', 'POST', payload)
                    .then(function (res) {
                        if($event){
                            $event.target.parentNode.classList.add('saved');
                            setTimeout(function(){
                                $event.target.parentNode.classList.remove('saved');
                            },3000);
                        }


                    });
            };

            $scope.submitClick = function(invalid){
                if(invalid) return false;
                ajaxFetch.getData('/getAuthenticated', 'GET', $scope.form.lookupCMSForm)
                    .then(function(res){
                       if(res.data.indexOf('success')>-1){
                           $scope.authenticationError=false;
                           ajaxFetch.getData('/getContent')
                               .then(function (res) {
                                   var payload = res.data;

                                   $scope.cms.model = payload;
                                   $scope.cms.data = true;

                                   $scope.cms.routes = {};


                               });
                       }
                       else {
                           $scope.cms.data = false;
                           $scope.authenticationError=true;
                        }
                    });


            };

            $scope.typeOf = function(obj,typ){
                if(typ === 'array'){
                    return Array.isArray(obj);
                }
                else{
                    return typeof obj === typ;
                }
            }


        }
    };
});

app.directive('testimonialDir', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: 'directive_templates/testimonials.html',
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

app.directive('nativeModalDir', function() {
    return {
        restrict: 'EA',
        scope: {
            open: '=',
            id: '@',
            heading: '<',
            body: '<',
            videosource: '@'
        },
        templateUrl: 'directive_templates/native-modal.html',
        link: function ($scope, elem, attrs) {


            $scope.$watch('open', function(newValue, oldValue) {
                var $vn = $('.video-node');
                if(newValue == true){
                    $('[data-container="native-modal"]').foundation();
                    $('#' + $scope.id + 'NativeModal').foundation('open');

                }
                else if (newValue == false){
                    //pause video when close modal
                    if($scope.videosource && $vn.length){
                        $vn.get(0).pause();
                    }
                }
            });

        },
        controller: function ($scope) {
            $scope.getVideoSrc = function (videoSrc) {
                return ('/' + videoSrc).replace('//','/');
            };

            $scope.closeModal = function(){
                $scope.open = false;

            }

        }
    }
});


app.directive('imageModalDir', function($timeout, utilityFunctions) {
    return {
        restrict: 'EA',
        scope: {
            open: '=',
            images: '<',
            index: '<',
            photoindexclicked: '<'
        },
        templateUrl: 'directive_templates/image-modal.html',
        link: function ($scope, elem, attrs) {


            $(document).on('open.zf.reveal', '[data-reveal]', function () {
                var $this = $(this);
                setTimeout(function(){
                    $this.find('.orbit-bullets button').eq($scope.photoindexclicked).trigger('click');
                },50);
            });

            //hack for modal not scrolling to top
            $timeout(function(){
                var ss = utilityFunctions.screenSize();
                var bodyHeight = document.body.scrollHeight;
                document.querySelector('html').style.height = bodyHeight + 'px';

            },1000);


            $scope.$watch('open', function(newValue, oldValue) {
                if(newValue == true){


                    var modalqs = document.querySelectorAll('[data-container="image-modal"]');
                    for(var i=0; i<modalqs.length; i++){
                        var attr = modalqs[i].getAttribute('data-reveal');
                        if (!attr){
                            modalqs[i].setAttribute('data-reveal','');
                        }
                    }

                    $('[data-container="image-modal"]').foundation();
                    $('.orbit').foundation();


                    $('#imageModal' + $scope.index).foundation('open');



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

