import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  const key = useLocalStorage('chat_key', '')

  return {
    key,
  }
})
