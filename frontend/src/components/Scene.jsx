import React, { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import axios from 'axios'
import Classroom from './Classroom.jsx'

const Scene = ({ onClick }) => {
  const groupRef = useRef()
  const [classrooms, setClassrooms] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8000/classrooms')
      .then(response => setClassrooms(response.data))
      .catch(error => console.error('Помилка отримання аудиторій:', error))
  }, [])
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event
      const x = (clientX / window.innerWidth - 0.5) * 0.2
      const y = (clientY / window.innerHeight - 0.5) * 0.2
      if (groupRef.current) {
        groupRef.current.rotation.x = -Math.PI / 4 + y
        groupRef.current.rotation.y = Math.PI / 4 + x
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <group ref={groupRef} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
      {classrooms.map((classroom, i) => (
        <Classroom
          key={classroom.id}
          id={classroom.name}
          position={[(i % 5) * 1.5, Math.floor(i / 5) * 1.5, 0]}
          status={classroom.status}
          onClick={() => onClick(classroom)}
        />
      ))}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}
export default Scene