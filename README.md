# PasswordStrength.js #
##### Add a password strength meter to your page easily. #####

### Examples
DOM:

    <div id="someElement">
        <input type="password" id="password"></div>
    </div>

To add a password meter to this element you need to send it to passwordStrength module:

    var passwordElement = document.getElementById('password');
    passwordStrength(passwordElement);

To add custom requirements to the passwordStrength meter you need to define an objetct that abide to this interface:

    var scoreFunction = function(password) {
      ...
      return score;
    }

    customRequirements = {
      limits: { none: 0, weak: 1, good: 2, strong: 3, veryStrong: 4},
      requirements: [ scoreFunction, ... ]
    }

Each requirement function need to return and integer score after evaluating the password and each limit represents when the score status will change after the evaluation of the sum of the result of applying all the requirements functions.

...and then

    var passwordElement = document.getElementById('password');
    passwordStrength(passwordElement, customRequirements);

#### How it works

After sending the element to the module, one password strength wrapper is added as a sibling of the element (it gets added to the parent of the element). This wrapper is a 'div' element that contains the score status inside and the class "password_strength" to aid on styling. This status is a 'span' element with the class "score" and the status words inside like "None", "Weak", "Good", "Strong", "Very Strong". The status 'span' element also contains the proper class representing them, to know: "none", "weak", "good", "strong" and "very_strong".

The password strength wrapper is currently hidden (adding the class 'hidden' to the score status element). When the password field is selected the password strength is shown (by removing the class 'hidden'). After each change on the password input field all the requirements are re-evaluated and the current score is calculated. With this new score, the status 'span' element is updated to reflect the current status depending on the limits that were set. 

#### Notes
* Default definitions of limits and requirements are provided and should be enought to start;
* One css example is provided;
* You have to provide the raw element, not the one wrapped by your favorite dom query lib. Using jQuery, for example, you'd need to do something like `var passwordElement = $('#passwordElement').get(0);`
* If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `passwordStrength`.

### Browser Compatibility
We've ran the tests in Chrome and Firefox.
If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

### License
This software is released under a FreeBSD license. Take a look in the top of 'passwordStrength.js' and the 'license' files for the disclaimer.
