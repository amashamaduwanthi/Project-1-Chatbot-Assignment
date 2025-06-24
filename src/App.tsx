import { useState } from 'react';
import ChatWindow from './Components/ChatWindow';
import Signup from './Components/Signup';
import Login from './Components/Signin.tsx'
import './App.css';

const App = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [showSignup, setShowSignup] = useState(false);
    const [selectedChat, setSelectedChat] = useState('default');

    if (!userId) {
        return (
            <div className="auth-wrapper">
                {showSignup ? (
                    <>
                        <Signup onSignup={setUserId} />
                        <div className="switch-auth">
                            <span>Already have an account? </span>
                            <button onClick={() => setShowSignup(false)}>Login</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Login onLogin={setUserId} />
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
                <ChatWindow chatId={selectedChat}  />
            </main>
        </div>
    );
};

export default App;


