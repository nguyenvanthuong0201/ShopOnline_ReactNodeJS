import { ADD_TO_CART, SAVE_SHIPPING_INFO, REMOVE_CART_ITEM } from '../constants/cartConstant'
import axios from 'axios'

/// add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios(`/api/v1/product/${id}`)
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
        }
    })
    /// lấy card trong store đẩy lên localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
}

export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
}
