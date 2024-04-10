import React, { useEffect, useState, useContext, useRef } from "react";
import '../index.css';
import { useNavigate } from "react-router-dom";
import Cart from "../context/Cart";


function ShopCart() {

    const [cartState, setCartState] = useContext(Cart);

    const [subTotal, setSubTotal] = useState(0);


    useEffect(() => {
        const shoppingCartData = localStorage.getItem('shoppingcart');
        if (shoppingCartData && shoppingCartData.length > 0) {
            setCartState(JSON.parse(shoppingCartData));
        }
    }, []);


    useEffect(() => {
        let total = 0;
        cartState.forEach(item => {
            total += (parseFloat(item.product.price.replace(/,/g, '')) * item.quantity);
        });
        setSubTotal(total.toFixed(2));
    }, [cartState]);


    function removeItem(item) {

        const cartArray = [...cartState];
        const index = cartArray.indexOf(item);

        if (index > -1) {
            cartArray.splice(index, 1);
        }

        setCartState(cartArray);

        localStorage.removeItem('shoppingcart');
        localStorage.setItem('shoppingcart', JSON.stringify(cartArray));
    }


    function updateQuantity(action, item) {
        const cartArray = [...cartState];
        const index = cartArray.findIndex(cartItem => cartItem === item);
        if (index !== -1) {
            const currentItem = { ...cartArray[index] };
            let newQuantity = currentItem.quantity;

            if (action === 'deduct') {
                newQuantity = Math.max(1, newQuantity - 1);
            } else if (action === 'add') {
                newQuantity += 1;
            }

            currentItem.quantity = newQuantity;
            cartArray[index] = currentItem;

            setCartState(cartArray);

            localStorage.removeItem('shoppingcart');
            localStorage.setItem('shoppingcart', JSON.stringify(cartArray));
        }
    }

    return (
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 pt-10">
            <div className="rounded-lg md:w-2/3">

                {cartState.length > 0 ? cartState.map(item => (
                    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                        <img src={item.product.path} alt="product-image" className="w-full rounded-lg sm:w-40" />
                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                            <div className="mt-5 sm:mt-0">
                                <h2 className="text-lg font-bold text-gray-900">{item.product.title}</h2>
                                <p className="mt-1 text-xs text-gray-700">{item.size}</p>
                            </div>
                            <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                <div className="flex items-center border-gray-100">
                                    <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={() => updateQuantity('deduct', item)}> - </span>
                                    <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={`${item.quantity}`} min="1" />
                                    <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={() => updateQuantity('add', item)}> + </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-sm">{(parseFloat(item.product.price.replace(/,/g, '')) * item.quantity).toFixed(2)} LKR</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500" onClick={() => removeItem(item)}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <span>There are no items in cart</span>}

            </div>

            {/*subtotal*/}

            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                <div className="mb-2 flex justify-between">
                    <p className="text-gray-700">Subtotal</p>
                    <p className="text-gray-700">{subTotal} LKR</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700">Shipping</p>
                    <p className="text-gray-700">00.00 LKR</p>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between">
                    <p className="text-lg font-bold">Total</p>
                    <div className="">
                        <p className="mb-1 text-lg font-bold">{subTotal} LKR</p>
                        <p className="text-sm text-gray-700">including VAT</p>
                    </div>
                </div>
                <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Check out</button>
            </div>
        </div>
    );
}

export default ShopCart;