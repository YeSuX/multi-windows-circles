import { useState } from "react";
import './main.css'

function App() {

  // hooks
  const [position, setPosition] = useState({
    screenX: 0,
    screenY: 0,
    outerWidth: 0,
    outerHeight: 0,
    ballCenter: [0, 0],
    browserEdgeWidth: 0,
    browserEdgeHeight: 0
  })

  const [windowMap, setWindowMap] = useState<any>({})

  // functions
  const run = () => {

    const browserEdgeWidth = window.outerWidth - window.innerWidth
    const browserEdgeHeight = window.outerHeight - window.innerHeight
    const ballCenterX = (window.innerWidth / 2 - 100) + position.screenX + position.browserEdgeWidth
    const ballCenterY = (window.innerHeight / 2 - 100) + position.screenY + position.browserEdgeHeight

    setPosition({
      ...position,
      screenX: window.screenX,
      screenY: window.screenY,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      browserEdgeWidth: browserEdgeWidth,
      browserEdgeHeight: browserEdgeHeight,
      ballCenter: [ballCenterX, ballCenterY]
    })

    localStorage.setItem(`window_${windowId}`, JSON.stringify({
      ...position,
      updateTime: Date.now()
    }))

    const localKeys = Object.keys(localStorage)

    localKeys.forEach((key) => {
      if (!key.startsWith('window_')) {
        return false
      }

      if (key === `window_${windowId}`) {
        return false
      }

      const windowObject = JSON.parse(localStorage.getItem(key)!)

      setWindowMap({
        ...windowMap,
        [key]: windowObject
      })

      // remove window if not updated for 200ms
      if (Date.now() - windowObject.updateTime > 200) {
        try {
          // remove things sometimes not working
          // so we go brutal here

          localStorage.clear()
          window.location.reload()
        } catch (_) {
          // do nothing
        }
        return false
      }
    })
  }

  const newWindow = () => {
    console.log(location);
    window.open(`${location.origin}/?id=${parseInt(windowId) + 1}`, '_blank', 'width=600,height=600')
  }

  // constants
  let windowId = location.search.replace('?id=', '')

  if (!windowId) {
    windowId = '1'
  }

  window.addEventListener('beforeunload', function () {
    localStorage.removeItem('window_' + windowId)
  })

  window.requestAnimationFrame(run)

  return (
    <>
      <div className="header">
        <ul>
          <li>
            screenX: {position.screenX}
          </li>
          <li>
            screenY: {position.screenY}
          </li>
          <li>
            outerWidth: {position.outerWidth}
          </li>
          <li>
            outerHeight: {position.outerHeight}
          </li>
          <li>
            browserEdgeWidth: {position.browserEdgeWidth}
          </li>
          <li>
            browserEdgeHeight: {position.browserEdgeHeight}
          </li>
        </ul>
        <button onClick={newWindow}>new window</button>
      </div>
      <div className="container">
        <div className="circle" style={{ transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }}></div>
        {
          Object.keys(windowMap).map((window) => {
            console.log(window, windowMap);
            return (
              <div className="circle" style={{
                transition: 'all 0.1s ease-in-out',
                left: `${windowMap[window].ballCenter[0] - position.screenX - position.browserEdgeWidth}px`,
                top: `${windowMap[window].ballCenter[1] - position.screenY - position.browserEdgeHeight}px`
              }} />
            )
          })
        }
      </div>
    </>
  )
}

export default App
