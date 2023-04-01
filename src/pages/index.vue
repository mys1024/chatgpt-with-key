<script lang="ts" setup>
import { ref } from 'vue'

import { useChatStore } from '~/stores/chat'
import { chatCompletionsStreamingApi } from '~/api/chat'
import type { ChatMessage, ChatModel, ChatRole } from '~/types'

const chatStore = useChatStore()

const model = ref<ChatModel>('gpt-3.5-turbo')
const userInput = ref('')
const historyMessages = ref<ChatMessage[]>([])
const streaming = ref(false)
const streamingRole = ref<ChatRole>('assistant')
const streamingContent = ref('')

function toggleModel() {
  model.value = model.value === 'gpt-4' ? 'gpt-3.5-turbo' : 'gpt-4'
}

async function send() {
  // create user message
  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }
  historyMessages.value.push(userMessage)
  userInput.value = ''
  // receive assistant message
  await new Promise<void>((resolve) => {
    chatCompletionsStreamingApi(
      chatStore.key,
      model.value,
      historyMessages.value,
      () => streaming.value = true,
      (completions) => {
        if (completions === null) {
          resolve()
          return
        }
        const delta = completions.choices[0].delta
        if ((delta as any)?.role)
          streamingRole.value = (delta as { role: ChatRole }).role
        else if ((delta as any)?.content)
          streamingContent.value += (delta as { content: string }).content
      },
    )
  })
  // store assistant message
  historyMessages.value.push({
    role: streamingRole.value,
    content: streamingContent.value,
  })
  // reset states
  streaming.value = false
  streamingRole.value = 'assistant'
  streamingContent.value = ''
}
</script>

<template>
  <div space-y-8 flex flex-col items-center>
    <input
      v-model="chatStore.key"
      w-100 px-4 py-1
      type="text"
      placeholder="Enter your OpenAI key"
    >
    <div cursor-pointer @click="toggleModel">
      Model: {{ model }}
    </div>
    <div space-y-4>
      <div
        v-for="message, i in historyMessages" :key="i"
      >
        {{ message.content }}
      </div>
      <div v-show="streaming">
        {{ streamingContent }}
      </div>
    </div>
    <div flex space-x-4>
      <input
        v-model="userInput"
        w-100 px-4 py-1
        type="text"
        placeholder="Send a message..."
      >
      <button px-4 py-1 bg-gray @click="send">
        Send
      </button>
    </div>
  </div>
</template>
