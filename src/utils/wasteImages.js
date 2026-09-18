/**
 * High-definition Unsplash images for waste categories (matching real API waste types).
 * Resolution set to HD (?w=800&q=80).
 */
export const WASTE_IMAGES = {
  plastik: {
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80&auto=format&fit=crop',
    alt: 'Tumpukan botol plastik bekas daur ulang',
  },
  kertas: {
    url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80&auto=format&fit=crop',
    alt: 'Tumpukan kardus dan kertas karton bekas',
  },
  logam: {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    alt: 'Kaleng aluminium dan sampah logam daur ulang',
  },
  kaca: {
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop',
    alt: 'Botol kaca bening dan toples daur ulang',
  },
  default: {
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80&auto=format&fit=crop',
    alt: 'Sampah daur ulang terpilah',
  },
}

/**
 * Helper to get HD image info by category jenis/type
 * @param {string} jenis - 'plastik' | 'kertas' | 'logam' | 'kaca'
 * @returns {{ url: string, alt: string }}
 */
export function getWasteImage(jenis = '') {
  const key = String(jenis).toLowerCase().trim()
  return WASTE_IMAGES[key] || WASTE_IMAGES.default
}
