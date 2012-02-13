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
      score.show(parent);
    });
    element.addEventListener('focusout', function(){
      score.hide(parent);
    });
    element.addEventListener('input', function(){
      score.calculate(element.value);
      score.update(parent);
    });
  };

  var score = (function Score() {
    var NONE_RATE = 0;
    var WEAK_LIMIT = 1;
    var GOOD_LIMIT = 29;
    var STRONG_LIMIT = 59;
    var VERY_STRONG_LIMIT = 89;

    var rate = 0;

    var defaultRequirements = [
      { score: function(password) { return password.length * 4; } },
      { score: function(password) {
            var score = 0;
            for (var i = 0; i < password.length; i += 1) {
              if (/\d/.test(password[i])) {
                score = score + 4;
              }
            }
            return score;
          }
      },
      { score: function(password) {
            var lowercaseLetters = 0;
            for (var i = 0; i < password.length; i += 1) {
              if (/[a-z]/.test(password[i])) {
                lowercaseLetters++;
              }
            }
            if (lowercaseLetters === 0) { return 0};
            return (password.length - lowercaseLetters) * 2;
          }
      },
      { score: function(password) {
            var uppercaseLetters = 0;
            for (var i = 0; i < password.length; i += 1) {
              if (/[A-Z]/.test(password[i])) {
                uppercaseLetters++;
              }
            }
            if (uppercaseLetters === 0) { return 0};
            return (password.length - uppercaseLetters) * 2;
          }
      },
      { score: function(password) {
            var symbols = 0;
            for (var i = 0; i < password.length; i += 1) {
              if (/\W/.test(password[i])) {
                symbols++;
              }
            }
            return symbols * 6;
          }
      }

    ];

    function innerTextNode() {
      var text = document.createElement("span");
      text.className = "score";

      return text;
    };

    function replace(parent, newScore) {
      var element_strength = parent.getElementsByClassName("password_strength")[0];
      var element_score = element_strength.getElementsByClassName("score")[0];

      element_strength.removeChild(element_score);
      element_strength.appendChild(newScore);
    };

    function show(parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.remove("hidden");
    };

    function hide(parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.add("hidden");
    };

    function none() {
      var text = innerTextNode();
      text.innerHTML = "None";
      text.classList.add("none");

      return text;
    };

    function weak() {
      var text = innerTextNode();
      text.innerHTML = "Weak";
      text.classList.add("weak");

      return text;
    };

    function good() {
      var text = innerTextNode();
      text.innerHTML = "Good";
      text.classList.add("good");

      return text;
    };

    function strong() {
      var text = innerTextNode();
      text.innerHTML = "Strong";
      text.classList.add("strong");

      return text;
    };

    function veryStrong() {
      var text = innerTextNode();
      text.innerHTML = "Very Strong";
      text.classList.add("very_strong");

      return text;
    };

    function calculateRate(password) {
      rate = 0;
      for (var i = 0; i < defaultRequirements.length; i += 1) {
        rate = rate + defaultRequirements[i].score(password);
      }
    }

    function update(parent) {
      if (rate >= VERY_STRONG_LIMIT) {
        replace(parent, veryStrong());
      } else if (rate >= STRONG_LIMIT) {
        replace(parent, strong());
      } else if (rate >= GOOD_LIMIT){
        replace(parent, good());
      } else if (rate >= WEAK_LIMIT){
        replace(parent, weak());
      } else {
        replace(parent, none());
      }
    }

    return { 
      show: show,
      hide: hide,
      none: none,
      calculate: calculateRate,
      update: update
    };

  }());

  var wrapper = (function Wrapper(score) {
    return {
      passwordStrength : function() {
        var inner = score.none();
        inner.classList.add("hidden");
        var wrapper = document.createElement("div");
        wrapper.className = "password_strength";
        wrapper.appendChild(inner);

        return wrapper;
      }

    };
  }(score));

  return passwordStrength;
});
