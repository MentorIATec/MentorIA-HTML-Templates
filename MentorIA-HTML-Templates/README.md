# MentorIA HTML Templates

Repositorio para almacenar plantillas HTML de mentoria universitaria y una libreria de imagenes publicas.

## Estructura
- `base/template_base.html`: plantilla base con variables reutilizables.
- `base/estilos_referencia.md`: guia rapida de estilos visuales.
- `segmentos/`: plantillas por segmento o momento academico.
- `assets/imagenes.md`: listado de URLs publicas para imagenes.
- `prompts/prompt_generador_html.md`: prompt estandar para generar nuevos correos.

## Variables comunes
- `{{NOMBRE}}` nombre de la persona estudiante.
- `{{CTA_PRINCIPAL_URL}}` y `{{CTA_PRINCIPAL_TEXTO}}`.
- `{{CTA_SECUNDARIO_1_URL}}` y `{{CTA_SECUNDARIO_1_TEXTO}}`.
- `{{CTA_SECUNDARIO_2_URL}}` y `{{CTA_SECUNDARIO_2_TEXTO}}`.
- `{{IMAGEN_URL}}` URL publica de imagen.
- `{{FIRMA_NOMBRE}}` y `{{FIRMA_AREA}}`.

Notas:
- Si no se necesita un CTA secundario, eliminar el bloque de tabla correspondiente.
- Mantener estilos en linea para compatibilidad con Outlook y Power Automate.
