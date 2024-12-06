import React from 'react';
import { Canvas } from '@react-three/fiber';

const ThreeDBook = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Canvas>
        {/* Add 3D elements here, e.g., a book model */}
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ThreeDBook;
