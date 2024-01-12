export function getModiferItemsWithQuantity(modifier_list: []) {
  return modifier_list.reduce((result: number[], current: any) => {
    return result.concat(
      current.modifier_value_list.filter(
        (modifierItem: any) => modifierItem.quantity,
      ),
    );
  }, []);
}

export function changeModifierItem({product, modifierItem}: any) {
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
