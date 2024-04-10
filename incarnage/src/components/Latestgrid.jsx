import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";


function Latestgrid() {

    const [products, setProducts] = useState([]);

    async function fetchProducts() {
        try {
            const result = await axios.get('/products');

            console.log(result);
            console.log(result.data);

            setProducts(result.data);
        } catch (e) {
            console.log("error");
        }


    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1, // Number of slides to show at a time
        slidesToScroll: 1, // Number of slides to scroll at a time

        nextArrow: (
            <div>
                <div className="next-slick-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" /></svg>
                </div>
            </div>
        ),

        prevArrow: (
            <div>
                <div className="next-slick-arrow" style={{ transform: 'rotate(180deg)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" /></svg>
                </div>
            </div>
        ),

        autoplay: true,
        autoplaySpeed: 3000,
    };



    return (
        <div className="w-full">

            <div className="w-full pl-20 py-10">
                <span className="font-bold text-2xl">LATEST RELEASE</span>
            </div>

            <div id="productsAsUsual" className={`h-96 flex-col items-center hidden sm:flex`}>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-7">
                    {products.map((product, index) => (
                        <ProductCard key={index} path={product.path} title={product.title} price={product.price} pathHover={product.pathHover} id={product.id} />
                    ))}
                </div>
            </div>



            <div className={`max-w-full mx-auto px-24 sm:hidden`}> {/* Set max-width to prevent slider buttons from overflowing */}
                <div>
                    <Slider {...settings}>
                        {products.map((product, index) => (
                            <ProductCard key={index} path={product.path} title={product.title} price={product.price} pathHover={product.pathHover} id={product.id} />
                        ))}
                    </Slider>
                </div>

            </div>










        </div>
    );
}

export default Latestgrid;