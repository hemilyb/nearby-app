import { api } from "./api"

export async function fetchCategories() {
  try {
    const { data } = await api.get("/categories")
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function fetchMarkets(category: string) {
  try {
    const { data } = await api.get(`/markets/category/${category}`)
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function fetchMarket(id: string) {
  try {
    const { data } = await api.get(`/markets/${id}`)
    return data
  } catch (error) {
    console.log(error)
  }
}