!(function(moduleName, definition) {
  // Whether to expose PasswordStrength as an AMD module
  // or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else this[moduleName] = definition();

})('passwordStrength', function definition() {

  function passwordStrength(element) {
    var parent = element.parentElement;
    parent.appendChild(wrapper.passwordStrength());

    element.addEventListener('focusin', function(){
      status.show(parent);
    });
    element.addEventListener('focusout', function(){
      status.hide(parent);
    });
    element.addEventListener('input', function(){
      var rate = score.calculate(element.value);
      status.update(parent, rate);
    });
  };

  var status = (function() {
    var NONE_RATE = 0;
    var WEAK_LIMIT = 1;
    var GOOD_LIMIT = 29;
    var STRONG_LIMIT = 59;
    var VERY_STRONG_LIMIT = 89;

    function innerTextNode(text, status) {
      var element = document.createElement("span");
      element.className = "score";
      element.innerHTML = text;
      element.classList.add(status);

      return element;
    };

    function none() {
      return innerTextNode("None", "none");
    };

    function weak() {
      return innerTextNode("Weak", "weak");
    };

    function good() {
      return innerTextNode("Good", "good");
    };

    function strong() {
      return innerTextNode("Strong", "strong");
    };

    function veryStrong() {
      return innerTextNode("Very Strong", "very_strong");
    };

    function show(parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.remove("hidden");
    };

    function hide(parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.add("hidden");
    };

    function replace(parent, newStatus) {
      var elementStrength = parent.getElementsByClassName("password_strength")[0];
      var elementStatus = elementStrength.getElementsByClassName("score")[0];

      elementStrength.removeChild(elementStatus);
      elementStrength.appendChild(newStatus);
    };

    function update(parent, rate) {
      if (rate >= VERY_STRONG_LIMIT) {
        replace(parent, status.veryStrong());
      } else if (rate >= STRONG_LIMIT) {
        replace(parent, status.strong());
      } else if (rate >= GOOD_LIMIT){
        replace(parent, status.good());
      } else if (rate >= WEAK_LIMIT){
        replace(parent, status.weak());
      } else {
        replace(parent, status.none());
      }
    };

    return {
      none : none,
      weak : weak,
      good : good,
      strong : strong,
      veryStrong : veryStrong,
      show: show,
      hide: hide,
      update: update
    }

  }());

  var score = (function(status) {

    var passwordSize = function(password) { 
      return password.length * 4; 
    };
    var containsNumber = function(password) {
      var score = 0;
      for (var i = 0; i < password.length; i += 1) {
        if (/\d/.test(password[i])) {
          score = score + 4;
        }
      }
      return score;
    };
    var containsLowercaseLetter = function(password) {
      var lowercaseLetters = 0;
      for (var i = 0; i < password.length; i += 1) {
        if (/[a-z]/.test(password[i])) {
          lowercaseLetters++;
        }
      }
      if (lowercaseLetters === 0) { return 0};
      return (password.length - lowercaseLetters) * 2;
    };
    var containsUppercaseLetter = function(password) {
      var uppercaseLetters = 0;
      for (var i = 0; i < password.length; i += 1) {
        if (/[A-Z]/.test(password[i])) {
          uppercaseLetters++;
        }
      }
      if (uppercaseLetters === 0) { return 0};
      return (password.length - uppercaseLetters) * 2;
    };
    var containsSymbols = function(password) {
      var symbols = 0;
      for (var i = 0; i < password.length; i += 1) {
        if (/\W/.test(password[i])) {
          symbols++;
        }
      }
      return symbols * 6;
    };

    var defaultRequirements = [ passwordSize, containsNumber, containsLowercaseLetter, containsUppercaseLetter ];

    function calculate(password) {
      var rate = 0;
      for (var i = 0; i < defaultRequirements.length; i += 1) {
        rate = rate + defaultRequirements[i](password);
      }
      return rate;
    }

    return { 
      calculate: calculate,
    };

  }(status));

  var wrapper = (function(status) {
    return {
      passwordStrength : function() {
        var inner = status.none();
        inner.classList.add("hidden");
        var wrapper = document.createElement("div");
        wrapper.className = "password_strength";
        wrapper.appendChild(inner);

        return wrapper;
      }

    };
  }(status));

  return passwordStrength;
});
