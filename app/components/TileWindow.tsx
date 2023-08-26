import { Alert, Button, ColorPicker, Modal, Space, Tabs, Typography } from "antd";
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
  let colour = colourCode
  let red = 0
  let green = 0
  let blue = 0
  if (colour.length == 6) {
    colour = '#' + colour
    red = parseInt(colour.substring(1, 2), 16)
    green = parseInt(colour.substring(3, 5), 16)
    blue = parseInt(colour.substring(5, 7), 16)
    console.log('red: ' + red + ' green: ' + green + ' blue: ' + blue, 'total: ' + (red + green + blue))
  }
  else {
    red = 255
    green = 255
    blue = 255
    if (colour == 'b') colour = 'Blue'
    if (colour == 'r') colour = 'Red'
    if (colour == 'g') colour = 'Green'
    if (colour == 'y') colour = 'Yellow'
    if (colour == 'p') colour = 'Pink'
    if (colour == 'o') colour = 'Orange'
    if (colour == 'c') colour = 'Cyan'
    if (colour == 'w') colour = 'White'
    if (colour == '0') colour = 'Black'
  }

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
              <Typography>X: {props.x}</Typography>
              <Typography>Y: {props.y}</Typography>
              <Typography>
                Colour: <span style={{color: colour, backgroundColor: red + green + blue < 100 ? '#ffffff' : '#000000'}}>{colour}</span>
              </Typography>
              <Typography>Placed by: {user}</Typography>
            </>
          },
          {
            label: 'Change',
            key: '2',
            children: <>
              {loggedIn && <>
                <Typography>
                  <Typography.Paragraph style={{fontWeight: 'bold', fontSize: '32px'}}>Select new colour </Typography.Paragraph>
                  <Typography.Paragraph>
                    Clicking on the colour below will open a color selector.
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    You then select the new colour and apply it using OK.
                  </Typography.Paragraph>
                </Typography>
                <ColorPicker size="large" disabledAlpha value={newColour} onChange={x => setNewColour(x.toHex())} />
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