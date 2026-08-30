// Helper functions for managing saved items in localStorage
export const getSavedItems = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('savedTools');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveItem = (item: string) => {
  const savedItems = getSavedItems();
  if (!savedItems.includes(item)) {
    savedItems.push(item);
    localStorage.setItem('savedTools', JSON.stringify(savedItems));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('saved-items-changed'));
    }
  }
};

export const removeItem = (item: string) => {
  const savedItems = getSavedItems();
  const updatedItems = savedItems.filter((i: string) => i !== item);
  localStorage.setItem('savedTools', JSON.stringify(updatedItems));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('saved-items-changed'));
  }
};

export const clearAllSavedItems = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('savedTools');
    window.dispatchEvent(new Event('saved-items-changed'));
  }
};

export const isItemSaved = (item: string) => {
  const savedItems = getSavedItems();
  return savedItems.includes(item);
};