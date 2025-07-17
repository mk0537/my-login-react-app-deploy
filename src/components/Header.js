import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const _HandleHeader = () => {
    navigate("/")
  }
  
  return (
    <div>
      <div className="board-header">
        <h2 
          className="board-title" 
          onClick={_HandleHeader}>주인장 맴대로 홈페이지</h2>
      </div>
    </div>
  );
};

export default Header;
