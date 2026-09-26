/** @type {import('next').NextConfig} */

const enProduction = process.env.NODE_ENV === 'production';

/**
 * En-tetes de securite.
 *
 * C'est cela, « un site securise » : reduire ce qu'un attaquant peut faire
 * si une faille existe. Aucun de ces en-tetes ne collecte quoi que ce soit
 * sur les visiteurs.
 */
const enTetesSecurite = [
  {
    // Interdit au navigateur de charger du code venu d'ailleurs que du site.
    // 'unsafe-inline' reste necessaire : Next.js injecte des scripts et des
    // styles en ligne. 'unsafe-eval' n'est tolere qu'en developpement.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${enProduction ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      // Pas de 'upgrade-insecure-requests' : Strict-Transport-Security ci-dessous
      // impose deja HTTPS sur tout le domaine, et cette directive empeche de
      // tester le site en local, ou le serveur n'ecoute qu'en HTTP.
    ].join('; '),
  },
  // Empeche d'afficher le site dans une iframe : parade au clickjacking,
  // ou un faux site superpose des boutons invisibles aux vrais.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Empeche le navigateur de deviner le type d'un fichier : un .txt piege
  // ne pourra pas etre execute comme du JavaScript.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Ne transmet pas l'adresse de la page consultee aux sites externes.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Le site n'a besoin ni de la camera, ni du micro, ni de la position.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // Impose HTTPS pour les deux prochaines annees, sous-domaines compris.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,

  async headers() {
    return [
      { source: '/:path*', headers: enTetesSecurite },
      {
        // Le journal contient des donnees personnelles : ni indexation,
        // ni mise en cache par un intermediaire.
        source: '/journal/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
};

export default nextConfig;
