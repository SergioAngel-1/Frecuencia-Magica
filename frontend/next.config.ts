import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Las imágenes editoriales ya vienen comprimidas una vez, en variantes por
    // ancho (`npm run editorial:ingest`): el loader elige la variante y
    // `next/image` deja de re-codificarlas.
    loader: 'custom',
    loaderFile: './src/lib/editorial/image-loader.ts',
  },
};

export default withNextIntl(nextConfig);
