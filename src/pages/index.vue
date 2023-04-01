<script lang="ts" setup>
import ThemeSwitch from '~/components/ThemeSwitch.vue'
</script>

<template>
  <div text-center p-16>
    <div i-carbon-campsite text-4xl inline-block />
    <p>
      <a rel="noreferrer" href="https://github.com/mys1024/vitesse-light" target="_blank">
        Vitesse Light
      </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Lightweight Vitesse</em>
    </p>
    <div py-4 />
    <ThemeSwitch />
  </div>
</template>
