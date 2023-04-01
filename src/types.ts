export interface JsonResponse<T = {} | []> extends Omit<Response, 'arrayBuffer' | 'blob' | 'formData' | 'text'> {
  json(): Promise<T>
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletions {
  id: string
  object: string
  created: number
  choices: {
    index: number
    message: ChatMessage
    finish_reason: 'stop' | 'length' | 'content_filter' | 'null'
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
