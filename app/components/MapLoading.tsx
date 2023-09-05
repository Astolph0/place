import {Spin} from "antd";

export default function MapLoading() {
  return <div style={{
    position: 'fixed', left: '0', top: '0', width: '100vw', height: '100vh', backgroundColor: '#000000'
  }}>
    <div style={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
    }}>
      <Spin size="large"/>
    </div>
  </div>
}