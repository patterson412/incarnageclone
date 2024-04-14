import React, { useState, useRef, useEffect, useReducer, useContext } from "react";
import '../index.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import User from "../context/User";



function reducer(state, action) {
    switch (action.type) {
        case true:
            return { show: true, hidden: '' };
        case false:
            return { show: false, hidden: 'hidden' };
        default:
            return state;
    }
}

function hidePhoneMenuReducer(state, action) {
    switch (action.type) {
        case true:
            return { state: true, hidden: 'hidden' };
        case false:
            return { state: false, hidden: '' };
        default:
            return state;
    }
}

function profileReducer(state, action) {
    switch (action.type) {
        case true:
            return { show: true, hidden: '' };
        case false:
            return { show: false, hidden: 'hidden' };
        default:
            return state;
    }
}


function Nav() {

    const [user, setUser] = useContext(User);

    const [state, dispatch] = useReducer(reducer, {
        show: false,
        hidden: 'hidden',
    });

    const [profile, profileDispatch] = useReducer(profileReducer, {
        show: false,
        hidden: 'hidden',
    })

    const [position, setPosition] = useState('translate-x-[-100rem]');
    const [hidePhoneMenu, dispatchHidePhoneMenu] = useReducer(hidePhoneMenuReducer, {
        show: false,
        hidden: '',
    });

    const [filtered, setFiltered] = useState([]);

    const input = useRef(null);

    const [showCartBoolean, setShowCartBoolean] = useState(false);
    const [showCart, setShowCart] = useState('hidden');

    useEffect(() => {
        if (state.show) {
            setPosition('translate-x-0');
        } else {
            setPosition('translate-x-[-100rem]');
        }
    }, [state.show]);


    function handleMenu() {
        document.body.style.overflow = !state.show ? 'hidden' : 'unset'; // Lock or unlock scrolling
        dispatch({ type: !state.show });
        if (!state.show) {
            input.current.value = '';
            setFiltered([]);
            dispatchHidePhoneMenu({ type: false });
        }
    }

    async function handlePhoneMenu(event) {
        const { value } = event.target;
        if (value === '') {
            dispatchHidePhoneMenu({ type: false });
            setFiltered([]); // Clearing filtered products if search input is empty
        } else {
            dispatchHidePhoneMenu({ type: true });
            console.log(value);
            const filteredProducts = await productsToFilter(value);
            console.log(filteredProducts);
            if (filteredProducts.length === 0) {
                setFiltered([{ title: 'No results found' }]);
            } else {
                setFiltered(filteredProducts);
            }

        }
    }

    async function productsToFilter(typedChars) {
        try {
            const response = await axios.get('/products');
            const filteredProducts = response.data.filter((product, index) => (
                product.title.toLocaleLowerCase().includes(typedChars.toLocaleLowerCase())
            ));
            return filteredProducts;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [{ title: 'Oops..Something went wrong' }];
        }
    }


    const navigate = useNavigate();

    function gotocart() {
        navigate('/shoppingcart');
    }

    async function userSignOut() {
        try {
            const response = await axios.get('/logout');
            if (response && response.status === 200 && response.data.message === "Logged out successfully") {
                console.log(response.data.message);
                setUser(null);
                navigate('/login');
            }

        } catch (e) {
            console.log(`error cannot logout: ${e}`);
        }

    }



    return (
        <div className="relative">
            <div className="relative bg-black flex justify-center items-center gap-5">

                <div className="text-white hover:cursor-pointer lg:hidden" onClick={handleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                    </svg>

                </div>

                <img className="h-16" src="//incarnage.com/cdn/shop/files/carnage_logo_white.png?crop=center&amp;height=300&amp;v=1636647968&amp;width=300" data-widths="[180, 320, 360, 540, 640, 720, 900, 1080, 1296, 1512, 1728, 2048]" data-aspectratio="3.787878787878788" data-sizes="auto" alt="" data-srcset="//incarnage.com/cdn/shop/files/carnage_logo_white_180x.png?v=1636647968 180w, //incarnage.com/cdn/shop/files/carnage_logo_white_320x.png?v=1636647968 320w, //incarnage.com/cdn/shop/files/carnage_logo_white_360x.png?v=1636647968 360w, //incarnage.com/cdn/shop/files/carnage_logo_white_540x.png?v=1636647968 540w, //incarnage.com/cdn/shop/files/carnage_logo_white_640x.png?v=1636647968 640w, //incarnage.com/cdn/shop/files/carnage_logo_white_720x.png?v=1636647968 720w, //incarnage.com/cdn/shop/files/carnage_logo_white_900x.png?v=1636647968 900w, //incarnage.com/cdn/shop/files/carnage_logo_white_1080x.png?v=1636647968 1080w, //incarnage.com/cdn/shop/files/carnage_logo_white_1296x.png?v=1636647968 1296w, //incarnage.com/cdn/shop/files/carnage_logo_white_1512x.png?v=1636647968 1512w, //incarnage.com/cdn/shop/files/carnage_logo_white_1728x.png?v=1636647968 1728w, //incarnage.com/cdn/shop/files/carnage_logo_white_2048x.png?v=1636647968 2048w" sizes="200.75757575757578px" loading="lazy" srcset="//incarnage.com/cdn/shop/files/carnage_logo_white_180x.png?v=1636647968 180w, //incarnage.com/cdn/shop/files/carnage_logo_white_320x.png?v=1636647968 320w, //incarnage.com/cdn/shop/files/carnage_logo_white_360x.png?v=1636647968 360w, //incarnage.com/cdn/shop/files/carnage_logo_white_540x.png?v=1636647968 540w, //incarnage.com/cdn/shop/files/carnage_logo_white_640x.png?v=1636647968 640w, //incarnage.com/cdn/shop/files/carnage_logo_white_720x.png?v=1636647968 720w, //incarnage.com/cdn/shop/files/carnage_logo_white_900x.png?v=1636647968 900w, //incarnage.com/cdn/shop/files/carnage_logo_white_1080x.png?v=1636647968 1080w, //incarnage.com/cdn/shop/files/carnage_logo_white_1296x.png?v=1636647968 1296w, //incarnage.com/cdn/shop/files/carnage_logo_white_1512x.png?v=1636647968 1512w, //incarnage.com/cdn/shop/files/carnage_logo_white_1728x.png?v=1636647968 1728w, //incarnage.com/cdn/shop/files/carnage_logo_white_2048x.png?v=1636647968 2048w"></img>

                <div className="hidden lg:flex items-center gap-5">
                    <Link to="/"><span className="text-zinc-500 flex">HOME</span></Link>

                    <Link to="/productsLayout/women"><span className="text-white flex hover:text-zinc-500 transition ease-out duration-200">WOMEN'S <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                    </svg>
                    </span></Link>

                    <Link to="/productsLayout/men"><span className="text-white flex hover:text-zinc-500 transition ease-out duration-200">MEN'S <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                    </svg>
                    </span></Link>
                </div>

                <div className="pl-5">
                    <div className="hover:bg-slate-600 cursor-pointer rounded-full transition ease-out duration-200 p-2 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white" onClick={gotocart}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>

                </div>

                <div className="pl-5">
                    <div className="hover:bg-slate-600 cursor-pointer rounded-full transition ease-out duration-200 p-2 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white" onClick={() => profileDispatch({ type: !profile.show })}>
                            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                        </svg>
                    </div>

                </div>



                <div className={`absolute top-16 right-0 flex flex-col bg-black p-2 rounded ${profile.hidden}`}>
                    <span onClick={userSignOut} className="text-white cursor-pointer hover:text-zinc-500 transition ease-out duration-200">Sign out</span>
                </div>


            </div>


            <div className={`absolute top-0 left-0 h-screen w-4/5 flex flex-col bg-black gap-6 px-6 pt-6 ${position} lg:hidden duration-500 z-50`}>

                <label for="search">
                    <input ref={input} name="search" id="search" placeholder="Search" className="rounded-full bg-white w-full h-12 flex justify-start items-center placeholder-zinc-400 pl-5" onChange={handlePhoneMenu}></input>
                </label>


                <div className="flex flex-col gap-6">
                    <div className={`flex flex-col gap-6 ${hidePhoneMenu.hidden}`}>
                        <Link to="/" onClick={handleMenu}><span className="text-zinc-500 flex">HOME</span></Link>

                        <Link to="/productsLayout/women" onClick={handleMenu}><span className="text-white flex hover:text-zinc-500 transition ease-out duration-200">WOMEN'S <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                        </svg>
                        </span></Link>

                        <Link to="/productsLayout/men" onClick={handleMenu}><span className="text-white flex hover:text-zinc-500 transition ease-out duration-200">MEN'S <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                        </svg>
                        </span></Link>
                    </div>

                    <div className={`${hidePhoneMenu.hidden === 'hidden' ? '' : 'hidden'}`}>
                        {filtered.map((product, index) => (
                            <Link to={`/productDetails/${product.id}`} onClick={handleMenu} key={index}><h1 className="text-white">{product.title}</h1></Link>
                        ))}
                    </div>

                </div>




            </div>

            <div className={`absolute top-0 right-0 w-1/5 h-screen bg-black opacity-50 cursor-pointer ${position} lg:hidden duration-500 z-50`} onClick={handleMenu}></div>












        </div>
    );
}

export default Nav;