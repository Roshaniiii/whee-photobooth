import template1_strip1 from '../assets/template1_strip1.png'
import template1_strip2 from '../assets/template1_strip2.png'
import template1_strip5 from '../assets/template1_strip5.png'
import template2_strip1 from '../assets/template2_strip1.png'
import template2_strip2 from '../assets/template2_strip2.png'
import template3_strip1 from '../assets/template3_strip1.png'
import template3_strip2 from '../assets/template3_strip2.png'
import template4_strip1 from '../assets/template4_strip1.png'
import template4_strip2 from '../assets/template4_strip2.png'

// ── Different dimension template imports ──────────────────────────────────
import template1_strip4 from '../assets/template1_strip4.png'
import template1_strip3 from '../assets/template1_strip3.png'
import template2_strip3 from '../assets/template2_strip3.png'
import template3_strip3 from '../assets/template3_strip3.png'
import template3_strip4 from '../assets/template3_strip4.png'
import template2_strip4 from '../assets/template2_strip4.png'
import template4_strip3 from '../assets/template4_strip3.png'

// ── Collage template imports ──────────────────────────────────
import collage_strip1 from '../assets/collage_strip1.png'
import collage_strip2 from '../assets/collage_strip2.png'
import collage_strip3 from '../assets/collage_strip3.png'
import collage_strip4 from '../assets/collage_strip4.png'

const PHOTO_W = 500
const PHOTO_H = 410

// New dimensions for strip 1, strip 3 and 4
const PHOTO_W1 = 550
const PHOTO_H1 = 440
const PHOTO_W3 = 520
const PHOTO_H3 = 430
const PHOTO_W4 = 540
const PHOTO_H4 = 410


function slot(x, y, w = PHOTO_W, h = PHOTO_H, rotation = 0, clipShape = null) {
  return { x, y, width: w, height: h, rotation, clipShape }
}

export const TEMPLATES = [
  {
    id: 'template1_strip1',
    label: 'Solo — A',
    shots: 1,
    file: template1_strip1,
    canvasWidth: 600,
    canvasHeight: 700,
    slots: [slot(50, 60)],
  },
  {
    id: 'template1_strip2',
    label: 'Solo — B',
    shots: 1,
    file: template1_strip2,
    canvasWidth: 600,
    canvasHeight: 700,
    slots: [slot(50, 60)],
  },
  {
    id: 'template1_strip3',
    label: 'Solo — C',
    shots: 1,
    file: template1_strip3,
    canvasWidth: 600, canvasHeight: 700,
    slots: [slot(50, 60)],
  },
  {
    id: 'template1_strip4',
    label: 'Solo — D',
    shots: 1,
    file: template1_strip4,
    canvasWidth: 600, canvasHeight: 700,
    slots: [slot(25, 25, PHOTO_W1, PHOTO_H1)],
  },
  {
    id: 'template1_strip5',
    label: 'Solo — E',
    shots: 1,
    file: template1_strip5,
    canvasWidth: 600, canvasHeight: 700,
    slots: [slot(50, 60)],
  },
 {
    id: 'template2_strip1',
    label: 'Duo — A',
    shots: 2,
    file: template2_strip1,
    canvasWidth: 600,
    canvasHeight: 1100,
    slots: [slot(50, 85), slot(50, 570)],
  },
  {
    id: 'template2_strip2',
    label: 'Duo — B',
    shots: 2,
    file: template2_strip2,
    canvasWidth: 600,
    canvasHeight: 1100,
    slots: [slot(50, 85), slot(50, 570)],
  },
  {
    id: 'template2_strip3',
    label: 'Duo — C',
    shots: 2,
    file: template2_strip3,
    canvasWidth: 600, canvasHeight: 1100,
    slots: [slot(50, 50), slot(50, 500)],
  },
  {
    id: 'template2_strip4',
    label: 'Duo — D',
    shots: 2,
    file: template2_strip4,
    canvasWidth: 600, canvasHeight: 1100,
    slots: [slot(50, 50), slot(50, 500)],
  },
  {
    id: 'template3_strip1',
    label: 'Trio — A',
    shots: 3,
    file: template3_strip1,
    canvasWidth: 600,
    canvasHeight: 1600,
    slots: [slot(50, 85), slot(50, 570), slot(50, 1055)],
  },
  {
    id: 'template3_strip2',
    label: 'Trio — B',
    shots: 3,
    file: template3_strip2,
    canvasWidth: 600,
    canvasHeight: 1600,
    slots: [slot(50, 85), slot(50, 570), slot(50, 1055)],
  },
  {
    id: 'template3_strip3',
    label: 'Trio — C',
    shots: 3,
    file: template3_strip3,
    canvasWidth: 600, canvasHeight: 1600,
    slots: [
      slot(40, 30,  PHOTO_W3, PHOTO_H3),
      slot(40, 490, PHOTO_W3, PHOTO_H3),
      slot(40, 950, PHOTO_W3, PHOTO_H3),
    ],
  },
  {
    id: 'template3_strip4',
    label: 'Trio — D',
    shots: 3,
    file: template3_strip4,
    canvasWidth: 600,
    canvasHeight: 1600,
    slots: [slot(50, 45), slot(50, 500), slot(50, 955)],
  },
  {
    id: 'template4_strip1',
    label: 'Quad — A',
    shots: 4,
    file: template4_strip1,
    canvasWidth: 600,
    canvasHeight: 2000,
    slots: [slot(50, 70), slot(50, 530), slot(50, 990), slot(50, 1450)],
  },
  {
    id: 'template4_strip2',
    label: 'Quad — B',
    shots: 4,
    file: template4_strip2,
    canvasWidth: 600,
    canvasHeight: 2000,
    slots: [slot(50, 70), slot(50, 530), slot(50, 990), slot(50, 1450)],
  },
  {
    id: 'template4_strip3',
    label: 'Quad — C',
    shots: 4,
    file: template4_strip3,
    canvasWidth: 600, canvasHeight: 2000,
    slots: [
      slot(30, 30,   PHOTO_W4, PHOTO_H4),
      slot(30, 470,  PHOTO_W4, PHOTO_H4),
      slot(30, 910,  PHOTO_W4, PHOTO_H4),
      slot(30, 1350, PHOTO_W4, PHOTO_H4),
    ],
  },
  {
  id: 'collage_strip1',
    label: 'Collage — A',
    shots: 11,
    file: collage_strip1,
    canvasWidth: 1200,
    canvasHeight: 1200,
    slots: [
      slot(217.5, 120,   310, 180),
      slot(672.5, 120,   310, 180),
      slot(52.5,  309,   320, 300),
      slot(382.5, 309,   435, 300),
      slot(827.5, 309,   320, 300),
      slot(231.5, 618,   240, 140),
      slot(480.3, 618,   240, 140),
      slot(729.3, 618,   240, 140),
      slot(380,   766.6, 220, 140),
      slot(608.5, 766.6, 220, 140),
      slot(528.3, 915.6, 150, 150),
    ],
  },
  {
    id: 'collage_strip2',
    label: 'Collage — B',
    shots: 9,
    file: collage_strip2,
    canvasWidth: 1200,
    canvasHeight: 1200,
    slots: [
      slot(0,   0,   396, 396),
      slot(402, 0,   396, 396),
      slot(804, 0,   396, 396),
      slot(0,   402, 396, 396),
      slot(402, 402, 396, 396),
      slot(804, 402, 396, 396),
      slot(0,   804, 396, 396),
      slot(402, 804, 396, 396),
      slot(804, 804, 396, 396),
    ],
  },
  {
    id: 'heart_duo',
    label: 'Heart Duo',
    shots: 2,
    file: collage_strip3, 
    canvasWidth: 1200,
    canvasHeight: 1200,
    slots: [
      slot(120, 392, 450, 496, -12, 'heart'),  // Left image with -25° rotation
      slot(630, 260, 450, 496, 0, 'heart'),   // Right image with no rotation
    ],
  },
  {
    id: 'collage_strip4',
    label: 'Collage — D',
    shots: 3,
    file: collage_strip4,
    canvasWidth: 600, 
    canvasHeight: 700,
    slots: [
      slot( 7,  72,  185, 160), 
      slot(210, 255, 185, 160),
      slot(410, 432, 185, 160),
    ],
  },
]

export const TEMPLATE_ASSETS = Object.fromEntries(
  TEMPLATES.map(t => [t.id, t.file]),
)

export const TEMPLATE_CONFIGS = Object.fromEntries(
  TEMPLATES.map(t => [
    t.id,
    { canvasWidth: t.canvasWidth, canvasHeight: t.canvasHeight, slots: t.slots },
  ]),
)
