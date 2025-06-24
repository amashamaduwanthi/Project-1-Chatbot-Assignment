import { useState } from 'react';
import ChatWindow from './Components/ChatWindow';
import Signup from './Components/Signup';
import './App.css';

const App = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [showSignup, setShowSignup] = useState(false);
    const [selectedChat, setSelectedChat] = useState('default');

    if (!userId) {
        return (
            <div>
                {showSignup ? (
                    <>
                        <Signup onSignup={setUserId} />
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => setShowSignup(false)}>Login</button>
                        </p>
                    </>
                ) : (
                    <>

                        <p>
                            Don't have an account?{' '}
                            <button onClick={() => setShowSignup(true)}>Sign up</button>
                        </p>
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


