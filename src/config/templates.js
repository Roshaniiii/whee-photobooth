import template1_strip1 from '../assets/template1_strip1.png'
import template1_strip2 from '../assets/template1_strip2.png'
import template2_strip1 from '../assets/template2_strip1.png'
import template2_strip2 from '../assets/template2_strip2.png'
import template3_strip1 from '../assets/template3_strip1.png'
import template3_strip2 from '../assets/template3_strip2.png'
import template4_strip1 from '../assets/template4_strip1.png'
import template4_strip2 from '../assets/template4_strip2.png'

const PHOTO_W = 500
const PHOTO_H = 410

function slot(x, y) {
  return { x, y, width: PHOTO_W, height: PHOTO_H }
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
