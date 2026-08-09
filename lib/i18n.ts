export type Lang = "es" | "en";

export const LANG_STORAGE_KEY = "drawer:lang";

type Dict = Record<string, string>;

const es: Dict = {
  // Sidebar
  "sidebar.notes": "Notas",
  "sidebar.tools": "Herramientas",
  "sidebar.zip": "ZIP",
  "sidebar.image": "Convertir imagen",
  "sidebar.media": "Audio y video",
  "sidebar.account": "Cuenta",
  "sidebar.help": "Ayuda",
  "sidebar.helpAria": "Ver guía de bienvenida",
  "sidebar.collapse": "Colapsar",
  "sidebar.expand": "Expandir",
  "sidebar.collapseAria": "Colapsar barra lateral",
  "sidebar.expandAria": "Expandir barra lateral",
  "sidebar.openMenu": "Abrir menú",
  "sidebar.closeMenu": "Cerrar menú",

  // Onboarding
  "onboarding.step1.title": "¡Bienvenido a Drawer!",
  "onboarding.step1.body":
    "Tu cajón personal para notas, prompts e ideas — con copiado en un clic.",
  "onboarding.step2.title": "Crea y organiza tus notas",
  "onboarding.step2.body":
    "Búscalas, ponles tags, y usa el botón de copiar para llevarlas a donde las necesites al instante.",
  "onboarding.step3.title": "ZIP, imágenes y audio/video",
  "onboarding.step3.body":
    "Todo corre en tu navegador — nada se sube a internet, tus archivos nunca salen de tu dispositivo.",
  "onboarding.step4.title": "Hazla tuya",
  "onboarding.step4.body":
    "Cambia el color desde Cuenta, y agrégala a tu pantalla de inicio para usarla como una app de verdad.",
  "onboarding.step5.title": "¡Listo!",
  "onboarding.step5.body":
    "Ya sabes lo básico. Puedes volver a ver esta guía cuando quieras con el botón de ayuda.",
  "onboarding.back": "Atrás",
  "onboarding.skip": "Saltar",
  "onboarding.next": "Siguiente",
  "onboarding.start": "Comenzar",

  // Install banner
  "installBanner.title": "Instala Drawer",
  "installBanner.withPrompt": "Úsala como una app, sin abrir el navegador cada vez.",
  "installBanner.ios": "Toca el botón de compartir {shareIcon} y luego “Agregar a pantalla de inicio”.",
  "installBanner.android": "Abre el menú ⋮ de tu navegador y elige “Instalar app” o “Agregar a pantalla de inicio”.",
  "installBanner.desktopSafari": "Safari de escritorio no permite instalar apps — ábrela en Chrome para instalarla ahí.",
  "installBanner.other": "Busca el ícono de instalar en la barra de direcciones de tu navegador.",
  "installBanner.install": "Instalar",
  "installBanner.closeAria": "Cerrar",

  // Theme picker
  "theme.label": "Tema",
  "theme.description": "Cambia el acento de Drawer. El fondo se mantiene oscuro.",

  // Language picker
  "language.label": "Idioma",
  "language.description": "Cambia el idioma de la app.",
  "language.es": "Español",
  "language.en": "English",

  // Login
  "login.subtitle": "Tu cajón de notas, prompts y herramientas.",
  "login.emailLabel": "Correo",
  "login.emailPlaceholder": "tu@correo.com",
  "login.passwordLabel": "Contraseña",
  "login.signingIn": "Entrando…",
  "login.creatingAccount": "Creando cuenta…",
  "login.signIn": "Entrar",
  "login.signUp": "Crear cuenta",
  "login.toggleToSignup": "¿No tienes cuenta? Regístrate",
  "login.toggleToSignin": "¿Ya tienes cuenta? Entra",
  "login.errorWrongCredentials": "Correo o contraseña incorrectos — intenta de nuevo.",
  "login.errorSignupGeneric": "No se pudo crear la cuenta.",
  "login.checkEmail": "Te mandamos un correo a {email} para confirmar tu cuenta. Ábrelo y luego regresa a entrar.",

  // Account
  "account.title": "Cuenta",
  "account.currentPasswordLabel": "Contraseña actual",
  "account.newPasswordLabel": "Nueva contraseña",
  "account.strengthWeak": "Débil",
  "account.strengthRegular": "Regular",
  "account.strengthStrong": "Fuerte",
  "account.saving": "Guardando…",
  "account.savePassword": "Guardar contraseña",
  "account.saved": "Contraseña actualizada. Ya puedes usarla para entrar.",
  "account.errorSession": "No se pudo verificar tu sesión — intenta iniciar sesión de nuevo.",
  "account.errorWrongCurrent": "La contraseña actual no es correcta.",
  "account.errorGeneric": "Algo salió mal — intenta de nuevo.",
  "account.signOut": "Cerrar sesión",

  // Notes list / editor
  "notes.search": "Buscar…",
  "notes.allTags": "Todas",
  "notes.count": "{filtered} de {total} notas",
  "notes.new": "Nueva nota",
  "notes.noResults": "Sin resultados.",
  "notes.empty": "Todavía no tienes notas.",
  "notes.copy": "Copiar",
  "notes.copied": "Copiado",
  "notes.copyError": "Error",
  "notes.editAria": "Editar",
  "notes.deleteAria": "Borrar",
  "notes.selectPrompt": "Selecciona una nota para verla aquí.",
  "notes.copyNote": "Copiar nota",
  "notes.editTitle": "Editar nota",
  "notes.newTitle": "Nueva nota",
  "notes.closeAria": "Cerrar",
  "notes.copiedToast": "Copiado al portapapeles",
  "notes.deleteDialogTitle": "¿Borrar esta nota?",
  "notes.deleteDialogBody": "“{title}” se borrará permanentemente. No se puede deshacer.",
  "notes.keep": "Mantener",
  "notes.delete": "Borrar",
  "notes.editorTitleLabel": "Título",
  "notes.editorTitlePlaceholder": "Título (opcional)",
  "notes.editorTagsLabel": "Tags (separados por coma)",
  "notes.editorTagsPlaceholder": "prompts, ideas",
  "notes.editorContentLabel": "Contenido",
  "notes.editorContentPlaceholder": "Escribe tu nota, prompt o idea…",
  "notes.editorSaveError": "No se pudo guardar — intenta de nuevo.",
  "notes.saving": "Guardando…",
  "notes.save": "Guardar",
  "notes.cancel": "Cancelar",

  // Tools hub
  "tools.title": "Herramientas",
  "tools.badge": "todo corre en tu navegador",
  "tools.description":
    "Trabajos ocasionales que no van en una nota. Los archivos se leen localmente, se procesan localmente, y se entregan de vuelta — nada se sube a ningún lado.",
  "tools.zip.title": "ZIP",
  "tools.zip.description": "Comprime archivos o extrae un .zip.",
  "tools.image.title": "Convertir imagen",
  "tools.image.description": "PNG, JPEG o WebP, sin subir nada.",
  "tools.media.title": "Convertir audio y video",
  "tools.media.description": "Cambia de formato directo en el navegador.",
  "tools.recent": "Recientes",
  "tools.noRecent": "Sin conversiones recientes.",
  "tools.recentNote": "Se guarda solo en este navegador, se borra después de 24 horas.",
  "tools.relative.yesterday": "ayer",
  "tools.relative.justNow": "hace un momento",
  "tools.relative.minutes": "hace {n} min",
  "tools.relative.hoursOne": "hace {n} hora",
  "tools.relative.hoursMany": "hace {n} horas",

  // Image tool
  "toolImage.title": "Convertir imagen",
  "toolImage.choose": "Elegir imagen",
  "toolImage.converting": "Convirtiendo…",
  "toolImage.error": "No se pudo convertir esta imagen.",
  "toolImage.downloaded": "descargado",

  // Media tool
  "toolMedia.title": "Convertir audio/video",
  "toolMedia.choose": "Elegir archivo",
  "toolMedia.preparing": "Preparando…",
  "toolMedia.converting": "Convirtiendo… {n}%",
  "toolMedia.downloaded": "descargado",
  "toolMedia.convertAnother": "Convertir otro archivo",
  "toolMedia.retry": "Reintentar",
  "toolMedia.error": "Algo salió mal al convertir — intenta de nuevo.",

  // Zip tool
  "toolZip.title": "ZIP",
  "toolZip.compressTitle": "Comprimir",
  "toolZip.chooseFiles": "Elegir archivos",
  "toolZip.removeAria": "Quitar {name}",
  "toolZip.compressing": "Comprimiendo…",
  "toolZip.createZip": "Crear .zip",
  "toolZip.decompressTitle": "Descomprimir",
  "toolZip.chooseZip": "Elegir un .zip",
  "toolZip.extractAll": "Descargar todo",
  "toolZip.decompressing": "Descomprimiendo…",
  "toolZip.clear": "Limpiar",
  "toolZip.labelCompressed": "Comprimido",
  "toolZip.labelDecompressed": "Descomprimido",
};

const en: Dict = {
  // Sidebar
  "sidebar.notes": "Notes",
  "sidebar.tools": "Tools",
  "sidebar.zip": "ZIP",
  "sidebar.image": "Convert image",
  "sidebar.media": "Audio & video",
  "sidebar.account": "Account",
  "sidebar.help": "Help",
  "sidebar.helpAria": "View welcome guide",
  "sidebar.collapse": "Collapse",
  "sidebar.expand": "Expand",
  "sidebar.collapseAria": "Collapse sidebar",
  "sidebar.expandAria": "Expand sidebar",
  "sidebar.openMenu": "Open menu",
  "sidebar.closeMenu": "Close menu",

  // Onboarding
  "onboarding.step1.title": "Welcome to Drawer!",
  "onboarding.step1.body":
    "Your personal drawer for notes, prompts, and ideas — with one-click copy.",
  "onboarding.step2.title": "Create and organize your notes",
  "onboarding.step2.body":
    "Search them, tag them, and use the copy button to take them wherever you need, instantly.",
  "onboarding.step3.title": "ZIP, images, and audio/video",
  "onboarding.step3.body":
    "Everything runs in your browser — nothing is uploaded, your files never leave your device.",
  "onboarding.step4.title": "Make it yours",
  "onboarding.step4.body":
    "Change the color from Account, and add it to your home screen to use it like a real app.",
  "onboarding.step5.title": "You're all set!",
  "onboarding.step5.body":
    "You know the basics now. You can revisit this guide anytime with the help button.",
  "onboarding.back": "Back",
  "onboarding.skip": "Skip",
  "onboarding.next": "Next",
  "onboarding.start": "Get started",

  // Install banner
  "installBanner.title": "Install Drawer",
  "installBanner.withPrompt": "Use it like an app, without opening the browser every time.",
  "installBanner.ios": "Tap the share button {shareIcon} then “Add to Home Screen”.",
  "installBanner.android": "Open your browser's ⋮ menu and pick “Install app” or “Add to Home Screen”.",
  "installBanner.desktopSafari": "Desktop Safari doesn't support installing apps — open it in Chrome to install it there.",
  "installBanner.other": "Look for the install icon in your browser's address bar.",
  "installBanner.install": "Install",
  "installBanner.closeAria": "Close",

  // Theme picker
  "theme.label": "Theme",
  "theme.description": "Change Drawer's accent color. The background stays dark.",

  // Language picker
  "language.label": "Language",
  "language.description": "Change the app's language.",
  "language.es": "Español",
  "language.en": "English",

  // Login
  "login.subtitle": "Your drawer for notes, prompts, and tools.",
  "login.emailLabel": "Email",
  "login.emailPlaceholder": "you@email.com",
  "login.passwordLabel": "Password",
  "login.signingIn": "Signing in…",
  "login.creatingAccount": "Creating account…",
  "login.signIn": "Sign in",
  "login.signUp": "Create account",
  "login.toggleToSignup": "Don't have an account? Sign up",
  "login.toggleToSignin": "Already have an account? Sign in",
  "login.errorWrongCredentials": "Wrong email or password — try again.",
  "login.errorSignupGeneric": "Couldn't create the account.",
  "login.checkEmail": "We sent an email to {email} to confirm your account. Open it, then come back and sign in.",

  // Account
  "account.title": "Account",
  "account.currentPasswordLabel": "Current password",
  "account.newPasswordLabel": "New password",
  "account.strengthWeak": "Weak",
  "account.strengthRegular": "Fair",
  "account.strengthStrong": "Strong",
  "account.saving": "Saving…",
  "account.savePassword": "Save password",
  "account.saved": "Password updated. You can use it to sign in now.",
  "account.errorSession": "Couldn't verify your session — try signing in again.",
  "account.errorWrongCurrent": "Current password is incorrect.",
  "account.errorGeneric": "Something went wrong — try again.",
  "account.signOut": "Sign out",

  // Notes list / editor
  "notes.search": "Search…",
  "notes.allTags": "All",
  "notes.count": "{filtered} of {total} notes",
  "notes.new": "New note",
  "notes.noResults": "No results.",
  "notes.empty": "You don't have any notes yet.",
  "notes.copy": "Copy",
  "notes.copied": "Copied",
  "notes.copyError": "Error",
  "notes.editAria": "Edit",
  "notes.deleteAria": "Delete",
  "notes.selectPrompt": "Select a note to view it here.",
  "notes.copyNote": "Copy note",
  "notes.editTitle": "Edit note",
  "notes.newTitle": "New note",
  "notes.closeAria": "Close",
  "notes.copiedToast": "Copied to clipboard",
  "notes.deleteDialogTitle": "Delete this note?",
  "notes.deleteDialogBody": "“{title}” will be permanently deleted. This can't be undone.",
  "notes.keep": "Keep",
  "notes.delete": "Delete",
  "notes.editorTitleLabel": "Title",
  "notes.editorTitlePlaceholder": "Title (optional)",
  "notes.editorTagsLabel": "Tags (comma-separated)",
  "notes.editorTagsPlaceholder": "prompts, ideas",
  "notes.editorContentLabel": "Content",
  "notes.editorContentPlaceholder": "Write your note, prompt, or idea…",
  "notes.editorSaveError": "Couldn't save — try again.",
  "notes.saving": "Saving…",
  "notes.save": "Save",
  "notes.cancel": "Cancel",

  // Tools hub
  "tools.title": "Tools",
  "tools.badge": "everything runs in your browser",
  "tools.description":
    "One-off jobs that don't belong in a note. Files are read locally, processed locally, and handed back — nothing is uploaded anywhere.",
  "tools.zip.title": "ZIP",
  "tools.zip.description": "Compress files or extract a .zip.",
  "tools.image.title": "Convert image",
  "tools.image.description": "PNG, JPEG, or WebP — nothing uploaded.",
  "tools.media.title": "Convert audio and video",
  "tools.media.description": "Change format right in your browser.",
  "tools.recent": "Recent",
  "tools.noRecent": "No recent conversions.",
  "tools.recentNote": "Saved only in this browser, cleared after 24 hours.",
  "tools.relative.yesterday": "yesterday",
  "tools.relative.justNow": "just now",
  "tools.relative.minutes": "{n} min ago",
  "tools.relative.hoursOne": "{n} hour ago",
  "tools.relative.hoursMany": "{n} hours ago",

  // Image tool
  "toolImage.title": "Convert image",
  "toolImage.choose": "Choose image",
  "toolImage.converting": "Converting…",
  "toolImage.error": "Couldn't convert this image.",
  "toolImage.downloaded": "downloaded",

  // Media tool
  "toolMedia.title": "Convert audio/video",
  "toolMedia.choose": "Choose file",
  "toolMedia.preparing": "Preparing…",
  "toolMedia.converting": "Converting… {n}%",
  "toolMedia.downloaded": "downloaded",
  "toolMedia.convertAnother": "Convert another file",
  "toolMedia.retry": "Retry",
  "toolMedia.error": "Something went wrong converting — try again.",

  // Zip tool
  "toolZip.title": "ZIP",
  "toolZip.compressTitle": "Compress",
  "toolZip.chooseFiles": "Choose files",
  "toolZip.removeAria": "Remove {name}",
  "toolZip.compressing": "Compressing…",
  "toolZip.createZip": "Create .zip",
  "toolZip.decompressTitle": "Decompress",
  "toolZip.chooseZip": "Choose a .zip",
  "toolZip.extractAll": "Download all",
  "toolZip.decompressing": "Decompressing…",
  "toolZip.clear": "Clear",
  "toolZip.labelCompressed": "Compressed",
  "toolZip.labelDecompressed": "Decompressed",
};

const dictionaries: Record<Lang, Dict> = { es, en };

export function isLang(value: string | null): value is Lang {
  return value === "es" || value === "en";
}

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = dictionaries[lang][key] ?? dictionaries.es[key] ?? key;
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (str, [name, value]) => str.replaceAll(`{${name}}`, String(value)),
    template,
  );
}
