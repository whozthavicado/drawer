# Drawer — Diseño

**Fecha:** 2026-08-07
**Estado:** aprobado, listo para plan de implementación
**Ubicación:** `~/projects/drawer/` — repo nuevo y separado, no vive dentro de `web-agency`

## 1. Contexto

App personal de un solo usuario (el dueño de este repo) para guardar notas,
prompts e ideas con copiado rápido, más un set de utilidades de archivos
(ZIP y conversión de formato) que no ameritan una app aparte cada una.

No es trabajo de cliente ni de agencia — es una herramienta propia. Por eso
vive en su propio repo, con su propio proyecto de Vercel y su propia base de
datos en Supabase, sin tocar la infraestructura de `web-agency`.

## 2. Nombre y marca

- **Nombre:** Drawer — equivalente en inglés de "cajón de sastre": el lugar
  donde guardas de todo lo útil, sin necesidad de acomodo estricto.
- **Logo:** ícono simple de línea de un cajón/gaveta entreabierto, un solo
  color de acento. Se genera en la fase de implementación (SVG a mano, sin
  necesidad de IA de imágenes).

## 3. Alcance

### Objetivo, en orden de prioridad
1. Guardar notas/prompts/ideas de texto, con copiado de un clic.
2. Acceder desde el celular y desde la computadora — mismos datos.
3. Utilidades rápidas de archivos sin instalar nada: ZIP y conversión de
   formato de imagen.
4. Conversión de audio/video (ej. MP4→MP3) — se incluye desde ahora, pero
   aislada en su propia sección para no afectar la carga del resto de la
   app (ver §5).

### No objetivos
- Multi-usuario o compartir notas con otras personas. Es de un solo dueño.
- Formato de texto enriquecido (negritas, tablas, etc.) — texto plano/markdown
  simple es suficiente para prompts e ideas.
- Edición de video (recorte, filtros) — solo conversión de formato.
- Soporte offline / app nativa de celular. Es un sitio web responsivo.
- Historial de versiones de una nota. Si se sobreescribe, se sobreescribe.

## 4. Arquitectura

| Decisión | Elección | Razón |
| --- | --- | --- |
| Framework | Next.js 15 App Router | Consistente con el resto de proyectos del autor; deploy directo en Vercel. |
| Datos + Auth | Supabase (Postgres + Auth) | Un solo proveedor cubre base de datos y login, en vez de combinar dos servicios para una app de un usuario. |
| Login | Magic link por correo (passwordless) | Un solo dueño, no hace falta contraseña que recordar; Supabase crea la cuenta automáticamente en el primer login. |
| Privacidad de datos | Row-Level Security por `user_id = auth.uid()` | Aunque solo hay un usuario real, RLS es la forma correcta de que Supabase nunca sirva datos sin sesión válida. |
| Estilos | Tailwind CSS | Rápido de escribir, sin sistema de diseño compartido que mantener (proyecto de un solo dueño). |
| ZIP | JSZip (cliente) | Comprimir/descomprimir corre en el navegador, sin subir archivos a ningún servidor. |
| Conversión de imagen | Canvas API nativo del navegador | PNG↔JPEG↔WebP no necesita ninguna librería — el navegador ya sabe hacerlo. |
| Conversión de audio/video | ffmpeg.wasm (cliente), cargado solo en `/tools/media` | Evita que el resto de la app cargue ~25-30MB de WebAssembly que no usa. |
| Despliegue | Vercel, proyecto propio | Repo separado de `web-agency`, no comparte dominio ni variables de entorno con proyectos de agencia. |

## 5. Estructura de rutas

| Ruta | Función |
| --- | --- |
| `/login` | Pantalla de magic link (solo pide correo) |
| `/` | Lista de notas — buscar, crear, editar, borrar, copiar |
| `/tools/zip` | Comprimir / descomprimir ZIP |
| `/tools/image` | Convertir imágenes (PNG/JPEG/WebP) |
| `/tools/media` | Convertir audio/video (ffmpeg.wasm, carga perezosa) |

Todas las rutas excepto `/login` están protegidas por middleware — sin
sesión válida, redirige a `/login`.

## 6. Modelo de datos

Una sola tabla, `notes`, en el esquema `public` de Supabase:

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid`, PK, default `gen_random_uuid()` | |
| `user_id` | `uuid`, FK a `auth.users(id)` | Nunca nulo; se llena del lado del servidor con la sesión actual, no lo manda el cliente. |
| `title` | `text` | Puede ir vacío; si está vacío se usa el inicio del `content` como título en la lista. |
| `content` | `text` | Cuerpo de la nota/prompt/idea. Texto plano. |
| `created_at` | `timestamptz`, default `now()` | |
| `updated_at` | `timestamptz`, default `now()` | Se actualiza en cada edición. |

RLS: una sola política por operación (`select`/`insert`/`update`/`delete`)
que exige `user_id = auth.uid()`.

## 7. Plan de implementación (alto nivel)

1. Scaffold del proyecto Next.js + Tailwind, fuera de `web-agency`.
2. Provisionar un proyecto de Supabase nuevo (no reutilizar el del CRM de
   la agencia); tabla `notes` + RLS; Auth con magic link.
3. Login (`/login`) + middleware de protección de rutas.
4. CRUD de notas en `/` — crear, editar, borrar, buscar, copiar.
5. `/tools/zip` — comprimir y descomprimir con JSZip.
6. `/tools/image` — convertir formato de imagen con Canvas API.
7. `/tools/media` — convertir audio/video con ffmpeg.wasm, en su propia
   ruta con carga perezosa.
8. Logo (SVG a mano) + metadata del sitio.
9. Deploy a Vercel (proyecto nuevo, dominio provisional de Vercel).
