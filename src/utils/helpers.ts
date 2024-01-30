export function getModiferItemsWithQuantity(product: any) {
  return product.modifier_list.reduce((result: any, current: any) => {
    return result.concat(
      current.modifier_value_list
        .filter((modifierItem: any) => modifierItem.quantity)
        .map((mItem: any) => ({
          ...mItem,
          wrapperModifierName: current.name.en_US,
        })),
    );
  }, []);
}

export function getBundleItemsWithQuantity(product: any) {
  return product.bundled_item_list.reduce((result: any, current: any) => {
    return [...result, ...current.product_list.filter((p: any) => p.quantity)];
  }, []);
}

export function formatToBasket(product: any) {
  let result = [];
  const {modifier_list, bundled_item_list} = product;

  if (modifier_list.length) {
    result = formatModifierForBasket(product);
  }

  if (bundled_item_list.length) {
    const itemsWithQuantity = getBundleItemsWithQuantity(product);
    result = itemsWithQuantity.map((bItem: any) => ({
      quantity: bItem.quantity,
      name: bItem.bProduct.name,
      price: bItem.price.dine_in * bItem.quantity,
      subItems: formatModifierForBasket(bItem.bProduct),
    }));
  }

  return result;
}

function formatModifierForBasket(product: any) {
  const modifiersWithQuantity = getModiferItemsWithQuantity(product);
  return modifiersWithQuantity.map((mItem: any) => ({
    quantity: mItem.quantity,
    name: mItem.name.en_US,
    price: mItem.price.dine_in * mItem.quantity,
    subItems: [],
  }));
}

export function changeModifierItem({product, modifier, modifierItem}: any) {
  return {
    ...product,
    modifier_list: product.modifier_list.map((modifierLocal: any) => ({
      ...modifierLocal,
      modifier_value_list: modifierLocal.modifier_value_list.map(
        (modifierItemLocal: any) => ({
          ...modifierItemLocal,
          quantity:
            modifierItem._id === modifierItemLocal._id
              ? modifierItemLocal.quantity + 1
              : modifierItemLocal.quantity,
        }),
      ),
    })),
  };
}

export function calcIsModifierMinQuantityReached(modifier_list: any) {
  const minQuantityNotReachedLength = modifier_list.filter(
    (m: any) => m.min_quantity > calcModifierTotalQuantity(m),
  ).length;

  return minQuantityNotReachedLength === 0;
}

export function changeBundleItem({
  product,
  val,
  bundleListItem,
  bundleProduct,
}: any) {
  return {
    ...product,
    bundled_item_list: product.bundled_item_list.map(
      (bundleItemLocal: any) => ({
        ...bundleItemLocal,
        product_list: bundleItemLocal.product_list.map(
          (bundleProductLocal: any) => ({
            ...bundleProductLocal,
            quantity:
              bundleProductLocal._id === bundleListItem._id
                ? val
                : bundleProductLocal.quantity,
            bProduct:
              bundleProductLocal._id === bundleListItem._id
                ? bundleProduct
                : bundleProductLocal.bProduct,
          }),
        ),
      }),
    ),
  };
}

export function calcBundleItemTotalQuantity(bundleItem: any) {
  return bundleItem.product_list.reduce((result: number, current: any) => {
    return result + current.quantity;
  }, 0);
}

export function resetModifier({product, modifier}: any) {
  return {
    ...product,
    modifier_list: product.modifier_list.map((modifierLocal: any) => ({
      ...modifierLocal,
      modifier_value_list: modifierLocal.modifier_value_list.map(
        (modifierItemLocal: any) => ({
          ...modifierItemLocal,
          quantity:
            modifier._id === modifierLocal._id ? 0 : modifierItemLocal.quantity,
        }),
      ),
    })),
  };
}

export function calcModifierTotalQuantity(modifier: any) {
  return modifier.modifier_value_list.reduce(
    (total: number, current: any) => total + current.quantity,
    0,
  );
}

export function calcModifierTotalPrice(modifier: any) {
  return modifier.modifier_value_list.reduce(
    (total: number, current: any) =>
      total + current.quantity * current.price.dine_in,
    0,
  );
}
