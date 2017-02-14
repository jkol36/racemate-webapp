import React from 'react'
import Tappable from 'react-tappable'

export const TappableButton = ({ className, onClick, children }) => (
  <Tappable onTap={onClick}>
    <button className={className}>{ children }</button>
  </Tappable>
)
