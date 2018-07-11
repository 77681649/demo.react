import React from 'react'
import './LinkButton.css'

export default function LinkButton({onClick,text}){
  return (
    <a className="lbtn" href="javascript:void" onClick={onClick} >{text}</a>
  )
}