
app.service('angularStore', function(){
    var content = {};
    var getContent = function(key){
        return content[key] || null;
    }

    var setContent = function(key, cont){
        content[key] = cont;
    }

    return {
        getContent: getContent,
        setContent: setContent
    }

})

app.service('utilityFunctions', function(){

    this.scrollTop = function(element, speed){
        speed = speed || 500;

        var finalY = 0;
        var ping = 20;
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        if (element){
            if(element === 'top') finalY = 0;
            else {
                var el = document.querySelector(element);
                if (el) {
                    finalY = el.getBoundingClientRect().top;
                }
            }
        }
        var diff = top - finalY;
        if (diff < 0) return;
        if (top === 0) return;
        var times = speed/ping;
        var interval = top/times;

        var int = setInterval(runInterval, ping);
        var i=1;
        function runInterval(){
            if (i*interval <= top){
                window.scrollTo(0,top - (i*interval));
                i++;
            }
            else{
                clearInterval(int);
            }
        }



    };

  this.getQueryParams =  function(){
    var hash = window.location.hash;
    var matchArr = hash.match(/(\?)(.*)/);
    if (matchArr && matchArr[2]){
      return matchArr[2].split('&')
      .map(function(e){ return [e.split('=')[0], e.split('=')[1]]})
      .reduce(function(e,i,a){e[i[0]]= i[1]; return e},{});

    }
    return false;
  };

  this.getPosition = function(element){
      var xPosition = 0;
      var yPosition = 0;

      while(element) {
          xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }
      return { x: xPosition, y: yPosition };
  };

  this.debounce = function(func, wait, immediate){
      var timeout;
      return function() {
          var context = this, args = arguments;
          var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
      };
  }

  this.screenSize = function(){
      var width = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth;
      if (width >= 1024){
          return 'large';
      }
      else if (width >= 640){
          return 'medium';
      }
      return 'small';
  }

});

app.service("ajaxFetch", function($http) {
  this.getData= function(endpoint, type, data){
    type = type || 'GET';
    data = data || {};

    if ('GET' === type){
      return $http.get(endpoint, {params:  data }  );
    }
    else if ('POST' === type){
      return $http.post(endpoint, { 'data': data} , { headers: { 'Content-Type': 'application/json' } } );
    }
  }

});