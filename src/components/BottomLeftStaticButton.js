import React from 'react'
import classnames from 'classnames'

export const BottomLeftStaticButton = (props) => {
  return (
    <div className={classnames({
      'bottom-left-static-button': true,
      hidden: props.hidden
    })}
      onClick={props.onClick}
      data-tip={props.tooltipText}>
      { props.children}
    </div>
  )
}
