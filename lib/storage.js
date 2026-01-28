// localStorage-based favorites management

const FAVORITES_KEY = 'localityiq_favorites'

export const storage = {
  // Get all favorites from localStorage
  getFavorites: () => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error)
      return []
    }
  },

  // Add a locality to favorites
  addFavorite: (localityId) => {
    try {
      const favorites = storage.getFavorites()
      if (!favorites.includes(localityId)) {
        favorites.push(localityId)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding favorite to localStorage:', error)
      return false
    }
  },

  // Remove a locality from favorites
  removeFavorite: (localityId) => {
    try {
      const favorites = storage.getFavorites()
      const updatedFavorites = favorites.filter(id => id !== localityId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
      return true
    } catch (error) {
      console.error('Error removing favorite from localStorage:', error)
      return false
    }
  },

  // Toggle favorite status
  toggleFavorite: (localityId) => {
    const favorites = storage.getFavorites()
    if (favorites.includes(localityId)) {
      storage.removeFavorite(localityId)
      return false // removed
    } else {
      storage.addFavorite(localityId)
      return true // added
    }
  },

  // Check if a locality is favorited
  isFavorite: (localityId) => {
    const favorites = storage.getFavorites()
    return favorites.includes(localityId)
  },

  // Get count of favorites
  getFavoritesCount: () => {
    return storage.getFavorites().length
  }
}

export default storage
