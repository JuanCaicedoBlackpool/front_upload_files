<template>
  <div class="file-uploader-container rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
    <h2 class="file-uploader-title text-2xl font-bold mb-4 text-center">Sube tu informacion</h2>

    <div class="mb-4">
      <label for="tipoDocumento" class="block text-sm font-medium mb-1">Cargo:</label>
      <select
        id="tipoDocumento"
        v-model="tipoDocumento"
        class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option disabled value="">Elige un cargo</option>
        <option v-for="career in filteredCareers" :key="career" :value="career">{{ career }}</option>
      </select>
    </div>
    <label for="Adjuntos" class="block text-sm font-medium mb-1">Adjuntos:</label>
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
      <p class="drop-zone-text">Arrastra una imagen o PDF aquí, o haz clic para seleccionar</p>
      <input
        ref="fileInput"
        type="file"
        accept="image/*,application/pdf"
        class="file-input-hidden"
        @change="onFileChange"
        multiple
      />
    </div>
    <div v-if="files.length" class="selected-files-container mb-4">
      <h3 class="selected-files-title text-sm font-semibold mb-2">Archivos seleccionados:</h3>
      <ul class="selected-files-list space-y-2">
        <li v-for="(file, idx) in files" :key="idx" class="selected-file-item flex items-center space-x-2">
          <img
            v-if="file && file.type && file.type.startsWith('image/')"
            :src="file.preview"
            :alt="file.name"
            class="w-8 h-8 object-cover rounded"
          />
          <svg v-else class="file-icon-pdf w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span class="file-name text-sm">{{ file.name }}</span>
        </li>
      </ul>
    </div>

    <label for="descripcion" class="block text-sm font-medium mb-1">Descripción del cargo:</label>
    <textarea
      id="descripcion"
      v-model="descripcion"
      class="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      rows="3"
      placeholder="Describe que habilidades buscas para el cargo y una descripción del cargo. ..."
    ></textarea>

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
  import { ref, computed } from 'vue';

  // Lista de carreras
  const careers = [
    "Gerente General",
    "Director Administrativo",
    "Director Financiero (CFO)",
    "Analista Financiero",
    "Contador Público",
    "Auditor Interno / Externo",
    "Jefe de Compras",
    "Director de Tesorería",
    "Gerente de Planeación Estratégica",
    "Gerente Comercial",
    "Director de Ventas",
    "Gerente de Marketing",
    "Especialista en Marketing Digital",
    "Analista de Mercado",
    "Director de Producto",
    "Trade Marketing Manager",
    "Gerente de Recursos Humanos",
    "Especialista en Selección",
    "Analista de Nómina",
    "Coordinador de Bienestar",
    "Psicólogo Organizacional",
    "Abogado Corporativo",
    "Abogado Laboral",
    "Director de Operaciones",
    "Coordinador Logístico",
    "Planeador de Producción",
    "Ingeniero de Procesos",
    "Jefe de Planta",
    "Chief Technology Officer (CTO)",
    "Director de Sistemas",
    "Arquitecto de Software",
    "Ingeniero de Software",
    "Ingeniero de Datos",
    "Administrador de Bases de Datos",
    "Ingeniero de Infraestructura",
    "Analista de Seguridad Informática",
    "Scrum Master",
    "Product Owner",
    "Gerente de Proyectos (PM)",
    "Líder de Proyecto",
    "Ingeniero de Proyectos",
    "Director de Calidad",
    "Ingeniero de Calidad",
    "Auditor de Calidad",
    "Coordinador HSE",
    "Médico Laboral",
    "Asistente de Compras",
    "Asesor Comercial",
    "Auxiliar de Nómina",
    "Coordinador de Bodega",
    "Jefe de Almacén",
    "Supervisor de Producción",
    "Desarrollador Junior",
    "Analista Ambiental",
    "Ingeniero Ambiental",
    "Ingeniero Civil",
    "Arquitecto",
    "Diseñador Gráfico",
    "Publicista",
    "Community Manager"
  ];

  const files = ref([]);
  const dragActive = ref(false);
  const sending = ref(false);
  const sent = ref(false);
  const fileInput = ref(null);
  const descripcion = ref('');

  // Filtro y selección de carrera
  const careerFilter = ref('');
  const tipoDocumento = ref('');
  const filteredCareers = computed(() =>
    careers.filter(c =>
      c.toLowerCase().includes(careerFilter.value.toLowerCase())
    )
  );

  const webhookUrl = 'https://n8n.srv799706.hstgr.cloud/webhook-test/4fa260b0-c546-47df-b4b8-dbe630aeb18a';

  function triggerFileInput() {
    fileInput.value.click();
  }

  function onFileChange(e) {
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(file => {
      file.preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    });
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
      newFiles.forEach(file => {
        file.preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      });
      files.value = [...files.value, ...newFiles];
      sent.value = false;
    }
  }

  async function sendFiles() {
    sending.value = true;
    sent.value = false;
    const formData = new FormData();
    
    // Adjuntar múltiples archivos
    files.value.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    formData.append('tipoDocumento', tipoDocumento.value || 'factura');
    formData.append('descripcion', descripcion.value);
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
  background-color: white;
}

.file-uploader-title {
  color: #4338ca;
}

.drop-zone--active {
  border-color: #6366f1;
  background-color: #eef2ff;
}

.drop-zone--inactive {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.upload-icon {
  color: #818cf8;
}

.file-input-hidden {
  display: none;
}

.submit-button--enabled {
  background-color: #4f46e5;
}

.submit-button--enabled:hover {
  background-color: #4338ca;
}

.submit-button--disabled {
  background-color: #c7d2fe;
}

.success-message {
  color: #059669;
}
</style>