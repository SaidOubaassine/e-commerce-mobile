import ProductItem from "../../components/shop/ProductItem";
import React from "react";
import {
  FlatList,
  Button,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Colours from "../../constants/Colours";
import { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as productsActions from "../../store/actions/products";
import * as cartActions from "../../store/actions/cart";
function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [onRefreshing, setOnRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();
  const loadProducts = useCallback(async () => {
    // Note multiple set-states get batched together by React!
    setError(null);
    setOnRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setOnRefreshing(false);
  }, [dispatch]);
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    navigation.navigate("Detail", {
      productId: id,
      productTitle: title,
    });
  };
  useEffect(() => {
    const willFocusEvent = navigation.addListener("willFocus", loadProducts);
    return () => willFocusEvent.remove();
  }, [loadProducts]);
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colours.darkblue}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colours.darkblue} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found!</Text>
      </View>
    );
  }
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={onRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() =>
            selectItemHandler(itemData.item.id, itemData.item.title)
          }
        >
          <Button
            color={Colours.darkblue}
            title="View Details"
            onPress={() =>
              selectItemHandler(itemData.item.id, itemData.item.title)
            }
          />
          <Button
            color={Colours.darkblue}
            title="To Cart"
            onPress={() => dispatch(cartActions.addToCard(itemData.item))}
          />
        </ProductItem>
      )}
    />
  );
}
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Home;
