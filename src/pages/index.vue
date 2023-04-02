<script lang="ts" setup>
import { nextTick, ref } from 'vue'

import { useChatStore } from '~/stores/chat'
import { chatCompletionsApi } from '~/api/chat'
import type { ChatMessage, ChatModel, ChatRole } from '~/types'

const chatStore = useChatStore()

const model = ref<ChatModel>('gpt-3.5-turbo')
const apiProxy = ref<'on' | 'off'>('on')
const userInput = ref('')
const historyMessages = ref<ChatMessage[]>([])
const streaming = ref(false)
const streamingRole = ref<ChatRole>('assistant')
const streamingContent = ref('')

function toggleModel() {
  model.value = model.value === 'gpt-4' ? 'gpt-3.5-turbo' : 'gpt-4'
}

function toggleApiProxy() {
  apiProxy.value = apiProxy.value === 'on' ? 'off' : 'on'
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
    chatCompletionsApi(
      apiProxy.value === 'on',
      chatStore.key,
      model.value,
      historyMessages.value,
      () => streaming.value = true,
      async (completions) => {
        if (completions === null) {
          resolve()
          return
        }
        const delta = completions.choices[0].delta
        if ((delta as any)?.role)
          streamingRole.value = (delta as { role: ChatRole }).role
        else if ((delta as any)?.content)
          streamingContent.value += (delta as { content: string }).content
        await nextTick()
        document.querySelector('html')?.scrollTo({ top: 1e9 })
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
  <div
    w="full md:3/5 xl:2/5" mx-auto space-y-4
    flex flex-col items-center
  >
    <!-- OpenAI API key -->
    <input
      v-model="chatStore.key"
      w-full rounded px-4 py-1
      type="text"
      placeholder="Enter our OpenAI API key"
    >
    <template v-if="chatStore.key">
      <!-- settings -->
      <div space-x-4>
        <span cursor-pointer @click="toggleModel">
          Model: {{ model }}
        </span>
        <span cursor-pointer @click="toggleApiProxy">
          Proxy: {{ apiProxy }}
        </span>
      </div>
      <!-- chat -->
      <div
        w-full space-y-2
        :style="{ whiteSpace: 'pre-wrap' }"
      >
        <div
          v-for="message, i in historyMessages" :key="i"
          px-4 py-2 rounded bg="gray-1 dark:gray-7"
        >
          {{ message.content }}
        </div>
        <div
          v-show="streaming"
          px-4 py-2 rounded bg="gray-1 dark:gray-7"
        >
          {{ streamingContent }}
        </div>
      </div>
      <!-- user input -->
      <div w-full flex space-x-4>
        <div flex-grow>
          <textarea
            v-model="userInput"
            w-full h-16 px-4 py-1 rounded
            type="text"
            placeholder="Enter something..."
          />
        </div>
        <div flex items-center>
          <button
            px-4 py-1 rounded
            bg="gray hover:gray-5" transition
            @click="send"
          >
            Send
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
