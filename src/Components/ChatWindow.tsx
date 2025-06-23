import {useEffect, useRef, useState} from 'react';
import '../Components/ChatWindow.css';
import '../services/LLMService.ts'
import {generateReply} from "../services/LLMService.ts";
import { ref, push, onValue } from "firebase/database";
import { db } from "../Firebase.ts";

interface Message {
    sender: 'user' | 'bot';
    text: string;
}
const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const messagesRef = ref(db, "chats/default");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.values(data) as Message[];
                setMessages(loadedMessages);
            }
        });
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        const botReplyText = await generateReply(input);
        const botMessage: Message = { sender: 'bot', text: botReplyText };
        setMessages(prev => [...prev, botMessage]);

        const messagesRef = ref(db, "chats/default");
        push(messagesRef, userMessage);
        push(messagesRef, botMessage);
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />

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
