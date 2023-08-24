import { Alert, Button, Modal, Space, Tabs } from "antd";
import React, { useEffect } from "react";

export default function TileWindow(props: { x: number, y: number, map: {colour: string, user: string}[][], visible: boolean, close: () => void, updateTiles: () => void }) {
  const [editor, setEditor] = React.useState(false)
  const [newColour, setNewColour] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [tab, setTab] = React.useState('1')

  useEffect(() => {
    if (!loggedIn && localStorage.getItem('token'))
      setLoggedIn(true)
    if (loggedIn && !localStorage.getItem('token'))
      setLoggedIn(false)
  })

  let colourCode = ''
  let user = ''
  if (props.map.length > 0) {
    colourCode = props.map[props.y][props.x].colour
    user = props.map[props.y][props.x].user
  }
  let colour = ''
  if (colourCode == 'b') colour = 'Blue'
  if (colourCode == 'r') colour = 'Red'
  if (colourCode == 'g') colour = 'Green'
  if (colourCode == 'y') colour = 'Yellow'
  if (colourCode == 'p') colour = 'Femboy Pink'
  if (colourCode == 'o') colour = 'Orange'
  if (colourCode == 'c') colour = 'Cyan'
  if (colourCode == 'w') colour = 'White'
  if (colourCode == '0') colour = 'Black'

  if (!props.visible && tab !== '1') {
    setTab('1')
    setError('')
    setNewColour('')
    setEditor(false)
  }

  const applyColour = () => {
    if (!editor) {
      props.close()
      return
    }

    const token = localStorage.getItem('token')
    setLoading(true)
    fetch('/api/canplace', {
      headers: {
        'Authorization': token ?? '',
      }
    }).then(x => x.json()).then(x => {
      if (x.canPlace){
        fetch('/api/setGrid', {
          method: 'POST',
          headers: {
            'Authorization': token ?? '',
          },
          body: JSON.stringify({
            x: props.x,
            y: props.y,
            colour: newColour
          })
        }).then(x => x.json()).then(x => {
          console.log(x)
          setLoading(false)
          if (x.message === "Placed pixel successfully") {
            props.updateTiles()
            props.close()
            setLoading(false)
            setEditor(false)
          }
          if (x.error) {
            setError(x.error)
          }
        })
      }
      else {
        setError(`Please try again in ${x.seconds} second`)
        setLoading(false)
      }
    })
  }

  return (
    <Modal title={`Selected tile on X: ${props.x} Y: ${props.y}`} open={props.visible} onOk={applyColour} onCancel={props.close} cancelText='Close' 
          okButtonProps={{disabled: (editor && newColour === '')}} confirmLoading={loading}>
      <Tabs
        activeKey={tab}
        items={[
          {
            label: 'Properties', 
            key: '1', 
            children: <>
              <p>X: {props.x}</p>
              <p>Y: {props.y}</p>
              <p>Colour: {colour}</p>
              <p>Placed by: {user}</p>
            </>
          },
          {
            label: 'Change',
            key: '2',
            children: <>
              {loggedIn && <>
                <p>Select new colour: </p>
                <Space wrap>
                  <Button style={{backgroundColor: 'red'}} onClick={() => setNewColour('r')} />
                  <Button style={{backgroundColor: 'green'}} onClick={() => setNewColour('g')} />
                  <Button style={{backgroundColor: 'blue'}} onClick={() => setNewColour('b')} />
                  <Button style={{backgroundColor: 'yellow'}} onClick={() => setNewColour('y')} />
                  <Button style={{backgroundColor: '#ffa9ff'}} onClick={() => setNewColour('p')} />
                  <Button style={{backgroundColor: 'cyan'}} onClick={() => setNewColour('c')} />
                  <Button style={{backgroundColor: 'orange'}} onClick={() => setNewColour('o')} />
                  <Button style={{backgroundColor: 'white'}} onClick={() => setNewColour('w')} />
                  <Button style={{backgroundColor: 'black'}} onClick={() => setNewColour('0')} />
                </Space>
                <p>Hit OK to apply</p>
                {error === '' || <Alert message={error} type="error" />}
              </>}
              {loggedIn || <>
                <p>You need to be logged in to put tiles down</p>
              </>}
            </>
          }
        ]}
        onChange={x => {
          setTab(x)
          setError('')
          setNewColour('')
          setEditor(x === '2')
        }}
        />
    </Modal>
  )
}