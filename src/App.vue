<script setup lang="ts">
import ThemeSwitch from '~/components/ThemeSwitch.vue'
</script>

<template>
  <div p-16>
    <RouterView />
    <footer text-center>
      <ThemeSwitch mt-16 />
    </footer>
  </div>
</template>
