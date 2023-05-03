// src/redux/reducers/restaurantReducer.js

const initialState = {
    category: '',
    radiusSearch: '1',
    zipCode: ''
};

const restaurantReducer = (state = initialState, action) => {

    switch (action.type) {

        case 'SET_CATEGORY':
            console.log(action.payload)
            //WORKS
            return { ...state, category: action.payload };

        case 'SET_RADIUS':
            console.log(action.payload)
            return { ...state, radiusSearch: action.payload };

        case 'SET_ZIPCODE':
            console.log(action.payload)
            return { ...state, zipCode: action.payload };
            
        default:
            return state;
    }

};

export default restaurantReducer;
