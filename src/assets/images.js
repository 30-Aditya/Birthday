// Robust asset loader: detect JPEG/PNG/MP4 files in this folder,
// choose uploaded Image1..Image5 by filename heuristics, then map
// them to the site's image slots per the project mapping rules.
// Vite: use import.meta.glob with `{ eager: true }` — `globEager` is not supported in some setups.
// Include more formats (svg, webp, gif) and be forgiving about casing.
const modules = import.meta.glob('./*.{jpeg,jpg,png,mp4,svg,webp,gif}', { eager: true })
const fileMap = {}
for(const p in modules){
  const m = modules[p]
  const url = (m && (m.default || m)) || null
  if(!url) continue
  const name = p.replace('./','')
  fileMap[name] = url
}

function findExact(name){ return fileMap[name] || null }
function findContains(substr){
  const key = Object.keys(fileMap).find(k=> k.toLowerCase().includes(substr.toLowerCase()))
  return key ? fileMap[key] : null
}

// Candidate uploaded filenames per original brief (try exact matches first)
const IMAGE_CANDIDATES = {
  image1: ['KP_❤️', 'KP_', 'KP', 'kp'],
  image2: ['14.55.08', 'WhatsApp Image 2026-06-08 at 14.55.08'],
  image3: ['14.55.09', '94510d64', 'whatsapp 94510d64'],
  image4: ['16.23', '560476b0', '560476'],
  image5: ['16.25', 'fc9ad297', 'fc9ad']
}

// Resolve a candidate list to an actual file URL, with fallbacks by substring.
function resolveCandidate(list, substrFallback){
  for(const name of list){ if(findExact(name)) return findExact(name) }
  if(substrFallback && findContains(substrFallback)) return findContains(substrFallback)
  return null
}

// Determine Image1..Image5 (uploaded)
const uploadedImage1 = resolveCandidate(IMAGE_CANDIDATES.image1, 'kp_') || findContains('kp')
const uploadedImage2 = resolveCandidate(IMAGE_CANDIDATES.image2, '14.55.08')
const uploadedImage3 = resolveCandidate(IMAGE_CANDIDATES.image3, '14.55.09')
const uploadedImage4 = resolveCandidate(IMAGE_CANDIDATES.image4, '16.23')
const uploadedImage5 = resolveCandidate(IMAGE_CANDIDATES.image5, '16.25') || findContains('KP.')

// Find any mp4 in the folder for special video (case-insensitive)
let specialVideo = null
for(const k of Object.keys(fileMap)){ if(k.toLowerCase().endsWith('.mp4')){ specialVideo = fileMap[k]; break } }

// Public fallback assets (existing SVGs in public/assets)
const baseUrl = import.meta.env.BASE_URL || '/'
const publicFallbacks = {
  pub1: `${baseUrl}assets/khushi1.svg`,
  pub2: `${baseUrl}assets/khushi2.svg`,
  pub3: `${baseUrl}assets/khushi3.svg`,
  pub4: `${baseUrl}assets/khushi4.svg`,
  pub5: `${baseUrl}assets/khushi5.svg`
}

// Map site image slots per mapping rule in the brief:
// - site `khushi1` should use uploaded Image2
// - site `khushi2` should use uploaded Image3
// - site `khushi3` should use uploaded Image1
// - site `khushi4` should use uploaded Image4
// - site `khushi5` should use uploaded Image5
export const images = {
  khushi1: uploadedImage2 || publicFallbacks.pub1,
  khushi2: uploadedImage3 || publicFallbacks.pub2,
  khushi3: uploadedImage1 || publicFallbacks.pub3,
  khushi4: uploadedImage4 || publicFallbacks.pub4,
  khushi5: uploadedImage5 || publicFallbacks.pub5
}

export const uploaded = {
  img1: uploadedImage1,
  img2: uploadedImage2,
  img3: uploadedImage3,
  img4: uploadedImage4,
  img5: uploadedImage5,
  specialVideo
}

// Export an array of all uploaded image URLs (exclude mp4s) so the gallery can
// render every uploaded photo the user places in `src/assets`.
const allUploaded = []
for(const k of Object.keys(fileMap)){
  if(k.toLowerCase().endsWith('.mp4')) continue
  // prefer user-uploaded files (not the public SVG fallback names)
  allUploaded.push(fileMap[k])
}
export { allUploaded }

export const piano = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
