# CodeQuest Kids

Plataforma educativa local-first para descubrir programación con misiones, niveles, insignias y rutas adaptadas a la edad. Diseñada en español para primaria (6–11) y secundaria (12–17), con perfiles privados para compartir un mismo dispositivo.

## Empezar

Requiere Node.js **20.19+** y npm.

```bash
npm install
npm run dev
```

Vite imprime la URL local. La aplicación no necesita cuenta, API remota ni variables de entorno: crea un perfil y empieza a jugar. Para compilar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

## Funcionalidades incluidas

- **Onboarding obligatorio** en la primera visita: nombre validado (2–30 letras), edad (6–17), origen de referencia y avatar. El grupo de edad determina la temática y el contenido recomendado. El tour inicial no se puede saltar durante el onboarding, pero sí durante la visita guiada.
- **Perfiles locales múltiples**: cada hermano/a o compañero conserva sus XP, monedas, racha, insignias y borradores de código. «Cerrar sesión / Cambiar usuario» no borra los perfiles.
- **Dashboard gamificado** con experiencia y niveles, racha, CodeCoins, misión diaria, reto semanal, recomendaciones y próximas insignias. Las rachas premian la constancia y no eliminan progreso.
- **30 misiones seed**, tres para cada ruta: Scratch, Blockly, Python, JavaScript, HTML/CSS, TypeScript, SQL, Rust, Kotlin y Go. Las misiones incluyen dificultad, grupos de edad, tema, valores educativos, recompensas, pistas y comprobaciones.
- **Filtros combinables** por lenguaje, edad recomendada, dificultad, valor, duración y texto.
- **CodeMirror 6** para escribir código real. Scratch incorpora un constructor visual de bloques accesible por arrastre o teclado/clic; Blockly presenta su puente hacia JavaScript.
- **Pruebas y recompensas**: las misiones de JavaScript incluyen ejecución de casos de entrada/salida; las demás usan comprobaciones locales de los conceptos/patrones requeridos. Las pistas se desbloquean progresivamente con CodeCoins y el editor guarda borradores por perfil.
- **Insignias** con reglas de desbloqueo, incluyendo primer reto, tres lenguajes, racha, hitos de misiones y un easter egg.
- **Rutas de lenguaje**, perfil configurable (avatar, lenguajes favoritos, sonido y tipografía), insignias y una clasificación **privada por defecto**. La clasificación de muestra usa datos ficticios.
- **Tema automático**: colores cálidos y formas redondeadas para 6–11; tema oscuro juvenil a partir de 12. Incluye foco de teclado visible, controles semánticos, estados accesibles, preferencia tipográfica y respeto por `prefers-reduced-motion`.
- **PWA instalable** con actualización automática y caché offline. El catálogo se empaqueta con la app y se conserva en IndexedDB; Zustand persiste perfiles y preferencias en el almacenamiento local.
- Animaciones con Motion, celebraciones con canvas-confetti, feedback con Sonner y navegación con React Router DOM v7 (rutas anidadas, lazy loading y loaders).

## Stack

- React 19 + Vite 8 + TypeScript strict.
- Tailwind CSS v4 (plugin Vite) y tokens CSS propios en `src/styles/globals.css`.
- React Router DOM v7, TanStack Query, Zustand + persist, Zod, React Hook Form.
- CodeMirror 6, Motion, canvas-confetti, Lucide React, Sonner e IndexedDB (`idb`).
- Vitest 5, Testing Library, ESLint 10, Prettier y Husky.

## Estructura

```text
src/
├── app/                 # Router, providers y límites de error
├── components/          # UI, onboarding, layout, editor y gamificación
├── data/                # Catálogo, insignias y 10 archivos JSON de misiones
├── features/            # Sesión, misiones, lenguajes y vistas de producto
├── hooks/               # Session guard, filtros, XP y racha
├── lib/                 # Constantes, formateadores y esquemas Zod
├── pages/               # Páginas lazy-loaded
├── services/            # Catálogo local-first, IndexedDB y cliente API opcional
├── stores/              # Sesión/perfiles, progreso, UI y eventos de gamificación
├── styles/              # Tokens, temas y responsive
└── types/               # Modelos compartidos
```

## Datos y privacidad

No hay backend en esta versión. El perfil activo y el progreso se guardan con Zustand persist en `localStorage`; las misiones se cachean en IndexedDB y también forman parte del bundle para que la app arranque sin conexión. Ninguna clasificación transmite datos. Borrar el almacenamiento del navegador elimina los perfiles de ese dispositivo.

El evaluador de JavaScript ejecuta los retos en el navegador para una experiencia instantánea y **no es un sandbox seguro para código no confiable**. No debe utilizarse para ejecutar código enviado a un servidor ni en una experiencia multiusuario. La hoja de ruta contempla aislamiento en Web Worker/servicio dedicado y ejecución remota con límites antes de publicar retos abiertos.

## Comandos

| Comando                | Acción                                        |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo, enlazado a `0.0.0.0`  |
| `npm run build`        | Type-check estricto y build de producción/PWA |
| `npm run preview`      | Sirve el build para revisión local            |
| `npm test`             | Ejecuta las pruebas Vitest                    |
| `npm run test:watch`   | Vitest en modo interactivo                    |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Formatea con Prettier                         |
| `npm run format:check` | Comprueba el formato                          |

Husky ejecuta lint y tests antes de un commit.

## Próximos pasos

1. Añadir un runtime aislado para Python, SQL y lenguajes de sistemas, con límites de CPU/memoria y sin acceso a la red.
2. Integrar Blockly/Scratch auténticos y ampliar los proyectos Turtle/DOM con vistas de previsualización.
3. Crear un backend opcional para aulas, colaboración y clasificaciones opt-in con consentimiento y alias.
4. Añadir editor de contenido, traducciones y analítica educativa respetuosa con la privacidad.
5. Ampliar pruebas de accesibilidad y pruebas de flujo de onboarding/end-to-end en móvil.

## Validación

```bash
npm run lint
npm test
npm run build
```
