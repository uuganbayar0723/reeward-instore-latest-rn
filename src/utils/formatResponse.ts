export function formatMenu(res: any) {
  return res.data.category_list
    .filter((c: any) => c._id && c.name && c.product_list.length)
    .map((c: any) => {
      return {
        name: c.name.en_US,
        id: c._id,
        product_list: c.product_list.map((p: any) => ({
          categoryId: c._id,
          name: p.name.en_US,
          price: p.price,
          id: p._id,
          image_url: p.image_url || '',
          productType: p.productType,
          modifier_list: p.modifier_list,
          remaining_quantity: p.remaing_quantity,
          color: p.color,
        })),
      };
    });
}