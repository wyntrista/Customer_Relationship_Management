export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const token = user.accessToken || user.token;
    if (token) {
      return { Authorization: "Bearer " + token };
    }
  }
  return {};
}
