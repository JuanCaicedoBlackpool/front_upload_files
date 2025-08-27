// src/services/api.js

export const extractTextsFromAPI = async (files) => {
  const formDataAPI = new FormData();

  // Agregar archivos al FormData
  files.forEach(file => {
    formDataAPI.append('files', file);
  });

  // Agregar parámetros adicionales según el curl
  formDataAPI.append('use_genai', 'true');
  formDataAPI.append('max_pages', '10');

  try {
    const response = await fetch('https://oci-du.tryzone.space/documents/extract-texts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-api-key': 'c1560c2045b64415bff354f32ce2d7b9'
        // No agregar Content-Type manualmente cuando usas FormData
      },
      body: formDataAPI
    });

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta del API de extracción:', data);
    return data;
  } catch (error) {
    console.error('Error al extraer textos:', error);
    throw error;
  }
};

export const sendToN8nWebhook = async (email, analysisType, extractedData) => {
  try {
    const webhookData = {
      email: email,
      analysisType: analysisType,
      extractedTexts: extractedData,
      timestamp: new Date().toISOString()
    };

    const webhookUrl = 'https://n8n.srv799706.hstgr.cloud/webhook/documents-reviewer';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error(`Error en webhook: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Respuesta del webhook n8n:', result);
    return result;
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
    throw error;
  }
};