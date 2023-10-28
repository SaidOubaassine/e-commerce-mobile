import React, { useState, useEffect } from "react";
import {
  FlatList,
  Button,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
  Text
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import Colours from "../../constants/Colours";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const userProducts = useSelector((state) => state.products.userProducts);

  useEffect(() => {
    navigation.setOptions({
      title: "Your Products",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="card"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="card"
            iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
            onPress={() => navigation.navigate("EditProduct")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error occurred!", error, [{ text: "OK" }]);
    }
  }, [error]);

  const deleteHandler = (id) => {
    Alert.alert(
      "Delete product!",
      "Are you sure you want to delete this product?",
      [
        { text: "NO", style: "default" },
        {
          text: "YES",
          style: "destructive",
          onPress: async () => {
            setError(null);
            setIsLoading(true);
            try {
              await dispatch(productsActions.deleteProduct(id));
            } catch (err) {
              setError(err.message);
            }
            setIsLoading(false);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colours.darkblue} />
      </View>
    );
  }
  const editProductHandler = (id) => {
    navigation.navigate("EditProduct", { productId: id });
  };
  if (!isLoading && userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => editProductHandler(itemData.item.id)}
        >
          <Button
            color={Colours.darkblue}
            title="Edit"
            onPress={() => editProductHandler(itemData.item.id)}
          />
          <Button
            color={Colours.darkblue}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default UserProductsScreen;
