describe("Password Strength", function() {
  describe('when using default configuration', function () {
    beforeEach(function () {
      loadFixtures("passwordStrengthSpec.html");

    });
  
    it('should show None as its initial message', function () {
      var password = $("#password").get(0);
      passwordStrength(password);

      var message = $(".message").get(0);
      expect(message.innerHTML).toEqual("None");
    });
  });

});
