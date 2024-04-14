import React, { useState, useRef, useEffect, useReducer } from "react";
import '../index.css';
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

function reducerFilters(state, action) {
    switch (action.type) {
        case 'inStock':
            return { ...state, inStock: !state.inStock }
        case 'outOfStock':
            return { ...state, outOfStock: !state.outOfStock }
        case 'XS':
            return { ...state, XS: !state.XS };
        case 'S':
            return { ...state, S: !state.S };
        case 'M':
            return { ...state, M: !state.M };
        case 'L':
            return { ...state, L: !state.L };
        case 'XL':
            return { ...state, XL: !state.XL };
        case 'XXL':
            return { ...state, XXL: !state.XXL };
        case 'T-shirts':
            return { ...state, Tshirt: !state.Tshirt };
        case 'bottom':
            return { ...state, bottom: !state.bottom };

        default:
            return state;

    }
}


function getSelectedSizes(checkedFiltersObject) {
    const selectedSizes = [];
    for (let size in checkedFiltersObject) {
        if (size === 'XS' || size === 'S' || size === 'M' || size === 'L' || size === 'XL' || size === 'XXL') {
            if (checkedFiltersObject[size]) {
                selectedSizes.push(size);
            }
        }
    }
    return selectedSizes;
}

function getSelectedCategories(checkedFiltersObject) {
    const selectedCategories = [];
    for (let category in checkedFiltersObject) {
        if (category === 'Tshirt' || category === 'bottom') {
            if (checkedFiltersObject[category]) {
                selectedCategories.push(category);
            }
        }
    }
    console.log(selectedCategories);
    return selectedCategories;
}

// Function to check if two arrays have any common elements
function intersects(array1, array2) {
    return array1.some(value => array2.includes(value));
}

function ProductsLayout(props) {

    const [products, setProducts] = useState([]); //Set products state based on whatever clicked filters (initially renders all products)

    //States to manage clicked on dropdown arrow
    const [Availability, setAvailability] = useState(false);
    const [Price, setPrice] = useState(false);
    const [Size, setSize] = useState(false);
    const [Sort, setSort] = useState(false);

    //States to manage hide or unhide the options based on if dropdown clicked or not
    const [AvailabilityOptions, setAvailabilityOptions] = useState('hidden');
    const [PriceOptions, setPriceOptions] = useState('hidden');
    const [SizeOptions, setSizeOptions] = useState('hidden');
    const [SortOptions, setSortOptions] = useState('hidden');


    //State to manage the filter options
    const [checkedFilters, dispatchCheckedFilters] = useReducer(reducerFilters, {
        inStock: false,
        outOfStock: false,

        XS: false,
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false,

        Tshirt: false,
        bottom: false,
    });



    async function fetchProducts() {
        const response = await axios.get('/products');
        if (response.data.length > 0) {
            /*const filteredProducts = response.data.filter((item, index) => (
                item.gender === props.gender
            ));*/

            let filteredProducts = [...response.data];



            // Filter based on selected categories
            if (checkedFilters.Tshirt || checkedFilters.bottom) {
                const selectedCategories = getSelectedCategories(checkedFilters);
                filteredProducts = filteredProducts.filter(item =>
                    selectedCategories.includes(item.category)
                );
            }

            // Apply other filters if necessary
            if (checkedFilters.XS || checkedFilters.S || checkedFilters.M || checkedFilters.L || checkedFilters.XL || checkedFilters.XXL) {
                const selectedSizes = getSelectedSizes(checkedFilters);
                filteredProducts = filteredProducts.filter(item =>
                    intersects(selectedSizes, item.size.map(obj => Object.keys(obj)[0]))
                );
            }

            if (checkedFilters.inStock) {
                filteredProducts = filteredProducts.filter(item =>
                    item.stock > 0
                );
            }
            if (checkedFilters.outOfStock) {
                filteredProducts = filteredProducts.filter(item =>
                    item.stock === 0
                );
            }

            if (props.gender !== "all") {
                filteredProducts = filteredProducts.filter(item =>
                    item.gender === props.gender
                );
            }

            // Finally, set the products
            setProducts(filteredProducts);

        }
    }




    useEffect(() => {
        fetchProducts();
        console.log("once");
    }, [checkedFilters, props.gender]);

    useEffect(() => {

        if (Availability) {
            setAvailabilityOptions('');
        }
        if (!Availability) {
            setAvailabilityOptions('hidden');
        }
        if (Price) {
            setPriceOptions('');
        }
        if (!Price) {
            setPriceOptions('hidden');
        }
        if (Size) {
            setSizeOptions('');
        }
        if (!Size) {
            setSizeOptions('hidden');
        }
        if (Sort) {
            setSortOptions('');
        }
        if (!Sort) {
            setSortOptions('hidden');
        }


    }, [Availability, Price, Size, Sort]);


    function handleClick(criteria) {
        switch (criteria) {
            case 'availability':
                setAvailability(!Availability);
                break;
            case 'price':
                setPrice(!Price);
                break;
            case 'size':
                setSize(!Size);
                break;
            case 'sort':
                setSort(!Sort);
                break;
            default:
                break;
        }
    }




    return (
        <div>
            <div className="pb-4 pl-4 pt-2"><span className="font-bold text-3xl">{props.title}</span></div>

            <div className="flex flex-col lg:flex-row">

                <div className="flex flex-row lg:flex-col w-1/3 px-4">

                    <div>
                        <div className="flex justify-between hover:cursor-pointer hover:bg-zinc-200 transition ease-out duration-200" onClick={() => handleClick('availability')}>
                            <span>Availability</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className={`${AvailabilityOptions}`}>
                            <fieldset>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="inStock" name="inStock" type="checkbox" checked={checkedFilters.inStock} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'inStock' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="inStock" class="font-medium text-gray-900">In Stock</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="outStock" name="outStock" type="checkbox" checked={checkedFilters.outOfStock} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'outOfStock' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="outStock" class="font-medium text-gray-900">Out of Stock</label>

                                    </div>
                                </div>
                            </fieldset>
                        </div>


                    </div>

                    <hr class="my-2 w-11/12 border-gray-900/10" />


                    <span>Price</span>

                    <hr class="my-2 w-11/12 border-gray-900/10" />

                    <div>
                        <div className="flex justify-between hover:cursor-pointer hover:bg-zinc-200 transition ease-out duration-200" onClick={() => handleClick('size')}>
                            <span>Size</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className={`${SizeOptions}`}>
                            <fieldset>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="XS" name="XS" type="checkbox" checked={checkedFilters.XS} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'XS' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="XS" class="font-medium text-gray-900">XS</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="S" name="S" type="checkbox" checked={checkedFilters.S} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'S' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="S" class="font-medium text-gray-900">S</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="M" name="M" type="checkbox" checked={checkedFilters.M} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'M' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="M" class="font-medium text-gray-900">M</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="L" name="L" type="checkbox" checked={checkedFilters.L} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'L' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="L" class="font-medium text-gray-900">L</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="XL" name="XL" type="checkbox" checked={checkedFilters.XL} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'XL' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="XL" class="font-medium text-gray-900">XL</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="XXL" name="XXL" type="checkbox" checked={checkedFilters.XXL} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" onChange={() => dispatchCheckedFilters({ type: 'XXL' })} />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="XXL" class="font-medium text-gray-900">XXL</label>

                                    </div>
                                </div>
                            </fieldset>
                        </div>


                    </div>

                    <hr class="my-2 w-11/12 border-gray-900/10" />


                    <div>
                        <div className="flex justify-between hover:cursor-pointer hover:bg-zinc-200 transition ease-out duration-200" onClick={() => handleClick('sort')}>
                            <span>Sort</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className={`${SortOptions}`}>
                            <fieldset>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="T-shirts" name="category" type="checkbox" checked={checkedFilters.Tshirt} onChange={() => dispatchCheckedFilters({ type: 'T-shirts' })} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="T-shirts" class="font-medium text-gray-900">T-shirts</label>

                                    </div>
                                </div>
                                <div class="relative flex gap-x-3">
                                    <div class="flex h-6 items-center">
                                        <input id="bottom" name="category" type="checkbox" checked={checkedFilters.bottom} onChange={() => dispatchCheckedFilters({ type: 'bottom' })} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                    </div>
                                    <div class="text-sm leading-6">
                                        <label for="bottom" class="font-medium text-gray-900">bottom</label>

                                    </div>
                                </div>
                            </fieldset>
                        </div>


                    </div>




                </div>

                <div className="w-screen flex justify-center">
                    <div className="grid grid-cols-2 grid-flow-row md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((item, index) => (
                            <ProductCard key={index} path={item.path} title={item.title} price={item.price} pathHover={item.pathHover} id={item.id} productLayout={true} />
                        ))}
                    </div>
                </div>


            </div>
        </div>

    );
}

export default ProductsLayout;