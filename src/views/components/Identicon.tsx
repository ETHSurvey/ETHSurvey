import React from 'react';
import IdenticonJS from 'identicon.js';

interface IdenticonProps {
  address: string;
  size: number;
}

const Identicon: React.SFC<IdenticonProps> = ({ address, size }) => {
  const data = new IdenticonJS(address, size).toString();
  return (
    <img
      width={size}
      height={size}
      className="identicon"
      style={{ borderRadius: size / 2 }}
      alt="Wallet icon"
      src={`data:image/png;base64, ${data}`}
    />
  );
};

export default Identicon;
