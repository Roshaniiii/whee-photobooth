const clickSound = new Audio('/click_sound.mp3')
clickSound.volume = 0.5

const hoverSound = new Audio('/hover_sound.mp3')
hoverSound.volume = 0.4

export function playClick() {
  clickSound.currentTime = 0
  clickSound.play()
}

export function playHover() {
  hoverSound.currentTime = 0
  hoverSound.play()
}