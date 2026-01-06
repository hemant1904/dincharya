import React, { useEffect } from 'react';

const Navbar: React.FC = () => {
    useEffect(() => {
        console.log('print statement');
    }, []);

    return (
        <nav>
            <span>Navbar</span>
            <button onClick={() => window.print()}>Print</button>
        </nav>
    );
};

export default Navbar;