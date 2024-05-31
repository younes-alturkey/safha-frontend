import { Fireworks } from 'fireworks-js'
import { FC, useEffect, useState } from 'react'

interface FireworksContainerProps {
  play: boolean
  dur: number
  onDone?: () => void
}

const FireworksContainer: FC<FireworksContainerProps> = props => {
  const [fireworks, setFireworks] = useState<Fireworks | null>(null)

  const onDone = () => {
    if (fireworks) fireworks.stop()
    if (props.onDone) props.onDone()
  }

  const playFireWorks = () => {
    if (fireworks) {
      fireworks.start()
      setTimeout(onDone, props.dur)
    }
  }

  const initFireworks = () => {
    const container = window.document.querySelector('.fireworks-container') as HTMLElement
    setFireworks(
      new Fireworks(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 50,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 30,
          max: 60
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3
          },
          trace: {
            min: 1,
            max: 2
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      })
    )
  }

  useEffect(() => {
    if (!fireworks) initFireworks()
    if (props.play) playFireWorks()
  }, [props.play, fireworks])

  return <div className={`fireworks-container ${props.play ? 'block' : 'invisible'}`} />
}

export default FireworksContainer
