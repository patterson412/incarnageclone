import React, { useEffect, useState, useContext } from "react";
import '../index.css';
import { useParams } from "react-router-dom";
import axios from "axios";
import Cart from "../context/Cart";


function ProductView() {

    const { id } = useParams();


    const [cartState, setCartState] = useContext(Cart);

    const [quantityState, setQuantity] = useState(0);

    const [sizeState, setSize] = useState('');


    const [product, setProduct] = useState({});

    const [sizeArray, setSizeArray] = useState([]);

    useEffect(() => {
        fetchProduct();
    }, []);

    async function fetchProduct() {
        try {
            const response = await axios.get(`/products/${id}`);
            if (response.data) {
                console.log(response.data);
                setProduct(response.data[0]);

            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }


    }

    console.log("Product state:", product); // Log the product state



    function updateCart() {
        if (sizeState !== '' && quantityState !== 0) {

            const cartArray = [...cartState];
            const existingItemIndex = cartArray.findIndex(item => (
                item.product.id === product.id && item.size === sizeState
            ));

            if (existingItemIndex !== -1) {
                cartArray[existingItemIndex].quantity += quantityState
                setCartState(cartArray);
                window.alert("Product already in cart, cart has been updated");
            } else {
                setCartState([...cartState, { product, size: sizeState, quantity: quantityState }]);
                window.alert("Product Successfully added to cart");
            }

        } else {
            window.alert('check quantity or Size');
        }

    }

    useEffect(() => {
        if (Array.isArray(cartState) && cartState.length > 0) {
            localStorage.setItem('shoppingcart', JSON.stringify(cartState));
        }
    }, [cartState]);


    return (
        <div className="h-screen">
            <div className="h-full flex flex-col md:flex-row md:justify-between">
                <div className="flex w-auto overflow-auto object-contain"> {/*images*/}

                    <img src={product.path} alt="product" className="w-full sm:w-auto"></img>



                    <img src={product.pathHover} alt="product" className="w-full sm:w-auto"></img>



                </div>

                <div className="flex flex-col gap-3 p-4"> {/*details*/}
                    <span className="font-bold text-3xl">{product.title}</span>
                    <span className="font-thin text-lg text-center">{product.price}</span>

                    <div className="flex gap-3 justify-center">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rounded-full hover:bg-slate-300 transition ease-out duration-300 cursor-pointer" onClick={() => { if (quantityState !== 0) setQuantity(quantityState - 1) }}>
                            <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>


                        <span>{quantityState}</span>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rounded-full hover:bg-slate-300 transition ease-out duration-300 cursor-pointer" onClick={() => { setQuantity(quantityState + 1) }}>
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>


                    </div>

                    <div className="flex gap-3 justify-center">
                        {product && product.size && product.size.map(obj => Object.keys(obj)[0]).map((size, index) => (
                            <div className="rounded-full bg-slate-100 px-3 py-2 hover:bg-slate-300 transition ease-out duration-200 cursor-pointer active:bg-slate-400 focus:bg-slate-300" key={index} onClick={() => { setSize(size); window.alert(`${size} selected`); }}>
                                <span>{size}</span>
                            </div>
                        ))}
                    </div>


                    <div className="flex justify-center">
                        <span className="cursor-pointer px-4 bg-black text-white" onClick={updateCart}>Add to cart</span>
                    </div>
                </div>
            </div>



            <div className="w-full">
                <div className="w-full pl-20 py-10">
                    <span className="font-bold text-2xl">YOU ALSO MIGHT LIKE...</span>
                </div>
            </div>






        </div>

    );

}

export default ProductView;