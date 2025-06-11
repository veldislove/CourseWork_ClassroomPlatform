import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import axios from 'axios';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import RoomDetails from './RoomDetails';

const ClassroomCube = ({ position, size, name, status, id, onClick, isSelected }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Blinking animation when selected
  useEffect(() => {
    if (isSelected && meshRef.current) {
      gsap.to(meshRef.current.material, {
        opacity: 0.5,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    } else if (meshRef.current) {
      gsap.to(meshRef.current.material, {
        opacity: 1,
        duration: 0.3,
      });
    }
    return () => {
      if (meshRef.current) gsap.killTweensOf(meshRef.current.material);
    };
  }, [isSelected]);

  // Hover animation
  useEffect(() => {
    if (hovered && meshRef.current && !isSelected) {
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.3,
      });
    } else if (meshRef.current && !isSelected) {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
      });
    }
  }, [hovered, isSelected]);

  return (
    <group position={position} onClick={() => onClick({ id, name, status, position, size })}>
      <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshStandardMaterial
          color={status === 'free' ? '#22c55e' : '#ef4444'}
          opacity={1}
          transparent={true}
          metalness={0}
          roughness={0.5}
          wireframe={false}
        />
      </mesh>
      <Text
        position={[0, size.height / 2 + 0.01, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {name}
      </Text>
      <mesh position={[0, size.height / 2 + 0.3, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color={status === 'free' ? '#22c55e' : '#ef4444'}
          emissive={status === 'free' ? '#22c55e' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

const ClassroomMap = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  // Generate random sizes
  const generateSizes = (count) => {
    return Array.from({ length: count }, () => ({
      width: 2 + Math.random() * 2, // 2 to 4
      height: 0.5,
      depth: 2 + Math.random() * 2, // 2 to 4
    }));
  };

  // Fetch classrooms
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8000/classrooms')
      .then((response) => {
        console.log('Classrooms data:', response.data);
        const sizes = generateSizes(response.data.length);
        const classroomsWithSizes = response.data.map((classroom, index) => ({
          ...classroom,
          size: sizes[index],
        }));
        setClassrooms(classroomsWithSizes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching classrooms:', error);
        setError('Не вдалося завантажити аудиторії');
        setLoading(false);
      });
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseDetails();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCubeClick = (classroom) => {
    setSelectedRoom(classroom);
    // Animate camera to center room, keeping top-down view
    if (cameraRef.current && canvasRef.current && controlsRef.current) {
      const { x, z } = classroom.position;
      const canvasWidth = canvasRef.current.getBoundingClientRect().width;
      const offsetX = canvasWidth / 4; // Offset for left half
      gsap.to(cameraRef.current.position, {
        x: x + offsetX / 10,
        y: 20, // Lower for zoom
        z: z,
        duration: 1,
        ease: 'power2.out',
        onUpdate: () => {
          controlsRef.current.update(); // Update controls during animation
        },
      });
    }
  };

  const handleCloseDetails = () => {
    setSelectedRoom(null);
    // Reset camera to initial top-down position
    if (cameraRef.current && controlsRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 50, // High for overview
        z: classrooms.length > 0 ? (Math.ceil(classrooms.length / 2) * 8) / 2 : 0, // Center along z
        duration: 1,
        ease: 'power2.out',
        onUpdate: () => {
          controlsRef.current.update(); // Update controls during animation
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Завантаження...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Arrange classrooms in two rows with corridor
  const corridorWidth = 2;
  const classroomsPerRow = Math.ceil(classrooms.length / 2);
  const getPosition = (index) => {
    const row = Math.floor(index / classroomsPerRow);
    const col = index % classroomsPerRow;
    let x = 0;
    let z = col * 3.8; // Increased spacing for better visibility
    if (row === 0) {
      x = -classrooms[index].size.width / 2 - corridorWidth / 2; // Left side
    } else {
      x = classrooms[index].size.width / 2 + corridorWidth / 2; // Right side
    }
    return [x, 0, z];
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Left: Sidebar */}
      <div className="w-48 bg-gray-800 text-white p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Аудиторії</h3>
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700 ${selectedRoom?.id === classroom.id ? 'bg-gray-600' : ''}`}
            onClick={() => handleCubeClick(classroom)}
          >
            <span className={`w-3 h-3 rounded-full ${classroom.status === 'free' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{classroom.name}: {classroom.status === 'free' ? 'Вільно' : 'Зайнято'}</span>
          </div>
        ))}
      </div>

      {/* Center: 3D Map */}
      <motion.div
        className={`h-full bg-gray-900 ${selectedRoom ? 'w-[calc(100%-12rem-50%)]' : 'w-[calc(100%-12rem)]'}`}
        animate={{ width: selectedRoom ? 'calc(100% - 12rem - 50%)' : 'calc(100% - 12rem)' }}
        transition={{ duration: 0.3 }}
      >
        <Canvas
          ref={canvasRef}
          camera={{
            ref: cameraRef,
            position: [0, 50, classrooms.length > 0 ? (Math.ceil(classrooms.length / 2) * 8) / 2 : 0], // Center along z
            fov: 60, // Moderate field of view
            rotation: [Math.PI / 2, 0, 0], // Top-down view
          }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#1a202c');
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 50, 0]} intensity={1} /> {/* Adjusted light for top-down */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
            maxPolarAngle={Math.PI} // Allow full rotation vertically
          />
          {classrooms.length > 0 ? (
            classrooms.map((classroom, index) => (
              <ClassroomCube
                key={classroom.id}
                position={getPosition(index)}
                size={classroom.size}
                name={classroom.name}
                status={classroom.status}
                id={classroom.id}
                onClick={handleCubeClick}
                isSelected={selectedRoom && selectedRoom.id === classroom.id}
              />
            ))
          ) : (
            <Text position={[0, 0, 0]} fontSize={0.5} color="white">
              Аудиторії відсутні
            </Text>
          )}
        </Canvas>
      </motion.div>

      {/* Right: Room Details */}
      {selectedRoom && (
        <motion.div
          className="w-1/2 h-full"
          initial={{ width: 0 }}
          animate={{ width: '50%' }}
          transition={{ duration: 0.3 }}
        >
          <RoomDetails classroomId={selectedRoom.id} onClose={handleCloseDetails} />
        </motion.div>
      )}
    </div>
  );
};

export default ClassroomMap;