import sampahBotolImg from '../assets/images/sampahbotol.jpg'
import sampahKalengImg from '../assets/images/sampahkaleng.jpg'
import sampahKardusImg from '../assets/images/sampahkardus.jpg'

/**
 * Waste category default images mapping.
 * Uses local image files for kaca (sampahbotol.jpg), kertas (sampahkardus.jpg), logam (sampahkaleng.jpg),
 * and retains plastic image for plastik.
 */
export const WASTE_IMAGES = {
  plastik: {
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80&auto=format&fit=crop',
    alt: 'Tumpukan botol plastik bekas daur ulang',
  },
  kertas: {
    url: sampahKardusImg,
    alt: 'Tumpukan kardus dan kertas karton bekas',
  },
  logam: {
    url: sampahKalengImg,
    alt: 'Kaleng aluminium dan sampah logam daur ulang',
  },
  kaca: {
    url: sampahBotolImg,
    alt: 'Botol kaca bening dan toples daur ulang',
  },
  default: {
    url: sampahBotolImg,
    alt: 'Sampah daur ulang terpilah',
  },
}

/**
 * Helper to get image info by category object, name, or jenis
 * @param {string|object} itemOrJenis - category item object or jenis string
 * @returns {{ url: string, alt: string }}
 */
export function getWasteImage(itemOrJenis = '') {
  let text = ''
  if (typeof itemOrJenis === 'object' && itemOrJenis !== null) {
    text = `${itemOrJenis.namaKategori || itemOrJenis.nama || ''} ${itemOrJenis.jenis || ''}`.toLowerCase()
  } else {
    text = String(itemOrJenis || '').toLowerCase().trim()
  }

  // KECUALI section botol plastik
  if (text.includes('botol plastik') || text.includes('plastik')) {
    return WASTE_IMAGES.plastik
  }
  if (text.includes('kardus') || text.includes('kertas') || text.includes('karton')) {
    return WASTE_IMAGES.kertas
  }
  if (text.includes('kaleng') || text.includes('logam') || text.includes('besi') || text.includes('aluminium')) {
    return WASTE_IMAGES.logam
  }
  if (text.includes('kaca') || text.includes('botol')) {
    return WASTE_IMAGES.kaca
  }
  return WASTE_IMAGES[text] || WASTE_IMAGES.default
}
