import React from 'react'
import ScrollBar from 'react-perfect-scrollbar'

interface Props {
  children: React.ReactNode
}

export default function ContainerLayout(props: Props) {
  return (
    <ScrollBar id='scrollbar' style={{ height: '100vh' }}>
      {props.children}
    </ScrollBar>
  )
}
