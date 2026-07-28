import Link from 'next/link';

/**
 * 404 raíz — fuera del árbol de `[locale]`.
 *
 * El matcher de `src/middleware.ts` cubre prácticamente cualquier ruta de la
 * aplicación, así que en la práctica casi nunca se alcanza este archivo: la
 * mayoría de rutas sin página propia terminan en el catch-all
 * `[locale]/[...rest]/page.tsx`, que sí conoce el idioma. Este archivo sólo
 * cubre el resto — una petición que ni siquiera llega a `[locale]`.
 *
 * `not-found.js` no recibe `params` (ninguno lo hace, ver docs de Next), así
 * que aquí no hay locale que resolver ni traducciones que pedir. Tampoco
 * hay `[locale]/layout.tsx` por encima: sin `<html>`/`<body>` propios, Next
 * usaría los suyos por defecto, así que este archivo los declara para
 * mantener la paleta de marca. Se mantiene deliberadamente mínimo — sin
 * `WorldEngine`, sin fuentes cargadas — pero en español (idioma por
 * defecto) y con el mismo lenguaje de marca: fondo void, texto ivory, un
 * enlace de vuelta al portal, que el middleware ya resolverá al idioma
 * correcto al aterrizar.
 *
 * Usa el `Link` de `next/link`, no el de `@/i18n/navigation`: este último
 * resuelve el pathname localizado a partir del locale activo en la ruta, y
 * aquí no hay ninguno — es la única excepción a esa regla en el proyecto.
 */
export default function RootNotFound() {
  return (
    <html lang="es">
      <head>
        <title>Frecuencia Mágica</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 300,
          color: '#F7F4EA',
          background:
            'radial-gradient(140% 100% at 50% -10%, #16273f 0%, #0F1B2E 45%, #0a1220 100%)',
        }}
      >
        <p style={{ margin: 0, fontSize: '24px', lineHeight: 1.4, maxWidth: '34ch' }}>
          Este lugar aún no existe
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            maxWidth: '42ch',
            opacity: 0.7,
          }}
        >
          El camino que buscabas se desvaneció. Vuelve al portal y elige otra puerta.
        </p>
        <Link
          href="/"
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            minHeight: '44px',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 28px',
            borderRadius: '999px',
            border: '1px solid rgba(247,244,234,0.22)',
            color: '#F7F4EA',
            textDecoration: 'none',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '17px',
          }}
        >
          Volver al portal
        </Link>
      </body>
    </html>
  );
}
