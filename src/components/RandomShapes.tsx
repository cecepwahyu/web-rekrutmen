"use client";

import React, { useState, useEffect } from "react";

const randomPositionAndSize = () => ({
  top: `${Math.random() * 80}vh`,
  left: `${Math.random() * 80}vw`,
  size: `${Math.random() * 100 + 50}px`, // Size between 50px and 150px
});

const shapes = [
  {
    id: "triangle",
    svg: (size: string) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <polygon points="100,0 0,200 200,200" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "triangle2",
    svg: (size: string) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <polygon points="100,0 0,200 200,200" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "rectangle",
    svg: (size: string) => (
      <svg
        width={size}
        height={`${parseInt(size) / 2}`} // Height is half of the width
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <rect width="200" height="100" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "circle",
    svg: (size: string) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <circle cx="75" cy="75" r="75" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "circle2",
    svg: (size: string) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <circle cx="75" cy="75" r="75" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "oval",
    svg: (size: string) => (
      <svg
        width={size}
        height={`${parseInt(size) / 2}`}
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <ellipse cx="100" cy="50" rx="100" ry="50" fill="#FFFFFF" />
      </svg>
    ),
  },
];

const RandomShapes = () => {
  const [positions, setPositions] = useState<{ top: string; left: string; size: string }[]>([]);

  useEffect(() => {
    const newPositions = Array.from({ length: shapes.length }, () => randomPositionAndSize());
    setPositions(newPositions);
  }, []);

  return (
    <>
      {shapes.map((shape, index) => (
        <div
          key={shape.id}
          style={{
            position: "absolute",
            top: positions[index]?.top || "0",
            left: positions[index]?.left || "0",
            transform: "translate(-50%, -50%)",
          }}
        >
          {shape.svg(positions[index]?.size || "100px")}
        </div>
      ))}
    </>
  );
};

export default RandomShapes;
