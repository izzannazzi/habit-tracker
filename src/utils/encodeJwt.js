import sign from "jwt-encode";
const secret = "secret";
export const encodeUser = (data) => {
  const jwt = sign(data, secret);

  sessionStorage.setItem("auth", jwt);
};
