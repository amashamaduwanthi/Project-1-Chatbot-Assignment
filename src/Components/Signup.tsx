import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../Firebase";
import './signup.css'

interface SignupProps {
    onSignup: (uid: string) => void;  // Declare onSignup prop
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
    //assign user credentials into the useState hook (input karapu user credentials set method through hooks walata assign karanwa.)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("default");


    //after click signup button trigger handleSignup method.(signup button eka click karata passe handleSignup method eka call wenwa.)
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //user credentials send to the firebase Authentication using 'createUserWithEmailAndPassword()'.(userge credentials firebase authentication ekata save karanna call karanne me method eka)
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            //get uid related to userCred (userCred ta adala uid eka gannawa.)
            const uid = userCred.user.uid;
            //set email and role according to uid (uid ta anuwa email,role eka database ekata set karanwa)
            await set(ref(db, `users/${uid}`), {
                email,
                role,
            });

            alert("Signup successful");
            onSignup(uid);  // Notify parent about the new user ID
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        // enter user credentials into the input fields.(userge email,password and role eka input field walata enter karranwa.)
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
