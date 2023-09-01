export const data = <T>(initialValue: T) => {

  let value = initialValue
  let subscriptions: ((nextValue: T) => any)[] = []

  const get = () => value
  const next = (nextValue: T) => {
    value = nextValue
    subscriptions.forEach(subscription => subscription(nextValue))
  }

  const subscribe = (subscription: (nextValue: T) => any) => {
    subscriptions = [ ...subscriptions, subscription ]
    subscription(value)
  }

  return {
    get,
    next,
    subscribe
  }
}

/* const _fruit = data("alma")
_fruit.subscribe(value => console.log(value))
_fruit.subscribe(value => console.log("x"))

_fruit.next("korte")
_fruit.next("barack")

// -----

let fruit = "alma"
console.log(fruit)
console.log("x")

fruit = "korte"
console.log(fruit)

fruit = "barack"
console.log(fruit) */

