import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

function App() {
    async function logout() {
        localStorage.removeItem("token");
    }

    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/talk/login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/talk/register">Register</NavLink>
                    </li>
                    <li>
                        <Link onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/talk/login" element={<Login />} />
                <Route path="/talk/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
