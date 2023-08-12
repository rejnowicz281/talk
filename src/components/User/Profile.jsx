import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserData } from "../../../helpers/API";

function Profile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const res = await fetchUserData(username);

            if (res.status === 200) setUser(res.data.user);
            else navigate("/talk");
        }

        getUser();
    }, [username]);

    if (user) {
        return (
            <div>
                <h1>This is {username}'s Profile</h1>
            </div>
        );
    }
}

export default Profile;
