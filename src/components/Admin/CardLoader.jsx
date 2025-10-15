import React from 'react';
import styled from 'styled-components';

const CardLoading = () => {
  return (
    <StyledWrapper>
      <div aria-label="Loading..." role="status" className="loader">
        <svg className="icon" viewBox="0 0 256 256">
          <line x1={128} y1={32} x2={128} y2={64} strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1={224} y1={128} x2={192} y2={128} strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1={128} y1={224} x2={128} y2={192} strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1={32} y1={128} x2={64} y2={128} strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
          <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={24} />
        </svg>
        <span className="loading-text">Getting server response</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .icon {
    height: 1.5rem;
    width: 1.5rem;
    animation: spin 1s linear infinite;
    stroke: white;
    margin-right: 3px;
  }

  .loading-text {
    font-size: 10.3px;
    line-height: 1rem;
    font-weight: 400;
    color: white;
    display: block
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }`;

export default CardLoading;
