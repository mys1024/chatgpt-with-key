export interface JsonResponse<T = {} | []> extends Omit<Response, 'arrayBuffer' | 'blob' | 'formData' | 'text'> {
  json(): Promise<T>
}

export type ChatModel = 'gpt-4' | 'gpt-3.5-turbo'

export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatFinishReason = 'stop' | 'length' | 'content_filter' | 'null'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface ChatCompletions {
  id: string
  object: string
  model: string
  created: number
  choices: {
    index: number
    finish_reason: ChatFinishReason
    message: ChatMessage
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ChatStreamingCompletions {
  id: string
  object: string
  model: string
  created: number
  choices: {
    index: number
    finish_reason: ChatFinishReason
    delta: { role: ChatRole } | { content: string }
  }[]
}
