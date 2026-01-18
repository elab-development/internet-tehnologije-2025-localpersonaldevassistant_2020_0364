const titleSummaryPrompt = (userMessage: string, llmMessage: string) => {
  return `Task: Generate a concise title for this conversation.
Constraints: 
- Length: 2 to 5 words.
- Output: ONLY the title text.
- Format: No quotes, no punctuation, no prefixes like "Title:".

Conversation:
User: ${userMessage}
Assistant: ${llmMessage}

Title:`;
};

export default titleSummaryPrompt;
