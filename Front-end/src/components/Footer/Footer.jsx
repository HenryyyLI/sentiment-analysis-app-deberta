import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <div className="footer">
            <div className="top">
                <div className="item">
                    <h1>Links</h1>
                    <span>FAQ</span>
                    <span>Pages</span>
                    <span>Stores</span>
                    <span>Compare</span>
                    <span>Cookies</span>
                </div>
                <div className="item">
                    <h1>About</h1>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto a vitae nemo corporis libero totam, recusandae sed non excepturi tempora vel voluptatem quam debitis, dolores accusamus! Quasi a dolor voluptatem?</span>
                </div>
                <div className="item">
                    <h1>Contact</h1>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit delectus, repellat in laboriosam sunt est impedit reiciendis quae eius magnam temporibus quibusdam magni maxime. Ut quos voluptate nihil iure amet!</span>
                </div>
            </div>
            <div className="bottom">
                <div className="left">
                    <span className="logo">Sentimatic</span>
                    <span className="copyright">© Al-A-H Data Prophets 2025. All Rights Reserved.</span>
                </div>
                <div className="right">
                    <img src="/img/payment.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Footer
