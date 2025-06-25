import { useState } from 'react';
import ChatWindow from './Components/ChatWindow';
import Signup from './Components/Signup';
import Login from './Components/Signin.tsx'
import './App.css';
import { auth, db } from './Firebase';
import { ref, get } from 'firebase/database';

const App = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('guest');
    const [userName, setUserName] = useState<string>('User');
    const [showSignup, setShowSignup] = useState(false);
    const [selectedChat, setSelectedChat] = useState('default');

    const handleUserLogin = async (uid: string, role?: string, name?: string) => {
        setUserId(uid);

        try {
            const snapshot = await get(ref(db, `users/${uid}`));
            const data = snapshot.val();
            if (data?.role) {
                setUserRole(data.role);
                setUserName(data.name || 'User');
                setSelectedChat(data.role); //  set initial chat to role
            } else {
                setUserRole('guest');
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            setUserRole('guest');
        }
    };

    if (!userId) {
        return (
            <div className="auth-wrapper">
                {showSignup ? (
                    <>
                        <Signup onSignup={(uid) => handleUserLogin(uid)} />
                        <div className="switch-auth">
                            <span>Already have an account? </span>
                            <button onClick={() => setShowSignup(false)}>Login</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Login onLogin={(uid, role, name) => handleUserLogin(uid, role, name)} />
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
                <h2 className="sidebar-header">Chats</h2>
                <ul className="chat-list">
                    <li className={selectedChat === 'default' ? 'active' : ''} onClick={() => setSelectedChat('default')}>
                        Default
                    </li>
                    <li className={selectedChat === 'counseling' ? 'active' : ''} onClick={() => setSelectedChat('counseling')}>
                        Counseling
                    </li>
                    <li className={selectedChat === 'friend' ? 'active' : ''} onClick={() => setSelectedChat('friend')}>
                        Friend
                    </li>
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
                <ChatWindow chatId={selectedChat} userRole={userRole} userName={userName} />
            </main>
        </div>
    );
};

export default App;


