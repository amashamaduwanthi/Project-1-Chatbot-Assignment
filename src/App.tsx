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
    const [showSignup, setShowSignup] = useState(false);
    const [selectedChat, setSelectedChat] = useState('default');

    const handleUserLogin = async (uid: string) => {
        setUserId(uid);

        try {
            const snapshot = await get(ref(db, `users/${uid}`));
            const data = snapshot.val();
            if (data?.role) {
                setUserRole(data.role);
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
                        <Signup onSignup={handleUserLogin} />
                        <div className="switch-auth">
                            <span>Already have an account? </span>
                            <button onClick={() => setShowSignup(false)}>Login</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Login onLogin={handleUserLogin} />
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
                <ChatWindow chatId={selectedChat} userRole={userRole} />
            </main>
        </div>
    );
};

export default App;


