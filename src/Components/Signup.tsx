import { useState } from "react";
const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("counselor");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <form onSubmit={handleSignup} className="signup-form">
            <h2>Sign Up</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="counselor">Counselor</option>
                <option value="teacher">Teacher</option>
                <option value="friend">Friend</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>

    );
};
export default Signup;
