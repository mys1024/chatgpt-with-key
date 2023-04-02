<script lang="ts" setup>
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
</script>

<template>
  <footer>
    <button icon-btn mx-2 outline-none @click="appStore.toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>
    <a
      icon-btn mx-2
      href="https://github.com/mys1024/chatgpt-with-key"
    >
      <div i-carbon-logo-github />
    </a>
  </footer>
</template>
