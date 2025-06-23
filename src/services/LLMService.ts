import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCVt9L-DXviJFrp1Z6QSpqrlTDP_BdAaq8';

export const generateReply = async (userMessage: string): Promise<string> => {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: userMessage
                        }],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || "Sorry, I didn't understand that.";
    } catch (error) {
        console.error('Gemini API error:', error);
        return "Oops! Something went wrong.";
    }
};


