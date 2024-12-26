interface ExplanationParams {
  userAnswer?: string;
  correctAnswer: string;
  definition: string;
  apiKey: string;
  model?: string;
}

export class ExplanationService {
  static async getExplanation(params: ExplanationParams): Promise<string> {
    const { userAnswer, correctAnswer, definition, apiKey, model = 'llama-3.3-70b-versatile' } = params;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: "user",
            content: `As an English teacher, ${userAnswer ? 'compare these two answers' : 'explain this answer'}:
              Correct answer: "${correctAnswer}"
              Definition of correct answer: "${definition}"
              ${userAnswer ? `User's answer: "${userAnswer}"
              Provide a clear and concise explanation of the mistake.` : 'Explain this answer and its usage.'}
              Keep it concise and brief.
              Please explain in Vietnamese language for Vietnamese learners.

              Then provide an example English sentence using the correct answer, along with its translation in Vietnamese.
              You can provide some English vocabulary phrases that use the correct answer to help the Vietnamese learners understand it.
              
              Also, list some synonyms (similar words) of "${correctAnswer}" and explain how they are different in usage.
              
              Please respond in Vietnamese language.`
          }]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Failed to get explanation:', error);
      return 'Không thể lấy được giải thích lúc này.';
    }
  }
} 