'use server'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import YahooFinance from 'yahoo-finance2'
import CandlestickChart from '@/components/ApexCharts'
import { YFProps } from '@/components/YahooFinance'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const StockHolidays = [
  new Date('2025-12-25'),
  new Date('2026-01-01'),
  new Date('2026-01-19'),
  new Date('2026-02-16'),
  new Date('2026-04-03'),
  new Date('2026-05-25'),
  new Date('2026-06-19'),
  new Date('2026-07-03'),
  new Date('2026-07-04'),
  new Date('2026-09-07'),
  new Date('2026-11-26'),
  new Date('2026-12-25'),
  new Date('2027-01-01'),
  new Date('2027-01-18'),
  new Date('2027-02-15'),
  new Date('2027-03-26'),
  new Date('2027-05-19'),
  new Date('2027-05-31'),
  new Date('2027-06-18'),
  new Date('2027-07-04'),
  new Date('2027-07-05'),
  new Date('2027-09-06'),
  new Date('2027-11-25'),
  new Date('2027-12-25'),
]
const isStockHoliday = (today) => {
  const year = today.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
  const month = today.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' })
  const day = today.toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric' })
  const usToday = new Date(`${year}-${month}-${day}`)
  for (let i = 0; i < StockHolidays.length; i++) {
    if (usToday.getTime() === StockHolidays[i].getTime()) {
      return true
    }
  }
  return false
}
/**
 *
 */
const weekDayValue = 'long'
const options = {
  timeZone: 'America/New_York',
  weekday: weekDayValue as 'long' | 'short' | 'narrow',
}
/**
 *
 */
const isSaturday = (date) => {
  const easternDay = date.toLocaleDateString('en-US', options)
  if (easternDay === 'Saturday') {
    return true
  } else {
    return false
  }
}
/**
 *
 */
const isSunday = (date) => {
  const easternDay = date.toLocaleDateString('en-US', options)
  if (easternDay === 'Sunday') {
    return true
  } else {
    return false
  }
}
/**
 *
 */
const getRegularDay = (today): [boolean, Date] => {
  let D = new Date(today)
  let backed = false
  for (let i = 0; i < 7; i++) {
    if (isStockHoliday(D)) {
      D = new Date(D.getTime() - 24 * 60 * 60 * 1000)
      console.log('getRegularDay stockHoliday', D)
      backed = true
      continue
    }
    if (isSunday(D)) {
      D = new Date(D.getTime() - 48 * 60 * 60 * 1000)
      console.log('getRegularDay Sunday', D)
      backed = true
      continue
    }
    if (isSaturday(D)) {
      D = new Date(D.getTime() - 24 * 60 * 60 * 1000)
      console.log('getRegularDay Saturday', D)
      backed = true
      continue
    }
    break
  }
  return [backed, D]
}
/**
 *
 */
export const getFiveRegularDays = async (today: Date): Promise<Date[]> => {
  const fiveDays: Date[] = [] as Date[]
  let day = new Date(today)
  for (let i = 0; i < 5; i++) {
    const [f, D] = getRegularDay(day)
    fiveDays.push(D)
    day = new Date(D.getTime() - 24 * 60 * 60 * 1000)
  }
  return fiveDays
}
/**
 *
 */
export async function getOpenCloseTime(today?: Date) {
  const [dayBacked, date] = getRegularDay(today ? new Date(today) : new Date())
  /**
  for (let i = 0; i < 7; i++) {
    const year = date.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
    const month = date.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' })
    const day = date.toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric' })
    const hour = date.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric' })
    // date = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    if (date.getDay() === 0 || date.getDay() === 6 || isStockHoliday(date)) {
      date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
      continue
    } else {
      break
    }
  }
  */
  console.log('getRegularDay', dayBacked, date)
  const year = date.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
  const month = date.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' })
  const day = date.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' })
  const hour = date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hourCycle: 'h23',
  })
  const minute = date.toLocaleString('en-US', { timeZone: 'America/New_York', minute: '2-digit' })
  const second = date.toLocaleString('en-US', { timeZone: 'America/New_York', second: '2-digit' })
  let openTime = new Date()
  let closeTime = new Date()
  const tod = Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
  console.log('getOpenCloseTime', year, month, day, hour, minute, second, tod)
  // TODO handle daylight saving time
  if (tod <= 4 * 60 * 60) {
    openTime = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    closeTime = new Date(`${year}-${month}-${day}T20:00:00-05:00`)
    if (dayBacked === false) {
      openTime = new Date(openTime.getTime() - 24 * 60 * 60 * 1000)
      closeTime = new Date(closeTime.getTime() - 24 * 60 * 60 * 1000)
      // regular day if it is a day before holiday
      // const [daybacked, date] = getRegularDay(openTime)
      console.log('open/close 0 time', date)
    }
    console.log('open/close 1 time', openTime, closeTime)
  } else if (tod >= 20 * 60 * 60) {
    openTime = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    closeTime = new Date(`${year}-${month}-${day}T20:00:00-05:00`)
    console.log('open/close 2 time', openTime, closeTime)
  } else {
    openTime = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    closeTime = new Date()
    console.log('open/close 3 time', openTime, closeTime)
  }
  /**
  for (let i = 0; i < 7; i++) {
    const towOpen = openTime.getDay()
    console.log('dow open', DOW[towOpen])
    const towClose = closeTime.getDay()
    console.log('dow close', DOW[towClose])
    if (towOpen === 0 || towOpen === 6 || towClose === 0 || towClose === 6) {
      openTime = new Date(openTime.getTime() - 24 * 60 * 60 * 1000)
      closeTime = new Date(closeTime.getTime() - 24 * 60 * 60 * 1000)
      const year = closeTime.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
      })
      const month = closeTime.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'numeric',
      })
      const day = closeTime.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        day: 'numeric',
      })
      closeTime = new Date(`${year}-${month}-${day}T20:00:00-05:00`)
      continue
    } else {
      break
    }
  }*/
  return [openTime, closeTime]
}
const queryOptions: ChartOptionsWithReturnArray = {
  period1: new Date(),
  period2: new Date(),
  interval: '1m',
}
const yfProps: YFProps = { symbol: 'SOXL', options: queryOptions }

/**
 *
 */
export async function updateButton(O: YFProps) {
  console.log('updateButton', O)
  yfProps.symbol = O.symbol
  yfProps.options = O.options
  try {
    const yahooFinance = new YahooFinance()
    const R = await yahooFinance.search(O.symbol)
    const Q = await yahooFinance.quote(O.symbol)
    const results = await yahooFinance.chart(O.symbol, O.options)
    // console.log('actions', results)
    return results
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return null
  }
}
/**
 *
 */
export async function updateTicker(O: YFProps) {
  console.log('updateTicker', O)
  yfProps.symbol = O.symbol
  yfProps.options = O.options
  revalidatePath('/')
}
/**
 *
 */
export const getChartOptions = async (): Promise<YFProps> => {
  'use server'
  const [estTime1, estTime2] = await getOpenCloseTime()
  queryOptions.period1 = estTime1
  queryOptions.period2 = estTime2
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        symbol: yfProps.symbol,
        options: yfProps.options as ChartOptionsWithReturnArray,
      })
    }, 1000)
  })
}
