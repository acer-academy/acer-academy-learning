import React from 'react';
import logo from "../assets/acer-academy-logo.png"

interface AcerAcademyLogoProps {
  className?: string;
}

export const AcerAcademyLogo: React.FC<AcerAcademyLogoProps> = ({ className }) => {
  return (
    <div>
      <img className={className} src={logo} alt="Acer Academy Logo" />
    </div>
  );
};
