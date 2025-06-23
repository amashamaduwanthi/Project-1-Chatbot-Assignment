import { useState } from 'react';
import ChatWindow from './Components/ChatWindow';

import './App.css';

const App = () => {

    const [selectedChat, setSelectedChat] = useState('default');
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
                <ChatWindow chatId={selectedChat} />
            </main>
        </div>
    );
};

export default App;

