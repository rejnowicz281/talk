import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
                <h2>A chatter in:</h2>
                <ul>
                    {user.chatterRooms.map((room) => (
                        <li key={room._id}>
                            <Link to={"/talk/rooms/" + room._id}>
                                {room.name} | Admin ({room.admin.username})
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Profile;
