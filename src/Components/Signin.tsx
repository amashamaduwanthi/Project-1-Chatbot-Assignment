import { useState } from "react";
import "./signin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../Firebase";
const Signin = ({ onLogin }: { onLogin: (uid: string, role: string,name:string) => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // after click signIn button then trigger this function
    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //to signIn call signInWithEmailAndPassword() in firebase.
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            //get uid related to userCred
            const uid = userCred.user.uid;
            //get userData from the database according to uid
            const snapshot = await get(ref(db, `users/${uid}`));
            //check if snapshot is exists or not
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const role = userData.role;
                const name = userData.name || "User";
                //if snapshot is valid call onLogin prop
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
