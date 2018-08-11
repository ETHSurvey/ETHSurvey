import React from 'react'
import IdenticonJS from 'identicon.js'

const Identicon = ({ address, size }) => {
  const data = new IdenticonJS(address, size).toString()
  return (
    <img
      width={size}
      height={size}
      className="identicon"
      style={{ borderRadius: size/2 }}
      alt="Wallet icon"
      src={`data:image/png;base64, ${data}`}
    />
  )
}

export default Identicon