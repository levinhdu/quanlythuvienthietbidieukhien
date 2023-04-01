import React from 'react'

function ChildModalScroll({ children }) {
  return (
    <div className="gx-main-content gx-pb-sm-4" id="scrollableDiv"
      style={{
        height: 'calc(100vh - 300px)',
        overflow: 'auto',
        padding: '0 16px',
        marginTop: 10
      }}>
      {children}
    </div>
  )
}

export default ChildModalScroll
