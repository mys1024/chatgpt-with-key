<script lang="ts" setup>
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
</script>

<template>
  <button icon-btn mx-2 outline-none @click="appStore.toggleDark()">
    <div i="carbon-sun dark:carbon-moon" />
  </button>
</template>
