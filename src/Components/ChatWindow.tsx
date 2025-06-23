import { useState } from 'react';
import '../Components/ChatWindow.css';
interface Message {
    sender: 'user' | 'bot';
    text: string;
}
const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {

    };

    return (
        <div className="chat-container">
            <div className="messages">

            </div>

            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
