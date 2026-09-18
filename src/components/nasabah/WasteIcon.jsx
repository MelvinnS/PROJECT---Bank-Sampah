import { getWasteImage } from '../../utils/wasteImages'

/**
 * WasteIcon component that renders matching category image (local assets or HD Unsplash)
 * with proper aspect ratio, object-cover, and descriptive alt text.
 */
export default function WasteIcon({ jenis = 'plastik', item = null, className = '' }) {
  const { url, alt } = getWasteImage(item || jenis)

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  )
}
