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

#### Notes
* You have to provide the raw element, not the one wrapped by your favorite dom query lib. Using jQuery, for example, you'd need to do something like `var passwordElement = $('#passwordElement').get(0);`
* If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `passwordStrength`.

### Browser Compatibility
We've ran the tests in Chrome and Firefox.
If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

### License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.
