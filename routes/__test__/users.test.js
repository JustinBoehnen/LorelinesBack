import axios from "axios";
import MockAdapter from "axious-mock-adapter";

it("Calls axios to add simple user", () => {
  var mock = new MockAdapter(axios);
  const ret = mock.onSave(
    `https://lorelines-expressapi.herokuapp.com/api/users/`,
    {
      name: "unit_test_user1",
      email: "unit_test_email1@email.com",
      password: "unit_test_password1",
    }
  );
});
