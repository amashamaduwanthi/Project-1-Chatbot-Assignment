import React from 'react';
import '../Components/Sidebar.css';

interface SidebarProps {
    onSelectChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChat }) => {
    const chats = [
        { id: 'default', title: 'New Chat' },
        { id: 'react-chat', title: 'React Role-Based Chatbot' },
        { id: 'npm-error', title: 'Install npm in React' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">Chats</div>
            <ul className="chat-list">
                {chats.map(chat => (
                    <li key={chat.id} onClick={() => onSelectChat(chat.id)} style={{ cursor: 'pointer' }}>
                        {chat.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
