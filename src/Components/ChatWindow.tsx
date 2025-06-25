import {useEffect, useRef, useState} from 'react';
import '../Components/ChatWindow.css';
import '../services/LLMService.ts'
import {generateReply} from "../services/LLMService.ts";
import { ref, push, onValue } from "firebase/database";
import { db } from "../Firebase.ts";
import {getPromptByRole} from "../utils/getPromptByRole.ts";
import { MdPerson } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    timestamp?: number;
}
interface Props {
    chatId: string;
    userRole: string;
    userName: string;
}
const ChatWindow = ({chatId,userRole}:Props) => {
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

        return () => unsubscribe();
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const timestamp = Date.now();
        const userMessage: Message = { sender: 'user', text: input,timestamp };

        //  Generate role-specific prompt
        const rolePrompt = getPromptByRole(userRole, input);
        //  Send rolePrompt to Gemini API
        const botReplyText = await generateReply(rolePrompt);
        const botMessage: Message = { sender: 'bot', text: botReplyText,timestamp: Date.now() };
        const messagesRef = ref(db, `chats/${chatId}`);
        push(messagesRef, userMessage);
        push(messagesRef, botMessage);

        setInput('')
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        <div className="avatar">
                            {msg.sender === 'user' ? <MdPerson /> : <FaRobot />}
                        </div>
                        <div className="message-content">
                            <div className="bubble">{msg.text}</div>
                            {msg.timestamp && (
                                <div className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>

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
