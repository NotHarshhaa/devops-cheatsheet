// Helper functions for managing saved items in localStorage
export const getSavedItems = () => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('savedTools');
  return saved ? JSON.parse(saved) : [];
};

export const saveItem = (category: string) => {
  const savedItems = getSavedItems();
  if (!savedItems.includes(category)) {
    savedItems.push(category);
    localStorage.setItem('savedTools', JSON.stringify(savedItems));
  }
};

export const removeItem = (category: string) => {
  const savedItems = getSavedItems();
  const updatedItems = savedItems.filter((item: string) => item !== category);
  localStorage.setItem('savedTools', JSON.stringify(updatedItems));
};

export const isItemSaved = (category: string) => {
  const savedItems = getSavedItems();
  return savedItems.includes(category);
}; 