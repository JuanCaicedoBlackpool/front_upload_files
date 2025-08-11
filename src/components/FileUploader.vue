<template>
  <div class="file-uploader-container rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
    <h2 class="file-uploader-title text-2xl font-bold mb-4 text-center">Adjunte base de datos de cobranza</h2>

    <div
      class="drop-zone border-2 border-dashed rounded-xl p-6 mb-4 transition-colors duration-200 flex flex-col items-center cursor-pointer"
      :class="dragActive ? 'drop-zone--active' : 'drop-zone--inactive'"
      @dragenter.prevent="onDrag"
      @dragover.prevent="onDrag"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <svg class="upload-icon w-12 h-12 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4v-4m0 0l-2 2m2-2l2 2" />
      </svg>
      <p class="drop-zone-text">Adjunte el archivo xlsx, xls o csv.</p>
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        class="file-input-hidden"
        @change="onFileChange"
        multiple
      />
    </div>
    <div v-if="files.length" class="selected-files-container mb-4">
      <h3 class="selected-files-title text-sm font-semibold mb-2">Archivos seleccionados:</h3>
      <ul class="selected-files-list space-y-2">
        <li v-for="(file, idx) in files" :key="idx" class="selected-file-item flex items-center space-x-2">
          <svg class="file-icon-pdf w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span class="file-name text-sm">{{ file.name }}</span>
        </li>
      </ul>
    </div>

    <button
      class="submit-button w-full py-2 rounded-lg font-semibold text-white transition-colors duration-200"
      :class="files.length === 0 || sending ? 'submit-button--disabled' : 'submit-button--enabled'"
      :disabled="files.length === 0 || sending"
      @click="sendFiles"
    >
      {{ sending ? 'Enviando...' : 'Enviar archivo' }}
    </button>
    <div v-if="sent" class="success-message mt-4 text-center font-medium">
      ¡Archivo enviado correctamente!
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const files = ref([]);
  const dragActive = ref(false);
  const sending = ref(false);
  const sent = ref(false);
  const fileInput = ref(null);

  const webhookUrl = 'https://n8n.srv799706.hstgr.cloud/webhook-test/729245fc-8224-481f-987e-8e413db51a3b'
  function triggerFileInput() {
    fileInput.value.click();
  }

  function onFileChange(e) {
    const newFiles = Array.from(e.target.files);
    files.value = [...files.value, ...newFiles];
    sent.value = false;
  }

  function onDrag() {
    dragActive.value = true;
  }

  function onDragLeave() {
    dragActive.value = false;
  }

  function onDrop(e) {
    dragActive.value = false;
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      files.value = [...files.value, ...newFiles];
      sent.value = false;
    }
  }

  async function sendFiles() {
    sending.value = true;
    sent.value = false;
    const formData = new FormData();
    files.value.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      sent.value = true;
      files.value = [];
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    } catch (err) {
      alert('Error enviando archivos');
    }
    sending.value = false;
  }
</script>

<style>
.file-uploader-container {
  background-color: #334155; /* Gris azulado oscuro */
  box-shadow: 0 4px 32px rgba(0,0,0,0.2);
}

.file-uploader-title {
  color: #cbd5e1; /* Gris claro azulado */
}

.drop-zone--active {
  border-color: #94a3b8; /* Gris azulado medio */
  background-color: #475569; /* Gris azulado más oscuro */
}

.drop-zone--inactive {
  border-color: #475569; /* Gris azulado más oscuro */
  background-color: #334155; /* Gris azulado oscuro */
}

.upload-icon {
  color: #94a3b8; /* Gris azulado medio */
}

.file-input-hidden {
  display: none;
}

.selected-files-title,
.selected-file-item .file-name {
  color: #e2e8f0; /* Gris muy claro azulado */
}

.selected-files-container {
  background: #23232600;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.file-icon-pdf {
  color: #f87171; /* rojo claro para icono */
}

.submit-button--enabled {
  background-color: #475569; /* Gris azulado más oscuro */
  color: #cbd5e1;
}

.submit-button--enabled:hover {
  background-color: #64748b; /* Gris azulado un poco más claro */
}

.submit-button--disabled {
  background-color: #64748b; /* Gris azulado un poco más claro */
  color: #94a3b8;
}

.success-message {
  color: #22d3ee; /* azul claro para éxito */
}

.drop-zone-text {
  color: #cbd5e1; /* Gris claro azulado */
}
</style>