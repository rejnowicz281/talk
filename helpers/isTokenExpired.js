import jwt_decode from "jwt-decode";

export default function isTokenExpired(token) {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
}
