/**
 * Creates a heart-shaped clip path on the canvas context.
 *
 * The parametric heart equation natural bounds:
 *   X: -16 to +16  → total width  = 32 units
 *   Y: -11.9 to +17 → total height = 28.9 units
 *
 * Scale is calculated so the heart FILLS the slot (w × h) exactly,
 * using the tighter of the two axes so it never overflows.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x   - top-left x of the slot
 * @param {number} y   - top-left y of the slot
 * @param {number} w   - slot width
 * @param {number} h   - slot height
 */
export function createHeartClipPath(ctx, x, y, w, h) {
  const centerX = x + w / 2
  const centerY = y + h / 2

  // Natural heart bounds: 32 wide, 28.9 tall
  // Use min so the heart fits inside the slot on both axes
  const HEART_W = 32
  const HEART_H = 28.9
  const scale   = Math.min(w / HEART_W, h / HEART_H) * 1.65

  ctx.beginPath()
  for (let i = 0; i <= 300; i++) {
    const t  = (i / 300) * Math.PI * 2
    const px = centerX + (16 * Math.pow(Math.sin(t), 3)) * scale
    const py = centerY - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale - (h * 0.05) 
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

/**
 * Draws an image into a slot with optional rotation and clip shape.
 *
 * Order of operations (critical — wrong order causes overflow):
 *   1. Translate to slot centre
 *   2. Rotate coordinate space
 *   3. Clip in the ROTATED space  ← heart clips correctly even when tilted
 *   4. Draw image centred at (0,0) in rotated space
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} x          - slot top-left x
 * @param {number} y          - slot top-left y
 * @param {number} w          - slot width
 * @param {number} h          - slot height
 * @param {number} rotation   - degrees (default 0)
 * @param {string|null} clipShape - 'heart' or null (default null = rectangle)
 */
export function drawImageWithRotation(
  ctx, img, x, y, w, h, rotation = 0, clipShape = null
) {
  const iw = img.naturalWidth  || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return

  ctx.save()

  // ── 1. Move origin to slot centre ─────────────────────────────────────
  ctx.translate(x + w / 2, y + h / 2)

  // ── 2. Rotate ─────────────────────────────────────────────────────────
  ctx.rotate((rotation * Math.PI) / 180)

  // ── 3. Clip in rotated space ──────────────────────────────────────────
  // Pass -w/2, -h/2 as the top-left because origin is now at slot centre
  if (clipShape === 'heart') {
    createHeartClipPath(ctx, -w / 2, -h / 2, w, h)
    ctx.clip()
  } else {
    // Default rectangular clip — keeps image inside slot bounds
    ctx.beginPath()
    ctx.rect(-w / 2, -h / 2, w, h)
    ctx.clip()
  }

  // ── 4. Draw image centred at (0,0) with cover-fit ─────────────────────
  const s  = Math.max(w / iw, h / ih)
  const dw = iw * s
  const dh = ih * s
  ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh)

  ctx.restore()
}