import { defineStore } from 'pinia'
import { useDark, usePreferredDark, useToggle } from '@vueuse/core'
import { watchEffect } from 'vue'

export const useAppStore = defineStore('app', () => {
  const dark = useDark()
  const toggleDark = useToggle(dark)
  const preferredDark = usePreferredDark()

  watchEffect(() => {
    document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )!.content = dark.value ? '#00aba9' : '#ffffff'
    document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][type="image/svg+xml"]',
    )!.href = preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'
  })

  return {
    dark,
    toggleDark,
  }
})
