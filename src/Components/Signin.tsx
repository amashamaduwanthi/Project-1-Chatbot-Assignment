import { useState } from "react";
import "./signin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../Firebase";
const Signin = ({ onLogin }: { onLogin: (uid: string, role: string,name:string) => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            const snapshot = await get(ref(db, `users/${uid}`));
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const role = userData.role;
                const name = userData.name || "User";
                onLogin(uid, role,name);
            } else {
                alert("No role found for user.");
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSignin} className="signin-form">
            <h2>Sign In</h2>
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
            <button type="submit">Sign In</button>
        </form>
    );
};

export default Signin;
