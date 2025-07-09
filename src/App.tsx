import React, { useState } from 'react';
import ChatWindow from './Components/ChatWindow';
import Signup from './Components/Signup';
import Login from './Components/Signin';
import './App.css';
import { auth, db } from './Firebase';
import { ref, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('guest');
    const [userName, setUserName] = useState<string>('User');
    const [showSignup, setShowSignup] = useState(false);
    const [selectedChat, setSelectedChat] = useState<string>('default');
    const navigate = useNavigate();

    // Remove unused parameters role and name from here
    const handleUserLogin = async (uid: string) => {
        //Sets the current logged-in user's ID
        setUserId(uid);

        try {
            //Uses Firebase's get() function to read data from the path users/{uid}
            const snapshot = await get(ref(db, `users/${uid}`));
            //Extracts the actual data
            const data = snapshot.val();
            // Checks if the role field exists in the data.
            if (data?.role) {
                //Updates the userRole state to the value received from Firebase
                setUserRole(data.role);
                // Sets the user’s name from Firebase.
                setUserName(data.name || 'User');
                //This sets the default selected chat to match the user’s role.
                setSelectedChat(data.role); // set initial chat to role
            } else {
                setUserRole('guest');
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            setUserRole('guest');
        }
    };

    const handleLogout = async () => {
       //user out using Firebase Authentication’s signOut() function.
        await signOut(auth);
        setUserId(null);
        //Sets the user’s role to 'guest', indicating a non-logged-in or anonymous user.
        setUserRole('guest');
        setUserName('User');
        navigate('/'); // or navigate('/signin') if routing defined
    };

    if (!userId) {
        return (
            <div className="auth-wrapper">
                {showSignup ? (
                    <>
                        {/* Explicitly type uid parameter */}
                        <Signup onSignup={(uid: string) => handleUserLogin(uid)} />
                        <div className="switch-auth">
                            <span>Already have an account? </span>
                            <button onClick={() => setShowSignup(false)}>Login</button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* onLogin function only needs uid, remove role and name */}
                        <Login onLogin={(uid: string) => handleUserLogin(uid)} />
                        <div className="switch-auth">
                            <span>Don't have an account? </span>
                            <button onClick={() => setShowSignup(true)}>Sign up</button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className="sidebar-header">Chats</h2>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </div>

                <ul className="chat-list">
                    {[
                        'counselor',
                        'teacher',
                        'friend',
                        'student',
                        'developer',
                        'designer',
                        'doctor',
                        'default',
                    ].map((role) => (
                        <li
                            key={role}
                            className={selectedChat === role ? 'active' : ''}
                            onClick={() => setSelectedChat(role)}
                            style={{ cursor: 'pointer' }}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="chat-panel">
                <div className="chat-header">
                    <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                        <h3>{userName}</h3>
                        <p>{userRole}</p>
                    </div>
                </div>
                <ChatWindow chatId={userId} userRole={selectedChat} userName={userName} />

            </main>
        </div>
    );
};

export default App;
