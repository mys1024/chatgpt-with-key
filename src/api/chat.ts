import { fetchEventSource } from '@microsoft/fetch-event-source'

import type {
  ChatCompletions,
  ChatMessage,
  ChatStreamingCompletions,
  JsonResponse,
} from '~/types'

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

export async function chatCompletionsStreamingApi(
  key: string,
  model: 'gpt-4' | 'gpt-3.5-turbo',
  messages: ChatMessage[],
  onopen: () => void,
  onmessage: (completions: ChatStreamingCompletions | null) => void,
) {
  fetchEventSource('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    async onopen(res) {
      if (!res.ok)
        console.error('response is not ok:', res)
      onopen()
    },
    onmessage(event) {
      if (event.data === '[DONE]') {
        onmessage(null)
        return
      }
      try {
        const completions = JSON.parse(event.data) as ChatStreamingCompletions
        onmessage(completions)
      }
      catch (err) {
        console.error(`Cannot parse '${event.data}' to JSON, cause: `, err)
      }
    },
    onerror(err) {
      console.error(err)
    },
  })
}
