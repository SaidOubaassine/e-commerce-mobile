import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigationContainerRef } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Home from "../screens/shop/Home";
import Cart from "../screens/shop/Cart";
import Detail from "../screens/shop/ProductDetail";
import OrdersScreen from "../screens/shop/OrdersScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform } from "react-native";
import Colours from "../constants/Colours";
import AuthScreen from "../screens/user/AuthScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import { Text } from "react-native";
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const AdminNavigator = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function AuthStackFunction() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Auth" component={AuthScreen} />
    </AuthStack.Navigator>
  );
}
function HomeStackFunction() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="Detail" component={Detail} />
    </HomeStack.Navigator>
  );
}
function AdminNavigatorFunction() {
  return (
    <AdminNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? Colours.darkblue : "",
        },
        headerTitleStyle: {
          fontFamily: "open-sans-bold",
        },
        headerBackTitleStyle: {
          fontFamily: "open-sans",
        },
      }}
    >
      <AdminNavigator.Screen
        name="User Products"
        component={UserProductsScreen}
      />
      <AdminNavigator.Screen name="EditProduct" component={EditProductScreen} />
    </AdminNavigator.Navigator>
  );
}
function MyTap() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colours.darkblue,
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconColor = focused ? Colours.darkblue : "#000000";
          let iconHome = focused ? "home-outline" : "home";
          let iconCart = focused ? "cart-outline" : "cart";
          let iconAccount = focused ? "account-outline" : "account";
          if (route.name === "Home")
            return (
              <MaterialCommunityIcons
                name={iconHome}
                color={iconColor}
                size={size}
              />
            );
          else if (route.name === "Cart") {
            return (
              <MaterialCommunityIcons
                name={iconCart}
                color={iconColor}
                size={size}
              />
            );
          } else {
            return (
              <MaterialCommunityIcons
                name={iconAccount}
                color={iconColor}
                size={size}
              />
            );
          }
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeStackFunction} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Order" component={OrdersScreen} />
    </Tab.Navigator>
  );
}

const NavigationContainerFunction = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    if (!isAuth) {
      navigationRef.navigate("Auth");
    }
  }, [isAuth]);
  return (
    <NavigationContainer ref={navigationRef}>
      {isAuth ? (
        <Drawer.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Platform.OS === "android" ? Colours.darkblue : "",
            },
            headerTitleStyle: {
              fontFamily: "open-sans-bold",
            },
            headerBackTitleStyle: {
              fontFamily: "open-sans",
            },
            contentOptions: {
              activeTintColor: Colours.chocolate,
            },
          }}
        >
          <Drawer.Screen
            name="Products"
            component={MyTap}
            options={{
              drawerIcon: () => <Ionicons name="home" size={24} />,
            }}
          />
          <Drawer.Screen
            name="Orders"
            component={OrdersScreen}
            options={{
              drawerIcon: () => <Ionicons name="list" size={24} />,
            }}
          />
          <Drawer.Screen
            name="Admin"
            component={AdminNavigatorFunction}
            options={{
              headerShown: false,
              drawerIcon: () => <Ionicons name="person" size={24} />,
            }}
          />
        </Drawer.Navigator>
      ) : (
        <AuthStackFunction />
      )}
    </NavigationContainer>
  );
};

export default NavigationContainerFunction;
