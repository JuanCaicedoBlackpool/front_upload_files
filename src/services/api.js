// src/services/api.js

const template_prompt = `Eres un analista de crédito que analiza una serie de documentos para determinar la viabilidad crediticia en los bancos Bancolombia y Davivienda. Debes generar 2 reportes separados, uno por banco.

### **CRITERIOS DE VALIDACIÓN**

1. **Coherencia de nombres**: El nombre debe coincidir entre cédula y formato de preclasificación
2. **Coherencia de cédula**: El número de cédula debe coincidir entre documentos
3. **Coherencia de Social Security**: El número debe coincidir entre cédula y formato de preclasificación
4. **Tipo de crédito**: Verificar si es "Crédito Hipotecario" en el formato de preclasificación
5. **Gastos familiares**: Deben ser ≤ 50% del salario mensual
6. **Score crediticio**: 
   - Bancolombia: ≥ 600 puntos
   - Davivienda: ≥ 700 puntos
7. **Historial negativo**: Charge off = 0 y Collections = 0

### **CÁLCULOS ESPECÍFICOS**

**Para identificar tarjetas de crédito:**
- Buscar en tabla "OPEN ACCOUNTS" del reporte de crédito
- Solo cuentas donde ACCT TYPE = "REV" Y el estado sea activo/abierto

**Para calcular cupos de tarjetas:**
- Sumar valores de "HIGH CREDIT OR LIMIT" de las tarjetas identificadas
- Si ECOA = "J" (cuenta conjunta), dividir ese valor entre 2

**Para calcular cuotas de tarjetas:**
- Buscar valores de "TERMS" de las tarjetas identificadas
- **REGLAS DE EXTRACCIÓN**:
  * Si TERMS contiene "MIN $X", extraer el valor X como cuota
  * Si TERMS contiene solo números seguidos de "$X", extraer el valor X
  * Si TERMS está vacío o contiene "N/A" o texto no numérico, reportar como "0" o "No especificado"
  * Ejemplos: "MIN $79" → $79, "084 $579" → $579, "$0" → $0
- Si ECOA = "J", dividir ese valor entre 2

**Para otros créditos:**
- Tomar cuentas en "OPEN ACCOUNTS" donde ACCT TYPE ≠ "REV"
- Usar valores de "BALANCE"
- **Para Bancolombia**: Excluir créditos con ECOA = "J" (mostrar por separado como "Cuentas compartidas")
- **Para Davivienda**: Incluir todos los créditos (ECOA = "J" dividido entre 2)
- **IMPORTANTE**: La ausencia de créditos compartidos (ECOA = "J") es completamente normal y NO afecta la viabilidad

### **REGLAS DE VIABILIDAD**

- **VIABLE**: Solo si TODOS los criterios se cumplen
- **NO VIABLE**: Si cualquier criterio falla

### **FORMATO DE SALIDA**

\`\`\`json
{
  "Banco": "Bancolombia/Davivienda",
  "Datos_personales": {
    "Nombres": "",
    "Apellidos": "",
    "Numero_identificacion": ""
  },
  "Criterios": [
    {
      "Criterio": "Nombre completo",
      "Estado": "Válido/No válido",
      "Observaciones": "Descripción específica"
    },
    {
      "Criterio": "Número de cédula",
      "Estado": "Válido/No Válido",
      "Observaciones": "Descripción específica"
    },
    {
      "Criterio": "Número social security",
      "Estado": "Válido/No Válido",
      "Observaciones": "Descripción específica"
    },
    {
      "Criterio": "Crédito hipotecario",
      "Estado": "Aplica/No Aplica",
      "Observaciones": "Descripción del hallazgo"
    },
    {
      "Criterio": "Gastos familiares",
      "Estado": "Válido/No Válido",
      "Observaciones": "Cálculo: gastos vs 50% del salario"
    },
    {
      "Criterio": "Score",
      "Estado": "Válido/No Válido",
      "Observaciones": "Score obtenido vs umbral requerido"
    },
    {
      "Criterio": "Charge off - Collections",
      "Estado": "Válido/No Válido",
      "Observaciones": "Valores encontrados"
    }
  ],
  "Analisis_crediticio": {
    "Tarjetas_credito": {
      "Cantidad": 0,
      "Cupo_total": 0,
      "Cuotas_total": 0,
      "Detalle": [
        {
          "Creditor": creditor1,
          "High_Credit_or_Limit": highCreditOrLimit1,
          "Terms": terms1,
          "ECOA": ECOA1,
          "Cuota": cuota1
        }, {}, ...
      ]
    },
    "Otros_creditos": {
      "Total": 0,
      "Cuentas_compartidas": 0,
      "Detalle": [
        {
          "Creditor": creditor1,
          "Balance": balance1,
          "ECOA": ECOA1
        }, {}, ...
      ]
    }
  },
  "Resultado": {
    "Estado": "Viable/No Viable",
    "Motivos": "Explicación detallada del resultado"
  }
}
\`\`\`

### **INSTRUCCIONES CRÍTICAS**

1. **Leer cuidadosamente** la tabla OPEN ACCOUNTS
2. **Identificar correctamente** qué es REV (tarjeta) vs otros tipos
3. **Aplicar la regla ECOA = "J"** consistentemente
4. **Generar DOS reportes separados** (uno para cada banco)
5. **Mostrar todos los cálculos** paso a paso en las observaciones

### Documentos a analizar
`

export const extractTextsFromAPI = async (files) => {
  const formDataAPI = new FormData();

  // Agregar archivos al FormData con sus nombres actualizados
  files.forEach((doc) => {
    console.log('Enviando archivo:', doc.name);
    const fileBlob = doc.file.slice(0, doc.file.size, doc.file.type);
    const updatedFile = new File([fileBlob], doc.name, { type: doc.file.type });
    formDataAPI.append("files", updatedFile);
  });

  // Agregar parámetros adicionales según la definición del endpoint
  formDataAPI.append("use_genai", "true"); // Parámetro booleano
  formDataAPI.append("max_pages", "10"); // Valor entre 1 y 50
  
  // Mostrar contenido del FormData
  for (let pair of formDataAPI.entries()) {
    console.log(pair[0], pair[1]);
  }
  try {
    const response = await fetch(
      "https://oci-du.tryzone.space/documents/extract-texts",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-api-key": "c1560c2045b64415bff354f32ce2d7b9",
          // No agregar Content-Type manualmente cuando usas FormData
        },
        body: formDataAPI,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error en API: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("Respuesta del API de extracción:", data);
    return data;
  } catch (error) {
    console.error("Error al extraer textos:", error);
    throw error;
  }
};

export const generateAnalysis = async (extractedText) => {
  console.log("Texto extraído para análisis:", template_prompt + "\n" + extractedText);
  try {
    const response = await fetch("https://oci-du.tryzone.space/simple-prompt/generate", {
      method: "POST",
      headers: {
        "x-api-key": "c1560c2045b64415bff354f32ce2d7b9",
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: {
          user_message: template_prompt + "\n" + extractedText,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.75,
          frequency_penalty: 0,
          presence_penalty: 0,
          top_k: 0
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Respuesta del API de análisis:", data);
    return data;
  } catch (error) {
    console.error("Error al generar análisis:", error);
    throw error;
  }
};
