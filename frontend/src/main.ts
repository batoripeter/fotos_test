import "./style.css";
import { data } from "./util/data";
import { loadImages } from "./api";
import { render } from "./util/render";

type Image = {
  id: number
  title: string
  url: string
  smallAmount: number
  largeAmount: number
}

type Item = {
  id: number,
  smallAmount: number
  largeAmount: number
}

type Order = {
  email: string
  items: Item[]
}


// ------------------------------ App state ------------------------------
const isLoading = data(false)
const images = data<Image[]>([])
const searchInput = data("")
const order: Order | null = null
const page: "order" | "success" | "error" = "order"
const isSending = false
const notificationText = data<string | null>(null)
// ------------------------------ App state ------------------------------



// ------------------------------ Mutation ------------------------------
const search = async () => {
  isLoading.next(true)
  const response = await loadImages(searchInput.get() || undefined)
  isLoading.next(false)
  if (!response.success)
    return notificationText.next(response.error)
  const data = response.data
  images.next(data.map(img => ({ ...img, smallAmount: 0, largeAmount: 0 })))
}

const updateImagesWithSmallAmount = (id: number, amount: number) => {
  images.next(images.get().map(img => img.id !== id ? img : { ...img, smallAmount: amount }))
} 
// ------------------------------ Mutation ------------------------------


// ------------------------------ Event listener ------------------------------
const searchInputChangeListener = (event: Event) => {
  searchInput.next((event.target as HTMLInputElement).value)
}

const smallAmountInputListener = (event: Event) => {
  const inputElement = (event.target as HTMLInputElement)
  const id = +inputElement.id.split("sm-")[1]!
  const amount = +inputElement.value
  updateImagesWithSmallAmount(id, amount)
}
// ------------------------------ Event listener ------------------------------


// ------------------------------ Templates ------------------------------
const Loading = (isLoading: boolean): string =>
  isLoading ? `<span class="loading loading-dots loading-lg"></span>` : ""

const Notification = (notification: string | null): string => notification ? `
  <div class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>${notification}</span>
  </div>
  ` : ""

const Images = (images: Image[]): string => `
  <div class="flex gap-8 flex-wrap p-8">
    ${images.map(img => `
      <div class="card bg-primary text-primary-content shadow-xl basis-[240px] flex-grow flex-shrink-0">
        <figure><img src="${img.url}" alt="Shoes" /></figure>
        <div class="card-body">
          <h2 class="card-title">${img.title}</h2>
          <input id="sm-${img.id}" placeholder="Small images" value="${img.smallAmount}">
          <div class="card-actions justify-end">
            <button class="btn btn-success">Buy Now</button>
          </div>
        </div>
      </div>
    `).join("")}
  </div>
`

const Navbar = (searchValue: string): string => `
  <input id="search-input" value="${searchValue}">
  <button id="search-button">Search</button>
`
// ------------------------------ Templates ------------------------------

// ------------------------------ Rendering ------------------------------
isLoading.subscribe(value => render("loading-container", Loading(value)))
notificationText.subscribe(notification => render("notification-container", Notification(notification)))

images.subscribe(images => render(
  "images-container",
  Images(images),
  images.reduce(
    (listeners, img) => ({ ...listeners, [`sm-${img.id}`]: { "input": smallAmountInputListener } }),
  { })))

searchInput.subscribe(value => render("navbar-container", Navbar(value), {
  "search-input": { "input": searchInputChangeListener },
  "search-button": { "click": search },
}))
// ------------------------------ Rendering ------------------------------

search()



