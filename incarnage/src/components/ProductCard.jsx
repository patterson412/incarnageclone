import React, { useState } from "react";
import '../index.css';
import classNames from 'classnames';
import { useNavigate } from "react-router-dom";


function ProductCard(props) {

    const [hovered, setHovered] = useState(false);

    const navigate = useNavigate();


    function handleHover() {
        setHovered(true);
    }

    function handleMouseLeave() {
        setHovered(false);
    }

    const transitionClasses = classNames(
        'transition-transform', // Tailwind CSS transition class
        {
            'transform hover:scale-105': hovered // Apply scale transformation on hover
        }
    );



    function handleClick() {
        // Navigate to the other component and pass the product data as state
        navigate(`/productDetails/${props.id}`);

    }


    return (
        <div className="flex flex-col hover:cursor-pointer" onClick={handleClick}>
            <div className={`rounded-3xl overflow-hidden ${props.productLayout ? 'h-80' : 'h-96'}`} style={{ width: props.productLayout ? 230 : 300 }}>
                <img
                    src={hovered ? props.pathHover : props.path}
                    onMouseOver={handleHover}
                    onMouseLeave={handleMouseLeave}
                    alt="Product"
                    className={`${transitionClasses} rounded-3xl`}
                    style={{ transition: 'transform 0.5s ease-in-out' }}
                />

            </div>

            <div className="flex flex-col">
                <span>{props.title}</span>
                <span>{props.price}</span>
            </div>

        </div>
    );
}

export default ProductCard;