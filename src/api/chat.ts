import type { ChatCompletions, ChatMessage, JsonResponse } from '~/types'

export async function chatCompletionsApi(
  key: string,
  model: 'gpt-4' | 'gpt-3.5-turbo',
  messages: ChatMessage[],
): Promise<JsonResponse<ChatCompletions>> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  })
}
