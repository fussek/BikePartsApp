import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    // The header element with the specified background color and a subtle shadow.
    <header style={{ backgroundColor: '#ffbf0e' }} className="shadow-md">
      <nav className="container mx-auto py-3 px-8">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/humanoo.png" alt="Humanoo Logo" style={{ height: '60px'}} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
