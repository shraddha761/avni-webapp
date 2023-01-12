import http from "../utils/httpClient";

const userEndpoint = "/user";

class UserService {
  static searchUsers(name, phoneNumber, email) {
    return http.getPageData(
      "user",
      `${userEndpoint}?name=${name}&phoneNumber=${phoneNumber}&email=${email}&page=${0}&size=${30}`
    );
  }
}

export default UserService;