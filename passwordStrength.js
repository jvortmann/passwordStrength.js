/**
 * PasswordStrength.js - add a password strength meter easily to your page
 * Copyright (C) 2012 Joao Alberto Vortmann
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY Joao Alberto Vortmann ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL Joao Alberto Vortmann BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * The views and conclusions contained in the software and documentation
 * are those of the authors and should not be interpreted as representing
 * official policies, either expressed or implied, of Joao Alberto Vortmann.
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
    var minimumPasswordSize = {
      message: "Too short",
      status: "too_short",
      valid: function (password) {
               return password.length > 8;
             }
    };

    var none = { message: "None", status: "none", limit: 0 };
    var weak = { message: "Weak", status: "weak", limit: 1 };
    var good = { message: "Good", status: "good", limit: 29 };
    var strong = { message: "Strong", status: "strong", limit: 59 };
    var veryStrong = { message: "Very Strong", status: "very_strong", limit: 89 };

    return {
      limits : [ none, weak, good, strong, veryStrong ],
      rateRequirements: [ passwordSize, containsNumber, containsLowercaseLetter, containsUppercaseLetter, containsSymbols ],
      validationRequirements: [ minimumPasswordSize ]
    };
  }());

  var status = function (definitions) {

    var sortedLimits = definitions.limits.reverse(function(a, b) {
      return a.limit - b.limit;
    });

    var innerTextNode = function (text, status) {
      var element = document.createElement("span");
      element.className = "score";
      element.innerHTML = text;
      element.classList.add(status);

      return element;
    };

    var lowestStatus = function () {
      return innerTextNode(sortedLimits[sortedLimits.length-1].message, sortedLimits[sortedLimits.length-1].status);
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

    var replaceForValidation = function (parent, validation) {
      var invalidElement = innerTextNode(validation.message, validation.status, "invalid");
      invalidElement.classList.add("invalid");

      replace(parent, invalidElement);
    };

    var replaceForRate = function (parent, rate) {
      var i, score;
      for (i = 0; i < sortedLimits.length; i += 1) {
        score = sortedLimits[i];
        if (rate >= score.limit) {
          replace(parent, innerTextNode(score.message, score.status));
          return;
        }
      }
    };

    var update = function (parent, invalid, rate) {
      if (invalid.status) {
        return replaceForValidation(parent, invalid.validation);
      } else {
        return replaceForRate(parent, rate);
      }
    };

    return {
      lowestStatus: lowestStatus,
      show: show,
      hide: hide,
      update: update
    };

  };

  var score = function (definitions) {
    var calculate = function (password) {
      var rate = 0, i;
      for (i = 0; i < definitions.rateRequirements.length; i += 1) {
        rate = rate + definitions.rateRequirements[i](password);
      }
      return rate;
    };

    return {
      calculate: calculate
    };

  };

  var validator = function (definitions) {
    var test = function (password) {
      var i;
      for (i = 0; i < definitions.validationRequirements.length; i += 1) {
        if (!definitions.validationRequirements[i].valid(password)) {
          return { status: true, validation: definitions.validationRequirements[i] };
        };
      }
      return { status: false };
    };

    return {
      test: test
    };

  };

  var wrapper = function (status) {
    return {
      passwordStrength : function () {
        var inner = status.lowestStatus();
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

    var testAndUpdate = function (element, status, score, validator) {
        var invalid = validator.test(element.value);
        var rate = score.calculate(element.value);

        status.update(parentOf(element), invalid, rate);
    };

    var registerEvents = function (status, score, validator) {
      element.addEventListener('focusin', function () {
        status.show(parentOf(element));

        testAndUpdate(element, status, score, validator);
      });
      element.addEventListener('focusout', function () {
        status.hide(parentOf(element));
      });
      element.addEventListener('input', function () {
        testAndUpdate(element, status, score, validator);
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
    domElement.registerEvents(definedStatus, score(definitions), validator(definitions));
  };

  return passwordStrength;
}));
