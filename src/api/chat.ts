import { useSSEResponse } from '~/utils/sse'
import type {
  ChatMessage,
  ChatModel,
  ChatStreamingCompletions,
} from '~/types'

export async function chatCompletionsApi(
  proxy: boolean,
  key: string,
  model: ChatModel,
  messages: ChatMessage[],
  onopen: () => void,
  onmessage: (completions: ChatStreamingCompletions | null) => void,
) {
  const baseUrl = proxy
    ? 'https://mys1024-chatgpt-api-proxy.deno.dev'
    : 'https://api.openai.com'

  const res = await fetch(
    `${baseUrl}/v1/chat/completions`,
    {
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
    },
  )

  onopen()
  useSSEResponse(res, {
    onmessage(field, value) {
      if (field !== 'data')
        return
      if (value === '[DONE]') {
        onmessage(null)
        return
      }
      try {
        const completions = JSON.parse(value) as ChatStreamingCompletions
        onmessage(completions)
      }
      catch (err) {
        console.error(`Cannot parse '${value}' to JSON, cause: `, err)
      }
    },
  })

  return res
}
