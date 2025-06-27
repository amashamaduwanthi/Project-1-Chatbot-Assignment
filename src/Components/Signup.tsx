import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../Firebase";
import './signup.css'
const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("default");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            await set(ref(db, `users/${uid}`), {
                email,
                role,
            });

            alert("Signup successful");
        } catch (err: any) {
            alert(err.message);
        }
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
                <option value="student">Student</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="doctor">Doctor</option>
                <option value="default">Default</option>


            </select>
            <button type="submit">Sign Up</button>
        </form>

    );
};
export default Signup;
