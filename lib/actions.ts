'use server'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import YahooFinance from 'yahoo-finance2'
import CandlestickChart from '@/components/ApexCharts'
import { YFProps } from '@/components/YahooFinance'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getOpenCloseTime() {
  let date = new Date() // UTC time
  for (let i = 0; i < 7; i++) {
    const year = date.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
    const month = date.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' })
    const day = date.toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric' })
    const hour = date.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric' })
    // date = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    if (date.getDay() === 0 || date.getDay() === 6) {
      date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
      continue
    } else {
      break
    }
  }
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
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let openTime = new Date()
  let closeTime = new Date()
  const tod = Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
  console.log('getOpenCloseTime', year, month, day, hour, minute, second, tod)
  if (tod <= 4 * 60 * 60) {
    openTime = new Date(`${year}-${month}-${day}T04:00:00-05:00`)
    closeTime = new Date(`${year}-${month}-${day}T20:00:00-05:00`)
    openTime = new Date(openTime.getTime() - 24 * 60 * 60 * 1000)
    closeTime = new Date(closeTime.getTime() - 24 * 60 * 60 * 1000)
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
  }
  return [openTime, closeTime]
}
const queryOptions: ChartOptionsWithReturnArray = {
  period1: new Date(),
  period2: new Date(),
  interval: '5m',
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
    console.log('actions', results)
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
