import React from "react";

interface BanIconProps {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
  [key: string]: any;
}

export const BanIcon: React.FC<BanIconProps> = ({
  fill = "#000",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={size || width || 30}
      height={size || height || 30}
      viewBox="-4 -4 40 40"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.776 2.24-6.912l16.704 16.704q-3.168 2.208-6.944 2.208-3.264 0-6.016-1.6t-4.384-4.352-1.6-6.048zM9.056 6.24q3.168-2.24 6.944-2.24 3.264 0 6.016 1.632t4.384 4.352 1.6 6.016q0 3.808-2.24 6.944z"
        fill={fill}
      />
    </svg>
  );
};

export default BanIcon;
