!(function(moduleName, definition) {
  // Whether to expose PasswordStrength as an AMD module
  // or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else this[moduleName] = definition();

})('passwordStrength', function definition() {

  var defaultDefinitions = (function(){
    function getFlatScore(password, regex, bonus) {
      var score = 0;
      for (var i = 0; i < password.length; i += 1) {
        if (regex.test(password[i])) {
          score = score + bonus;
        }
      }
      return score;
    }

    function getConditionalIncrementalScore(password, regex, bonus) {
      var score = getFlatScore(password, regex, bonus);

      if (score === 0) { return 0};
      return (password.length - score) * 2;
    }

    var passwordSize = function(password) {
      return password.length * 4;
    };
    var containsNumber = function(password) {
      return getFlatScore(password, /\d/, 4);
    };
    var containsLowercaseLetter = function(password) {
      return getConditionalIncrementalScore(password, /[a-z]/, 1);
    };
    var containsUppercaseLetter = function(password) {
      return getConditionalIncrementalScore(password, /[A-Z]/, 1);
    };
    var containsSymbols = function(password) {
      return getFlatScore(password, /\W/, 6);
    };

    return {
      limits : { none: 0, weak: 1, good: 29, strong: 59, veryStrong: 89},
      requirements: [ passwordSize, containsNumber, containsLowercaseLetter, containsUppercaseLetter, containsSymbols ]
    }
  }());

  var status = function(definitions) {

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
      if (rate >= definitions.limits.veryStrong) {
        replace(parent, veryStrong());
      } else if (rate >= definitions.limits.strong) {
        replace(parent, strong());
      } else if (rate >= definitions.limits.good){
        replace(parent, good());
      } else if (rate >= definitions.limits.weak){
        replace(parent, weak());
      } else {
        replace(parent, none());
      }
    };

    return {
      none : none,
      show: show,
      hide: hide,
      update: update
    }

  };

  var score = function(definitions) {

    function calculate(password) {
      var rate = 0;
      for (var i = 0; i < definitions.requirements.length; i += 1) {
        rate = rate + definitions.requirements[i](password);
      }
      return rate;
    }

    return { 
      calculate: calculate,
    };

  };

  var wrapper = function(status) {
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
  };

  var dom = function(element) {
    function parentOf(element) {
      return element.parentNode;
    };

    function addWrapperToParent(status){
      parentOf(element).appendChild(wrapper(status).passwordStrength());
    };

    function registerEvents(status, score){
      element.addEventListener('focusin', function(){
        status.show(parentOf(element));
      });
      element.addEventListener('focusout', function(){
        status.hide(parentOf(element));
      });
      element.addEventListener('input', function(){
        var rate = score.calculate(element.value);
        status.update(parentOf(element), rate);
      });
    };

    return {
      addWrapperToParent : addWrapperToParent,
      registerEvents : registerEvents
    }

  };

  function passwordStrength(element, customDefinitions) {
    var definitions = customDefinitions || defaultDefinitions;
    var definedStatus = status(definitions);
    var domElement = dom(element);

    domElement.addWrapperToParent(definedStatus);
    domElement.registerEvents(definedStatus, score(definitions));
  };

  return passwordStrength;
});
