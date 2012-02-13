!(function(moduleName, definition) {
  // Whether to expose PasswordStrength as an AMD module
  // or to the global object.
  if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else this[moduleName] = definition();

})('passwordStrength', function definition() {

  function passwordStrength(element) {
    element.appendChild(wrapper.passwordStrength());
    element.addEventListener('mouseover', function(){
      score.showScore(element);
    });
    element.addEventListener('mouseout', function(){
      score.hideScore(element);
    });
    element.addEventListener('click', function(){
      score.updateScore(element);
    });
  }

  var score = (function Score() {

    var rate = 0;

    function innerTextNode() {
      var text = document.createElement("span");
      text.className = "score hidden";

      return text;
    };

    function replaceScore(element, newScore) {
      var element_strength = element.getElementsByClassName("password_strength")[0];
      var element_score = element_strength.getElementsByClassName("score")[0];

      element_strength.removeChild(element_score);
      element_strength.appendChild(newScore);
    };

    function showScore(element) {
      var element_score = element.getElementsByClassName("score")[0];
      element_score.classList.remove("hidden");
    };

    function hideScore(element) {
      var element_score = element.getElementsByClassName("score")[0];
      element_score.classList.add("hidden");
    };

    function noneScore() {
      var text = innerTextNode();
      text.innerHTML = "None";
      text.classList.add("none");

      return text;
    };

    function weakScore() {
      var text = innerTextNode();
      text.innerHTML = "Weak";
      text.classList.add("weak");

      return text;
    };

    function goodScore() {
      var text = innerTextNode();
      text.innerHTML = "Good";
      text.classList.add("good");

      return text;
    };

    function strongScore() {
      var text = innerTextNode();
      text.innerHTML = "Strong";
      text.classList.add("strong");

      return text;
    };

    function veryStrongScore() {
      var text = innerTextNode();
      text.innerHTML = "Very Strong";
      text.classList.add("very_strong");

      return text;
    };

    function updateScore(element) {
        //if (rate === 0) {
          //replaceScore(element, goodScore());
          //rate = 1;
        //} else if (rate === 1){
          //replaceScore(element, strongScore());
          //rate = 0;
        //}
    }

    return { 
      showScore : showScore,
      hideScore : hideScore,
      noneScore : noneScore,
      updateScore : updateScore
    };

  }());


  var wrapper = (function Wrapper(score) {
    return {
      passwordStrength : function() {
        var wrapper = document.createElement("div");
        wrapper.className = "password_strength";
        wrapper.appendChild(score.noneScore());

        return wrapper;
      }

    };
  }(score));

  return passwordStrength;

});
