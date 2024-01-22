export function formatMenu(res: any) {
  // console.log(res)
  const categories = res.data.category_list
    .filter((c: any) => c._id && c.name && c.product_list.length)
    .map((c: any) => {
      return {
        name: c.name.en_US,
        id: c._id,
        product_list: c.product_list.map((p: any) => ({
          categoryId: c._id,
          name: p.name.en_US,
          price: p.price,
          id: p.sourceId,
          image_url: p.image_url || '',
          productType: p.productType,
          bundled_item_list: p.bundled_item_list.map((bundleItem: any) => ({
            ...bundleItem,
            totalQuantity: 0,
            product_list: bundleItem.product_list.map((bundleProduct: any) => ({
              ...bundleProduct,
              quantity: 0,
              modifier_list: []
            })),
          })),
          modifier_list: p.modifier_list.map((m: any) => ({
            ...m,
            isModifierSingle: m.max_quantity === m.min_quantity,
            modifier_value_list: m.modifier_value_list.map((value: any) => ({
              ...value,
              quantity: value.is_default ? 1 : 0,
            })),
          })),
          remaining_quantity: p.remaing_quantity,
          color: p.color,
        })),
      };
    });

  const allProducts: any = categories.reduce((result: any, current: any) => {
    return result.concat(current.product_list);
  }, []);


  const allProductsHash: any = {};
  for (let i in allProducts) {
    allProductsHash[allProducts[i].id] = allProducts[i];
  }

  let result: any = {};

  result.categories = categories;
  result.allProductsHash = allProductsHash;

  return result;
}
