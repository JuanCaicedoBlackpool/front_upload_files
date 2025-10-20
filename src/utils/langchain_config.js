import { StructuredOutputParser } from "langchain/output_parsers";
import {  HumanMessagePromptTemplate} from "@langchain/core/prompts";

// ============================================
// CEDULA (CC)
// ============================================

const responseSchemaCC = [
  {
    name: "nombre",
    description: "Valor string con el nombre completo (nombres y apellidos) de la persona"
  },
  {
    name: "identificacion",
    description: "Valor númerico del número de identificación de la persona. Entregar unicmaente el numero, sin puntos ni comas ni guiones."
  }
];

const outputParserCC = StructuredOutputParser.fromNamesAndDescriptions(
  Object.fromEntries(
    responseSchemaCC.map(({ name, description }) => [name, description])
  )
);
const formatInstructionsCC = outputParserCC.getFormatInstructions();

const PrompTemplateCC = `Extrae la información solicitada de la cédula del cliente.
Cedula: {input_text}
{format_instructions}`;
const chatPromptCC = HumanMessagePromptTemplate.fromTemplate(PrompTemplateCC);


// ============================================
// Formato de Preclasificacion (formato_preclasificacion)
// ============================================

const responseSchemaFormatoPreclasificacion = [
  {
    name: "nombre",
    description: "Nombre completo (nombres y apellidos) de la persona"
  },
  {
    name: "identificacion_cc",
    description: "Valor numerico con el úmero de identificación de la cedula de la persona. Entregar unicmaente el numero, sin puntos ni comas ni guiones"
  },
  {
    name: "social_security",
    description: "Valor númerco del Social security del cliente. Entregar unicmaente el numero, sin puntos ni comas ni guiones"
  },
  {
    name: "salario_mensual",
    description: "Salario mensual del cliente. Extraer unicamente el valor numerico"
  },
  {
    name: "gastos_familiares",
    description: "Gastos familiares del cliente. Extraer unicamente el valor numerico"
  },
  {
    name: "credito_hipotecario",
    description: "Será True si es la etiqueta de 'tipo de credito' contiene 'credito hipotecario'. Sino, False"
  },
];

const outputParserPreclasificacion = StructuredOutputParser.fromNamesAndDescriptions(
  Object.fromEntries(
    responseSchemaFormatoPreclasificacion.map(({ name, description }) => [name, description])
  )
);
const formatInstructionsPreclasificacion = outputParserPreclasificacion.getFormatInstructions();

const TemplatePreclasificacion = `Extrae la informacion solicitada del formulario del formato de preclasificacion.
Formato de preclasificación: {input_text}
{format_instructions}`;
const chatPromptPreclasificacion = HumanMessagePromptTemplate.fromTemplate(TemplatePreclasificacion);


// ============================================
// Reporte de Credito (RC)
// ============================================

const responseSchemaRC = [
  {
    name: "score",
    description: "Score crediticio. Puede aparecer más de uno, seleccionar el mayor. Extraer unicamente el valor númerico."
  },
  {
    name: "charge_off",
    description: "Buscar la etiqueta 'charge off' y extraer unicamente el valor númerico."
  },
  {
    name: "collections",
    description: "Buscar la etiqueta 'collections' y extraer unicamente el valor númerico."
  },
  {
    name: "open_accounts",
    description: `Es una tabla que contiene información de cuentas abiertas del cliente.
                Tabla de la cual hay que extraer información de 5 columnas: 'ECOA', 'WHOSE', 'CREDITOR', 'ACCT TYPE', 'HIGH CREDIT OR LIMIT' y 'TERMS'.
                Entregar la informacción en un array de objetos de la siguiente forma:
                {
                  ecoa: Variable tipo string con posibles valores ['B','T','J','U','A','P','S','M','X','I','T'],
                  whose: Variable tipo string con posibles valores ['B','T','J','U','A','P','S','M','X','I','T'],
                  creditor: Variable tipo string con la descripción de la entidad crediticia. Ejemplo: NETCREDIT, SBA, PREMIERMEC.
                  acct_type: Variable tipo string con posibles valores ['REV','OPEN','MTG','AUTO','INST']
                  high_score_limit: Variable numérica que representa el límite de crédito o el monto original del préstamo. 
                      - Se encuentra en la columna "HIGH CREDIT OR LIMIT" de las tablas de cuentas (OPEN ACCOUNTS, CLOSED ACCOUNTS, DEROGATORY ACCOUNTS)
                      - Siempre está precedida por el símbolo '$'
                      - Representa el monto máximo aprobado para cuentas revolventes (REV) o el monto original financiado para préstamos (INST, AUTO, MTG)
                      - Ejemplos del documento: $49301, $1500, $236568, $26632,
                      - IMPORTATEN: Extrae unicmanete el valor número eliminado cualquier signo o letra
    
                  terms: Variable numérica que representa el pago mensual requerido o la cuota del crédito.
                    - Se encuentra en la columna "TERMS" de las tablas de cuentas
                    - Para cuentas revolventes (REV): aparece como "MIN $XX" indicando el pago mínimo mensual
                    - Para préstamos de cuota fija (INST, AUTO, MTG): aparece como "$XXX" seguido del número de cuotas
                    - Formato: "MIN $40" (pago mínimo) o "$282" + número de cuotas como "239 $282"
                    - El valor numérico puede estar precedido por "MIN $" o simplemente "$"
                    - Ejemplos del documento: 
                      * "MIN $40" (Credit One Bank - cuenta revolvente)
                      * "239 $282" (GoodLeap - préstamo de 239 cuotas de $282)
                      * "336 $1800" (PHL Mortgage - hipoteca con pago de $1800)
                    - IMPORTATEN: Extrae unicmanete el valor número eliminado cualquier signo ($) o letra (MIN)
                }`
                  
  },
];

const outputParserRC = StructuredOutputParser.fromNamesAndDescriptions(
  Object.fromEntries(
    responseSchemaRC.map(({ name, description }) => [name, description])
  )
);
const formatInstructionsRC = outputParserRC.getFormatInstructions();

const TemplateRC = `Extrae la información solicitada del reporte de credito.
Reporte de credito: {input_text}
{format_instructions}`;
const chatPromptRC = HumanMessagePromptTemplate.fromTemplate(TemplateRC);


// ============================================
// MAIN CONFIGURATION OBJECT
// ============================================

export const LANGCHAIN_CONFIG = {
  'Cedula': {
    chatTemplate: chatPromptCC,
    format_instructions: formatInstructionsCC,
  },
  'Formato preclasificacion': {
    chatTemplate: chatPromptPreclasificacion,
    format_instructions: formatInstructionsPreclasificacion,
  },
  'Reporte credito': {
    chatTemplate: chatPromptRC,
    format_instructions: formatInstructionsRC,
  }
};