import {motion} from "framer-motion";

export default function MapLoading() {
  return <>
    <motion.img
      animate={{
        transform: [
          'translate(-50%, -50%) rotate(0deg)',
          'translate(-50%, -50%) rotate(360deg)'
        ]
      }}
      transition={{repeat: Infinity, duration: 1, ease: 'easeInOut'}}
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      src='/astolfo loading.jpg'
      height={128}>
    </motion.img>
  </>
}