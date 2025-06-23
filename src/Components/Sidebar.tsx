const Sidebar = ({ onSelectChat }) => {
    const chats = [
        { id: 'default', title: 'New Chat' },
        { id: 'react-chat', title: 'React Role-Based Chatbot' },
        { id: 'npm-error', title: 'Install npm in React' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">Chats</div>
            <ul className="chat-list">
                {chats.map(chat => (
                    <li key={chat.id} onClick={() => onSelectChat(chat.id)}>{chat.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
