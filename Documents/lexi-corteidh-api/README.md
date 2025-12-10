# Lexi Corte IDH API

API mínima y determinista que sirve jurisprudencia curada de la Corte Interamericana de Derechos Humanos (Corte IDH) para el agente de IA "Lexi".

## Propósito

Esta API está diseñada como **fuente única y verificable** de jurisprudencia para prevenir alucinaciones en sistemas de IA legal. Todos los datos provienen exclusivamente de un archivo JSON local curado, garantizando:

- **Trazabilidad completa**: Cada caso puede ser rastreado hasta su fuente original
- **Determinismo**: Las respuestas son siempre consistentes y basadas únicamente en datos verificados
- **Sin inferencias**: No se genera ni infiere contenido jurídico

## Estructura del Proyecto

```
lexi-corteidh-api/
├── server.js              # Servidor Express con endpoints de búsqueda
├── package.json           # Configuración del proyecto (ES modules)
├── data/
│   └── corteidh_casos.json  # Archivo JSON con casos curados
└── README.md
```

## Ejecución Local

### Requisitos

- Node.js >= 18
- npm

### Pasos

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto definido en `PORT`).

### Endpoints

- `GET /` - Health check. Retorna: `Lexi Corte IDH API OK`
- `GET /api/casos/buscar` - Búsqueda de casos con parámetros opcionales:
  - `pais` - Código ISO del país (ej: `COL`, `MEX`)
  - `anio_desde` - Año mínimo
  - `anio_hasta` - Año máximo
  - `articulos` - Artículos de la CADH separados por comas (ej: `8,25`)
  - `tema` - Tema en formato snake_case (ej: `debido_proceso`)
  - `texto` - Búsqueda de texto en nombre y resumen
  - `limite` - Número máximo de resultados (default: 5)

### Ejemplos de Uso

```bash
# Buscar casos de Colombia
curl "http://localhost:3000/api/casos/buscar?pais=COL"

# Buscar casos sobre debido proceso entre 2000 y 2010
curl "http://localhost:3000/api/casos/buscar?tema=debido_proceso&anio_desde=2000&anio_hasta=2010"

# Buscar casos que mencionen "destitución"
curl "http://localhost:3000/api/casos/buscar?texto=destitución&limite=10"
```

## Despliegue en Render

Esta API está lista para desplegarse en Render como un **Web Service** de Node.js.

### Configuración en Render

1. Conecta tu repositorio a Render
2. Selecciona el tipo de servicio: **Web Service**
3. Configura los siguientes valores:

   **Build Command:**
   ```
   npm install
   ```

   **Start Command:**
   ```
   npm start
   ```

   **Node Version:**
   ```
   18.x
   ```
   (o superior, mínimo 18)

4. Render detectará automáticamente el puerto desde `process.env.PORT`

### Variables de Entorno

No se requieren variables de entorno. El puerto se configura automáticamente por Render.

## Integración con Agente de IA

Esta API está diseñada para ser consumida por un agente de IA mediante llamadas HTTP GET. El formato de respuesta es consistente:

```json
{
  "casos": [
    {
      "id": 406,
      "nombre": "Petro Urrego vs. Colombia",
      "anio": 2020,
      "paises": ["COL"],
      "articulos": ["23", "8", "25"],
      "temas": ["derechos_politicos", "debido_proceso", ...],
      "resumen": "...",
      "estandar_clave": "...",
      "link_pdf": "..."
    }
  ]
}
```

El agente puede usar esta API como función JSON para obtener jurisprudencia verificada sin riesgo de alucinaciones.

## Diseño Técnico

### ¿Por qué JSON en lugar de base de datos?

- **Simplicidad**: Sin dependencias externas ni configuración de BD
- **Trazabilidad**: El archivo JSON puede versionarse en Git
- **Determinismo**: Los datos se cargan en memoria al inicio, garantizando respuestas consistentes
- **Portabilidad**: Fácil de desplegar en cualquier plataforma sin servicios adicionales
- **Prototipo**: Adecuado para un MVP donde la precisión es más importante que la escala

### Limitaciones

- Los datos se cargan en memoria al inicio del servidor
- Los cambios en `corteidh_casos.json` requieren reiniciar el servidor
- No hay autenticación ni rate limiting (adecuado para uso interno con agente de IA)

## Licencia

MIT

