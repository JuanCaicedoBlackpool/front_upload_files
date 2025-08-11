<template>
  <div class="min-h-screen flex items-center justify-center app-bg">
    <FileUploader />
  </div>
</template>

<script setup>
import FileUploader from './components/FileUploader.vue'
</script>

<style>
/* Fondo degradado gris claro */
.app-bg {
  background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
  min-height: 100vh;
}
</style>