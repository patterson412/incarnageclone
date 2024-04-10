import React, { useEffect, useState, useContext } from "react";
import Nav from "./Nav.jsx";
import '../index.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Homegrid from "./Homegrid.jsx";
import ProductView from "./ProductView.jsx";
import ProductsLayout from "./ProductsLayout.jsx";
import Cart from "../context/Cart.jsx";
import User from "../context/User.jsx";
import ShopCart from "./ShopCart.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Page404 from "./Page404.jsx";
import axios from "axios";

function AuthCheck() {
    const navigate = useNavigate();
    const [userState, setUserState] = useContext(User);

    useEffect(() => {
        async function checkAuthenticated() {
            try {
                const response = await axios.get('/authenticated');
                if (response.data.message === "authenticated") {
                    console.log('user is authenticated in the front end');

                    //checking if userState is NULL because if user is set from /login we dont have to each time update user
                    if (userState === null) {
                        console.log(response.data.user);
                        setUserState(response.data.user);
                    }

                    navigate('/home');
                }
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    console.log('user is Unauthorized in the front end');
                    navigate('/login');
                } else {
                    console.log(`error in authentication in front end: ${error}`);
                }
            }
        }
        checkAuthenticated();
    }, []);

    return null; // or return a Loading component if needed
}

function App() {

    const [cartState, setCartState] = useState([]);
    const [userObj, setUser] = useState(null);

    return (
        <Router>
            <User.Provider value={[userObj, setUser]}>
                <Cart.Provider value={[cartState, setCartState]}>
                    <div className="h-screen">

                        <div id="content" className="h-full">
                            <Routes>
                                <Route exact path="/" element={<AuthCheck />} />

                                <Route exact path="/login" element={<Login />} />

                                <Route exact path="/register" element={<Register />} />

                                <Route exact path="/home" element={<div><AuthCheck /><Nav /><Homegrid /></div>} />

                                <Route
                                    exact
                                    path="/productDetails/:id"
                                    element={<div><AuthCheck /><Nav /><ProductView /></div>}
                                />

                                <Route
                                    exact
                                    path="/productsLayout/women"
                                    element={<div><AuthCheck /><Nav /><ProductsLayout title="WOMEN'S" gender="Female" /></div>}
                                />

                                <Route
                                    exact
                                    path="/productsLayout/men"
                                    element={<div><AuthCheck /><Nav /><ProductsLayout title="MEN'S" gender="Male" /></div>}
                                />

                                <Route
                                    exact
                                    path="/shoppingcart"
                                    element={<div><AuthCheck /><Nav /><ShopCart /></div>}
                                />

                                <Route
                                    path="*"
                                    element={<Page404 />}
                                />

                            </Routes>
                        </div>




                    </div>
                </Cart.Provider>
            </User.Provider>

        </Router>

    );
}

export default App;