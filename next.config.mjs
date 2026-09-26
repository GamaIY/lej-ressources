/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les pages de contenu restent pre-generees au build. Seules la route
  // /api/journal et la page /journal s'executent a la demande : sans cela,
  // rien ne pourrait enregistrer une adresse IP.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
