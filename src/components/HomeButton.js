import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = ({ to, label, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  );
};

export default HomeButton;
