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
interface Props {
    chatId: string;
}
const ChatWindow = ({chatId}:Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const messagesRef = ref(db, `chats/${chatId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = data ? Object.values(data) as Message[] : [];
            setMessages(loadedMessages);
        });

        return () => unsubscribe(); // clean up listener on unmount/change
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        const botReplyText = await generateReply(input);
        const botMessage: Message = { sender: 'bot', text: botReplyText };
        const messagesRef = ref(db, `chats/${chatId}`);
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
