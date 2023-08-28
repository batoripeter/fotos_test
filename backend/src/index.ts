import express from "express"
import cors from "cors"
import { z } from "zod"

const server = express()
server.use(cors())
server.use(express.json())

const FilterRequest = z.object({
  title: z.string().optional()
})

server.get("/api/images", async (req, res) => {

  const result = FilterRequest.safeParse(req.query)

  const data = [
    { id: 1, title: "Arnold", imgUrl: "https://miro.medium.com/v2/0*ZjYSm_q36J4KChdn" },
    { id: 2, title: "This is fine", imgUrl: "https://fruityslots.com/wp-content/uploads/2023/07/Rocket-Blast-Megaways-Base-Game-1536x859.webp" },
    { id: 3, title: "Stallone", imgUrl: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcR6XZP6rdW3VhHwZSxu3u4RCWyQFHTwl_4QSRK5t0km1FCytdaWwJEoNmW8c2ju5DRR4DbxppAQvVH441I" },
    { id: 4, title: "Meg egy", imgUrl: "https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fv1o9obo0eri91.png" },
    { id: 5, title: "Luke skywalker", imgUrl: "https://images.ladbible.com/resize?type=webp&quality=70&width=720&fit=contain&gravity=null&url=https://eu-images.contentstack.com/v3/assets/bltcd74acc1d0a99f3a/blt95edcdcd8423deb8/6272202eaf12620f29856818/starwarsememes2.png" },
    { id: 6, title: "Typescript any", imgUrl: "https://img.devrant.com/devrant/rant/r_3015646_HZCi4.jpg" },
    { id: 7, title: "Cameraman", imgUrl: "https://fortepan.download/_photo/2560/fortepan_44628.jpg" },
    { id: 8, title: "Masik", imgUrl: "https://assets.4cdn.hu/kraken/73sNjKtz4q1RsCU6s-xxl.png" },
    { id: 9, title: "Keep gambling", imgUrl: "https://i.kym-cdn.com/photos/images/original/002/242/388/29b.jpeg?fbclid=IwAR35gdlSTAlau0WLKP1SjwEHWnuvfI-map4oowOpLKJ0o0FVyjaChC8Ql6s" },
    { id: 10, title: "Wrong folder", imgUrl: "https://m.blog.hu/sa/sakkozzmindennap/image/11296_769989083052080_7461850536542634686_n-600x743.jpg" },
  ]

  if (!result.success) return res.sendStatus(400)
  if (result.data.title !== undefined)
    return res.json(data.filter(img => img.title.includes(result.data.title!)))

  res.json(data)
})

const OrderRequest = z.object({
  items: z.object({
    id: z.number(),
    smallAmount: z.number(),
    largeAmount: z.number(),
  }).array(),
  email: z.string().email()
})

server.post("/api/order", async (req, res) => {
  const result = OrderRequest.safeParse(req.body)
  if (!result.success) return res.sendStatus(400)

  console.log(result.data)
  return res.sendStatus(200)
})

server.listen(3333)
