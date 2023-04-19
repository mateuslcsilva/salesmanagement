export const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

let current = new Date
let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
export const currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
export const currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())