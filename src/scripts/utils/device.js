/**
 * Узнать какое устройство используется.
 *
 * @returns {"desktop" | "tablet" | "mobile"}
 */
export const getDevice = () => {
  const userAgent = navigator.userAgent

  if (/Android|iPhone/i.test(userAgent)) {
    return "mobile"
  }

  if (/iPad|iPod|BlackBerry/i.test(userAgent)) {
    return "tablet"
  }

  return "desktop"
}

export const getPointer = () => {
  const {maxTouchPoints} = navigator

  if (maxTouchPoints > 0) {
    return {type: "touch", count: maxTouchPoints}
  }

  return {type: "mouse"}
}

export const device = {
  type: getDevice(),
  pointer: getPointer()
}

