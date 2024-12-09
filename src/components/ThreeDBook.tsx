import React from 'react';
import { Canvas } from '@react-three/fiber';

const ThreeDBook = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Canvas>
        {/* Add 3D elements here, e.g., a book model */}
        <mesh>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ThreeDBook;
