/* Copyright (c) 2012, Joao Alberto Vortmann
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies, 
either expressed or implied, of the FreeBSD Project.
*/

!(function (moduleName, definition) {
  // Whether to expose PasswordStrength as an AMD module
  // or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
    this[moduleName] = definition();
  }

}('passwordStrength', function definition() {

  var defaultDefinitions = (function () {
    var flatScore = function (password, regex, bonus) {
      var score = 0, i;
      for (i = 0; i < password.length; i += 1) {
        if (regex.test(password[i])) {
          score = score + bonus;
        }
      }
      return score;
    };

    var conditionalIncrementalScore = function (password, regex, bonus) {
      var score = flatScore(password, regex, bonus);

      if (score === 0) { return 0; }
      return (password.length - score) * 2;
    };

    var passwordSize = function (password) {
      return password.length * 4;
    };
    var containsNumber = function (password) {
      return flatScore(password, /\d/, 4);
    };
    var containsLowercaseLetter = function (password) {
      return conditionalIncrementalScore(password, /[a-z]/, 1);
    };
    var containsUppercaseLetter = function (password) {
      return conditionalIncrementalScore(password, /[A-Z]/, 1);
    };
    var containsSymbols = function (password) {
      return flatScore(password, /\W/, 6);
    };

    return {
      limits : { none: 0, weak: 1, good: 29, strong: 59, veryStrong: 89},
      requirements: [ passwordSize, containsNumber, containsLowercaseLetter, containsUppercaseLetter, containsSymbols ]
    };
  }());

  var status = function (definitions) {

    var innerTextNode = function (text, status) {
      var element = document.createElement("span");
      element.className = "score";
      element.innerHTML = text;
      element.classList.add(status);

      return element;
    };

    var none = function () {
      return innerTextNode("None", "none");
    };

    var weak = function () {
      return innerTextNode("Weak", "weak");
    };

    var good = function () {
      return innerTextNode("Good", "good");
    };

    var strong = function () {
      return innerTextNode("Strong", "strong");
    };

    var veryStrong = function () {
      return innerTextNode("Very Strong", "very_strong");
    };

    var show = function (parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.remove("hidden");
    };

    var hide = function (parent) {
      var element_score = parent.getElementsByClassName("score")[0];
      element_score.classList.add("hidden");
    };

    var replace = function (parent, newStatus) {
      var elementStrength = parent.getElementsByClassName("password_strength")[0];
      var elementStatus = elementStrength.getElementsByClassName("score")[0];

      elementStrength.removeChild(elementStatus);
      elementStrength.appendChild(newStatus);
    };

    var update = function (parent, rate) {
      if (rate >= definitions.limits.veryStrong) {
        replace(parent, veryStrong());
      } else if (rate >= definitions.limits.strong) {
        replace(parent, strong());
      } else if (rate >= definitions.limits.good) {
        replace(parent, good());
      } else if (rate >= definitions.limits.weak) {
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
    };

  };

  var score = function (definitions) {
    var calculate = function (password) {
      var rate = 0, i;
      for (i = 0; i < definitions.requirements.length; i += 1) {
        rate = rate + definitions.requirements[i](password);
      }
      return rate;
    };

    return {
      calculate: calculate
    };

  };

  var wrapper = function (status) {
    return {
      passwordStrength : function () {
        var inner = status.none();
        inner.classList.add("hidden");
        var wrapper = document.createElement("div");
        wrapper.className = "password_strength";
        wrapper.appendChild(inner);

        return wrapper;
      }

    };
  };

  var dom = function (element) {
    var parentOf = function (element) {
      return element.parentNode;
    };

    var addWrapperToParent = function (status) {
      parentOf(element).appendChild(wrapper(status).passwordStrength());
    };

    var registerEvents = function (status, score) {
      element.addEventListener('focusin', function () {
        status.show(parentOf(element));
      });
      element.addEventListener('focusout', function () {
        status.hide(parentOf(element));
      });
      element.addEventListener('input', function () {
        var rate = score.calculate(element.value);
        status.update(parentOf(element), rate);
      });
    };

    return {
      addWrapperToParent : addWrapperToParent,
      registerEvents : registerEvents
    };

  };

  var passwordStrength = function (element, customDefinitions) {
    var definitions = customDefinitions || defaultDefinitions;
    var definedStatus = status(definitions);
    var domElement = dom(element);

    domElement.addWrapperToParent(definedStatus);
    domElement.registerEvents(definedStatus, score(definitions));
  };

  return passwordStrength;
}));
