import React from 'react'
import './Loader.css'

const Loader = ({type = 1}) => {
  return type === 1 ? (
    <div className="page">
      <div className="center-body">
        <div className="loader-circle-9">
          Loading
          <span></span>
        </div>
      </div>
    </div>
  ) : (
    <div class="loader">
      <div class="wrapper">
        <div class="circle"></div>
        <div class="line-1"></div>
        <div class="line-2"></div>
        <div class="line-3"></div>
        <div class="line-4"></div>
      </div>
    </div>
  );
}

export default Loader