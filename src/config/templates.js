import template1_strip1 from '../assets/template1_strip1.png'
import template1_strip2 from '../assets/template1_strip2.png'
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
import template2_strip4 from '../assets/template2_strip4.png'
import template4_strip3 from '../assets/template4_strip3.png'

const PHOTO_W = 500
const PHOTO_H = 410

// New dimensions for strip 1, strip 3 and 4
const PHOTO_W1 = 550
const PHOTO_H1 = 440
const PHOTO_W3 = 520
const PHOTO_H3 = 430
const PHOTO_W4 = 540
const PHOTO_H4 = 410

function slot(x, y, w = PHOTO_W, h = PHOTO_H) {
  return { x, y, width: w, height: h }
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
