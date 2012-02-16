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

To add custom requirements to the passwordStrength meter you need to define an objetct that abide to the following interface:

    var statusObject = {
      message: "Status",
      status: "status",
      limit: 414
    };

    var minimunSize = {
      message: "Status",
      status: "status",
      valid: function(password) { return password.length > 8 }
    };

    var scoreFunction = function(password) {
      ...
      return score;
    }

    customRequirements = {
      limits: [ statusObject, ...],
      rateRequirements: [ scoreFunction, ... ]
      validationRequirements: [ minimunSize, ... ]
    }

The validationRequirements is a prioritized list of validations that will be applied before the rate is calculated. The first validation requirement that is not valid will change the status, showing the message from the 'message' field and adding the class on the 'status' field (and an extra 'invalid' class) to the 'span' element representing the strength. The score is only calculated if all validations passed.
Each rateRequirement function needs to return and integer score after evaluating the password. Each limit object encapsulates the score status that will be applied based on total score. As soon as the rate of the password is above the defined 'limit' field, this status will be set as the new password strength status. The 'message' field is the content of the status 'span' and the 'status' field is used as the class for that element. The status with the lowest limit will be used when the field is empty. (by default there is a "none" status defined with the limit:0, take a look in the code).

...and then

    var passwordElement = document.getElementById('password');
    passwordStrength(passwordElement, customRequirements);

#### How it works

After sending the element to the module, one password strength wrapper is added as a sibling of the element (it gets added to the parent of the element). This wrapper is a 'div' element that contains the score status inside and the class "password_strength" to aid on styling. This status is a 'span' element with the class "score" and the status words inside like "None", "Weak", "Good", "Strong", "Very Strong". The status 'span' element also contains the proper class representing them, to know: "none", "weak", "good", "strong" and "very_strong".

The password strength wrapper is currently hidden (adding the class 'hidden' to the score status element). When the password field is selected the password strength is shown (by removing the class 'hidden'). After each change on the password input field all the requirements are re-evaluated and the current score is calculated. With this new score, the status 'span' element is updated to reflect the current status depending on the limits that were set. 

#### Notes
* Default definitions of limits and rate requirements are provided and should be enought to start;
* A validation requirement of minimun password size (8 characters) is provided;
* One css example is provided;
* You have to provide the raw element, not the one wrapped by your favorite dom query lib. Using jQuery, for example, you'd need to do something like `var passwordElement = $('#passwordElement').get(0);`
* If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `passwordStrength`.

### Browser Compatibility
We've ran the tests in Chrome and Firefox.
If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

### License
This software is released under a FreeBSD license. Take a look in the top of 'passwordStrength.js' and the 'license' files for the disclaimer.
