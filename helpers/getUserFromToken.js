import jwt_decode from "jwt-decode";

export default async function getUserFromToken(token) {
    const decodedToken = await jwt_decode(token);

    const decodedUser = {
        _id: decodedToken.sub,
        username: decodedToken.username,
        avatar: decodedToken.avatar,
    };

    return decodedUser;
}
