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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);//scroll auto-down karana ref ekk
    // // trigger all messages related to specific role and specific user.user
    // useEffect(() => {
    //     //make the path as a references of realtime database message
    //     const messagesRef = ref(db, `chats/${chatId}/${userRole}/messages`);
    //     // This listens for any updates to the messages in the database
    //     const unsubscribe = onValue(messagesRef, (snapshot) => {
    //         //retrieves the actual data from the database
    //         const data = snapshot.val();
    //         const loadedMessages = data ? Object.values(data) as Message[] : [];
    //         setMessages(loadedMessages);
    //     });
    //     //removes the Firebase listener when the component unmounts
    //     return () => unsubscribe();
    // }, [chatId]);//useEffect re-runs only when chatId changes
    useEffect(() => {
        const messagesRef = ref(db, `chats/${chatId}/${userRole}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Loaded messages for", chatId, userRole, ":", data); //
            const loadedMessages = data ? Object.values(data) as Message[] : [];
            setMessages(loadedMessages);
        });

        return () => unsubscribe();
    }, [chatId, userRole]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleSend = async () => {
        //If the input box is empty or only contains spaces, this line stops the function
        if (!input.trim()) return;
        //Gets the current time in milliseconds
        const timestamp = Date.now();
        // Creates a message object called userMessage,sender ="user"
        const userMessage: Message = { sender: 'user', text: input,timestamp };
        //  Generate role-specific prompt
        const rolePrompt = getPromptByRole(userRole, input);
        //  Send rolePrompt to Gemini API
        const botReplyText = await generateReply(rolePrompt);
        // Creates a second message object called botMessage,sender="Bot"
        const botMessage: Message = { sender: 'bot', text: botReplyText,timestamp: Date.now() };
        // Creates a Firebase database reference to the chat path where messages will be saved.
        const messagesRef = ref(db, `chats/${chatId}/${userRole}/messages`);
        //Saves both userMessage and botMessage to the Firebase Realtime Database under that chat path.
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
