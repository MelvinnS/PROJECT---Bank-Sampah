import { getWasteImage } from '../../utils/wasteImages'

/**
 * WasteIcon component that renders a crisp, high-definition real Unsplash photograph
 * with proper aspect ratio, object-cover, and descriptive alt text for accessibility.
 */
export default function WasteIcon({ jenis = 'plastik', className = '' }) {
  const { url, alt } = getWasteImage(jenis)

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
