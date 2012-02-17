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
  if (typeof define === "function" && typeof define.amd === "object") {
    define(definition);
  } else {
    this[moduleName] = definition();
  }

}("passwordStrength", function definition() {

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
               return password.length > 4;
             }
    };

    var none = { message: "None", status: "none", limit: 0 };
    var weak = { message: "Weak", status: "weak", limit: 0.9 };
    var good = { message: "Good", status: "good", limit: 30 };
    var strong = { message: "Strong", status: "strong", limit: 60 };
    var veryStrong = { message: "Very Strong", status: "very_strong", limit: 90 };

    return {
      limits: [ none, weak, good, strong, veryStrong ],
      rates: [ passwordSize, containsNumber, containsLowercaseLetter, containsUppercaseLetter, containsSymbols ],
      validations: [ minimumPasswordSize ]
    };
  }());

  var status = function (definitions) {

    var sortedLimits = definitions.limits.reverse(function(a, b) {
      return a.limit - b.limit;
    });

    var innerMessageWrapper = function (text) {
      var messageWrapper = document.createElement("div");
      messageWrapper.className = "message";

      var message = document.createElement("span");
      message.innerHTML = text;

      messageWrapper.appendChild(message);

      return messageWrapper;
    };

    var innerScoreBarWrapper = function (score) {
      var barWrapper = document.createElement("div");
      barWrapper.className = "bar";

      var meter = document.createElement("span");
      meter.className = "meter";
      meter.innerHTML = meterBar(score);

      var bar = document.createElement("span");
      bar.className = "score";
      bar.innerHTML = score;

      barWrapper.appendChild(bar);
      barWrapper.appendChild(meter);

      return barWrapper;
    };

    var meterBar = function (score) {
      var i, text = "";
      for (i = 0; i < score; i += 1) {
        text = text.concat("-");
      }
      return text;
    };

    var wrapper = function (text, status, score) {
      var message = innerMessageWrapper(text);
      var score = innerScoreBarWrapper(score);

      var wrapperElement = document.createElement("div");
      wrapperElement.id = "password_strength";

      wrapperElement.classList.add(status);
      wrapperElement.appendChild(message);
      wrapperElement.appendChild(score);

      return wrapperElement;
    };

    var defaultWrapper = function () {
      return wrapper(sortedLimits[sortedLimits.length-1].message, sortedLimits[sortedLimits.length-1].status, 0);
    };

    var show = function () {
      var wrapper = document.getElementById("password_strength");
      wrapper.classList.remove("hidden");
    };

    var hide = function () {
      var wrapper = document.getElementById("password_strength");
      wrapper.classList.add("hidden");
    };

    var parentOf = function (element) {
      return element.parentNode;
    }

    var current = function() {
      return document.getElementById("password_strength");
    };

    var replace = function (newStatus) {
      parentOf(current()).replaceChild(newStatus, current());
    };

    var replaceForValidation = function (validation) {
      var invalidElement = wrapper(validation.message, validation.status, 0);
      invalidElement.classList.add("invalid");

      replace(invalidElement);
    };

    var replaceForRate = function (rate) {
      var i, score;
      for (i = 0; i < sortedLimits.length; i += 1) {
        score = sortedLimits[i];
        if (rate > score.limit) {
          replace(wrapper(score.message, score.status, rate));
          return;
        }
      }
      replace(defaultWrapper());
    };

    var update = function (valid, rate) {
      if (!valid.status) {
        return replaceForValidation(valid.validation);
      } else {
        return replaceForRate(rate);
      }
    };

    return {
      defaultWrapper: defaultWrapper,
      show: show,
      hide: hide,
      update: update
    };

  };

  var score = function (definitions) {
    var calculate = function (password) {
      var rate = 0, i;
      for (i = 0; i < definitions.rates.length; i += 1) {
        rate = rate + definitions.rates[i](password);
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
      for (i = 0; i < definitions.validations.length; i += 1) {
        if (!definitions.validations[i].valid(password)) {
          return { status: false, validation: definitions.validations[i] };
        };
      }
      return { status: true };
    };

    return {
      test: test
    };

  };

  var setup = function (element) {
    var parentOf = function (element) {
      return element.parentNode;
    };

    var addWrapperToParent = function (status) {
      var initStatus = status.defaultWrapper();
      initStatus.classList.add("hidden");

      parentOf(element).appendChild(initStatus);
    };

    var testAndUpdate = function (element, status, score, validator) {
        var valid = validator.test(element.value);
        var rate = score.calculate(element.value);

        status.update(valid, rate);
    };

    var registerEvents = function (status, score, validator) {
      element.onfocus = function () {
        status.show();

        testAndUpdate(element, status, score, validator);
      };
      element.onblur = function () {
        status.hide();
      };
      element.oninput = function () {
        testAndUpdate(element, status, score, validator);
      };
    };

    return {
      addWrapperToParent : addWrapperToParent,
      registerEvents : registerEvents
    };

  };

  var passwordStrength = function (element, customDefinitions) {
    var definitions = customDefinitions || defaultDefinitions;
    var definedStatus = status(definitions);
    var domElement = setup(element);

    domElement.addWrapperToParent(definedStatus);
    domElement.registerEvents(definedStatus, score(definitions), validator(definitions));
  };

  return passwordStrength;
}));
