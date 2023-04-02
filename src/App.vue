<script setup lang="ts">
import ThemeSwitch from '~/components/ThemeSwitch.vue'
</script>

<template>
  <div px-4 py-8>
    <RouterView />
    <footer text-center>
      <ThemeSwitch mt-8 />
    </footer>
  </div>
</template>
