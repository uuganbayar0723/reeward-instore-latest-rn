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

export function calcIsModifierMinQuantityReached(modifier_list: any) {
  const minQuantityNotReachedLength = modifier_list.filter(
    (m: any) => m.min_quantity > calcModifierTotalQuantity(m),
  ).length;

  return minQuantityNotReachedLength === 0;
}

export function calcBundleItemTotalQuantity(bundleItem: any) {
  let result = bundleItem.product_list.reduce(
    (result: number, current: any) => {
      return result + current.quantity;
    },
    0,
  );

  return parseFloat(result.toFixed(2));
}

export function calcModifierTotalQuantity(modifier: any) {
  let result = modifier.modifier_value_list.reduce(
    (total: number, current: any) => total + current.quantity,
    0,
  );

  return parseFloat(result.toFixed(2));
}

export function calcModifierTotalPrice(modifier: any) {
  let result = modifier.modifier_value_list.reduce(
    (total: number, current: any) =>
      total + current.quantity * current.price.dine_in,
    0,
  );

  return parseFloat(result.toFixed(2));
}

function calcModifierQuantitySum(modifier_list: any) {
  let result = modifier_list.reduce((result: number, current: any) => {
    return result + calcModifierTotalPrice(current);
  }, 0);

  return parseFloat(result.toFixed(2));
}

function calcBundleProductTotalPrice(bItem: any) {
  const {quantity, price, bProduct} = bItem;
  const {modifier_list} = bProduct;

  let result =
    quantity * (price.dine_in + calcModifierQuantitySum(modifier_list));

  return parseFloat(result.toFixed(2));
}

export function calcBasketTotalPriceSum(basketList: any) {
  let result = basketList.reduce(
    (result: number, current: any) => result + calcProductTotalPrice(current),
    0,
  );

  return parseFloat(result.toFixed(2));
}

export function calcProductTotalPrice(product: any) {
  const {price, modifier_list, bundled_item_list, quantity} = product;

  let result = price.dine_in;

  if (modifier_list.length) {
    const modiferTotalSum = calcModifierQuantitySum(modifier_list);
    result = result + modiferTotalSum;
  }

  if (bundled_item_list.length) {
    const bundleItemsWithQuantity = getBundleItemsWithQuantity(product);

    const bundleQuantitySum = bundleItemsWithQuantity.reduce(
      (result: number, current: any) => {
        return result + calcBundleProductTotalPrice(current);
      },
      0,
    );

    result = result + bundleQuantitySum;
  }

  result = result * quantity;

  return parseFloat(result.toFixed(2));
}

export function prepareModifierRequestFormat(modifier_list: any) {
  return modifier_list.map((modifier: any) => ({
    id: modifier.id,
    modifier_value_list: modifier.modifier_value_list
      .filter((mItem: any) => mItem.quantity)
      .map((mItem: any) => ({
        id: mItem.id,
        quantity: mItem.quantity,
      })),
  }));
}

export function prepareBasketReqFormat(basketList: any) {
  return basketList.map((basketItem: any) => ({
    product_uid: basketItem.id,
    quantity: basketItem.quantity,
    modifier_list: prepareModifierRequestFormat(basketItem.modifier_list),
    bundled_item_list: basketItem.bundled_item_list.map((bundleItem: any) => ({
      id: bundleItem.id,
      quantity: calcBundleItemTotalQuantity(bundleItem),
      product_list: bundleItem.product_list
        .filter((p: any) => p.quantity)
        .map((bundleProduct: any) => ({
          sourceId: bundleProduct.sourceId,
          quantity: bundleProduct.quantity,
          modifier_list: prepareModifierRequestFormat(
            bundleProduct.bProduct.modifier_list,
          ),
        })),
    })),
  }));
}

export function calSumPayments(payments: any) {
  return payments.reduce(
    (result: number, current: any) => current.amount + result,
    0,
  );
}