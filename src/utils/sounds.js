const PLAYBACK_RATE = 1.45

const clickSound = new Audio('/click_sound.mp3')
clickSound.volume = 0.5

const hoverSound = new Audio('/hover_sound.mp3')
hoverSound.volume = 0.4

const captureSound = new Audio('/capture_sound.mp3')
captureSound.volume = 0.55

function play(audio) {
  audio.playbackRate = PLAYBACK_RATE
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export function playClick() {
  play(clickSound)
}

export function playHover() {
  play(hoverSound)
}

export function playCapture() {
  play(captureSound)
}
