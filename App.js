import NavigationContainer from "./navigation/navigationContainer";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import orderReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import "react-native-gesture-handler";
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  order: orderReducer,
  auth: authReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
function App() {
  const [fontsLoaded] = useFonts({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
export default App;
