import useCategories from './useCategories'

const useCategory = (categoryId: string) => {
  const { categories, isLoading } = useCategories()

  const category = categories?.find(category => category.category_id === Number(categoryId))

  return {
    category,
    isLoading
  }
}

export default useCategory
