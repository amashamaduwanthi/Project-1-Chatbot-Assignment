export const getPromptByRole = (role: string, input: string): string => {
    switch (role) {
        case "counselor":
            return `"You are a professional psychology counselor. Only answer mental health-related questions. Do NOT answer personal or romantic questions. If the question is inappropriate, reply kindly but refuse."
: "${input}"`;
        case "teacher":
            return `You are a knowledgeable teacher. Explain clearly: "${input}"`;
        case "friend":
            return `You are a friendly companion. Respond warmly: "${input}"`;
        default:
            return `You are a helpful assistant. Respond to: "${input}"`;
    }
};
