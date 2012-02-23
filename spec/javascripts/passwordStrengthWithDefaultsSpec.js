describe("Password Strength", function() {
  describe("when using default configuration", function () {
    var passwordField;
    var meter = {
      wrapped: function() { return $('#password_strength'); },
      raw: function() { return $('#password_strength').get(0); }
    };

    beforeEach(function () {
      loadFixtures("passwordStrengthSpec.html");
      passwordField = $("#password").get(0);
      passwordStrength(passwordField, defaultPasswordStrengthDefinitions);
    });

    it('should be hidden by default', function () {
      expect(meter.wrapped()).toHaveClass("hidden");
    });

    it('should not be hidden when focus', function () {
      passwordField.focus();
      expect(meter.wrapped()).not.toHaveClass("hidden");
    });

    it('should be hidden again after blur', function () {
      passwordField.focus();
      passwordField.blur();
      expect(meter.wrapped()).toHaveClass("hidden");
    });

    it("should show 'None' as its initial message", function () {
      expect($(".message")).toHaveText("None");
    });

    it("should show 'Too Short' when there is less than 4 chars", function () {
      passwordField.focus();
      expect($(".message")).toHaveText("Too short");
      expect(meter.wrapped()).toHaveClass("too_short");
    });

    it("should show 'Weak' after entering 5 letters", function () {
      passwordField.value = "aaaaa"
      passwordField.focus();

      expect($(".message")).toHaveText("Weak");
      expect($(".score")).toHaveText("20");
      expect(meter.wrapped()).toHaveClass("weak");
    });

    it("should show 'Good' after entering 3 letters and 2 digits", function () {
      passwordField.value = "aaa12"
      passwordField.focus();

      expect($(".message")).toHaveText("Good");
      expect($(".score")).toHaveText("32");
      expect(meter.wrapped()).toHaveClass("good");
    });

    it("should show 'Strong' after entering 3 lowercase letters, 3 digits and 2 uppercase letters", function () {
      passwordField.value = "abc123AB"
      passwordField.focus();

      expect($(".message")).toHaveText("Strong");
      expect($(".score")).toHaveText("66");
      expect(meter.wrapped()).toHaveClass("strong");
    });

    it("should show 'Very Strong' after entering 3 lowercase letters, 2 uppercase letters, a symbol and 4 digits", function () {
      passwordField.value = "abcDE^1234"
      passwordField.focus();

      expect($(".message")).toHaveText("Very Strong");
      expect($(".score")).toHaveText("92");
      expect(meter.wrapped()).toHaveClass("very_strong");
    });
  });

});
