<script lang="ts" setup>
import { ref } from 'vue'

import { useChatStore } from '~/stores/chat'
import { chatCompletionsApi } from '~/api/chat'
import type { ChatMessage } from '~/types'

const chatStore = useChatStore()

const userInput = ref('')
const historyMessages = ref<ChatMessage[]>([])

async function send() {
  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }
  historyMessages.value.push(userMessage)

  const res = await chatCompletionsApi(
    chatStore.key,
    'gpt-3.5-turbo',
    [...historyMessages.value, userMessage],
  )
  if (!res.ok)
    console.error('response is not ok:', res)

  const completions = await res.json()
  const choice = completions.choices[0]
  historyMessages.value.push(choice.message)
  userInput.value = ''
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
    <div space-y-4>
      <div
        v-for="message, i in historyMessages" :key="i"
      >
        {{ message.content }}
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
