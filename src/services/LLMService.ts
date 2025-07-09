import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';//is the endpoint of the Google Gemini API you're calling.
const GEMINI_API_KEY = 'AIzaSyCVt9L-DXviJFrp1Z6QSpqrlTDP_BdAaq8';//your personal key to authenticate requests to Google’s Gemini API.

export const generateReply = async (userMessage: string): Promise<string> => {
    try {
        // Sends a POST request to the Gemini API URL with the API key appended in the query string.
        //
        //     The await keyword pauses execution until the response is received.
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


