import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Navbar.scss';
import Button from '@mui/material/Button';

const Navbar = () => {

    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="left">
                <Link className='link' to='/'>
                    <div className="logo">
                        <img src="/img/logo.svg" alt="" />
                    </div>
                </Link>
                <div className="tags">
                    <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="text" onClick={() => {
                        navigate(`/`);
                    }} className="link">Home</Button>
                    <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="text" onClick={() => {
                        navigate(`/history`);
                    }} className="link">History</Button>
                </div>
            </div>
            <div className="right">
                <Link className='link' to='/'>
                    <div className="title">
                        <h1>Sentimatic</h1>
                        <p>Unlock Insights in Every Word.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navbar
