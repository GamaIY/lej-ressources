/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100 % statique : `next build` produit des fichiers HTML, aucun serveur.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
