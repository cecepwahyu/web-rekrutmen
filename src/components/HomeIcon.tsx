// components/HomeIcon.tsx

import React from "react";

const HomeIcon = ({ fill = "white" }: { fill?: string }) => (
    <svg
        version="1.1"
        id="Uploaded_to_svgrepo.com"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
        xmlSpace="preserve"
        className="h-6 w-6"
    >
        <path
            fill={fill}
            d="M29.832,12.222c-0.192,0.289-0.51,0.445-0.833,0.445c-0.19,0-0.383-0.055-0.554-0.168L16,4.202
      L3.555,12.499c-0.462,0.305-1.081,0.182-1.387-0.277c-0.307-0.46-0.183-1.08,0.277-1.387l13-8.667c0.336-0.225,0.773-0.225,1.109,0
      l13,8.667C30.015,11.142,30.139,11.762,29.832,12.222z M4,13v6v5v4c0,1.1,0.9,2,2,2h7v-9c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v9h7
      c1.1,0,2-0.9,2-2v-4v-5v-6L16,5L4,13z"
        />
    </svg>
);

export default HomeIcon;
