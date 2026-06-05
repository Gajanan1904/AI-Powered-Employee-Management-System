import React from 'react';
import './Loader.css';

const Loader = ({ fullPage = false, text = 'Loading...' }) => {
  const loaderContent = (
    <div className="loader-container">
      <div className="loader-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{loaderContent}</div>;
  }

  return loaderContent;
};

export default Loader;
