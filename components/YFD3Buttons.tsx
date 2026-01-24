import * as d3 from 'd3'
import emitter from '@/components/Emitter'
import { useRouter } from 'next/navigation'
import { YFProps } from '@/components/YahooFinance'
import React, { useEffect, useState, useRef } from 'react'
import { CandlestickChartProps } from '@/components/ApexCharts'
import { getOpenCloseTime, getFiveRegularDays, updateButton } from '@/lib/actions'
import {
  ChartResultArray,
  ChartResultArrayQuote,
  ChartOptionsWithReturnArray,
} from 'yahoo-finance2/esm/src/modules/chart.js'
import {
  ItemProps,
  ItemsProps,
  QuotesItems,
  IndicatorsItems,
  StrategiesItems,
  menuItemClass,
  menuItemClassHighlight,
} from '@/components/FinanceConstants'
/**
 *
 */
export interface ButtonClickedProps {
  id: string
  result: CandlestickChartProps
  strategyId?: string
  button?: string
}
const TooltipCls =
  ' max-w-[150px] md:max-w-[300px] bg-stone-900 -translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300 border-2 border-blue-500 p-4'
const DialogtipCls =
  'hidden md:whitespace-pre-wrap md:block max-w-[150px] md:max-w-[500px] bg-stone-900 -translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300 border-2 border-blue-500 p-4'

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'finance-tooltip-body')
  .attr('class', TooltipCls)
  .style('opacity', 0)
  .style('position', 'absolute')
  .style('pointer-events', 'none')
const dialogtip = d3
  .select('body')
  .append('div')
  .attr('id', 'finance-description-body')
  .attr('class', DialogtipCls)
  .style('opacity', 0)
  .style('position', 'fixed')
  .style('pointer-events', 'none')

/**
 *
 */
const startSpinner = () => {
  const spinner = d3.selectAll('main').select('#loadingSpinner')
  if (spinner) {
    spinner.attr('class', 'absolute left-1/2 top-1/2')
  }
}
/**
 *
 */
const stopSpinner = () => {
  const spinner = d3.selectAll('main').select('#loadingSpinner')
  if (spinner) {
    spinner.attr('class', 'absolute left-1/2 top-1/2 hidden')
  }
}
/**
 *
 */
function showMarquee(fullName, description) {
  const M = d3.selectAll('main').select('#chart').select('#marquee')
  if (M) {
    M.html(fullName)
    M.attr('data-description', description)
    M.attr('data-fullname', fullName)
  }
}
/**
 *
 */
const showInterDiff = (open, close, text) => {
  // console.log('showInterDiff', open, close, text)
  const D1 = d3.selectAll('main').select('#quoteCompare').select('#IntraDay')
  if (D1) {
    D1.html(text)
  }
  const D2 = d3.selectAll('main').select('#quoteCompare').select('#preClose')
  if (D2) {
    D2.html(open.toFixed(2))
  }
  const D3 = d3.selectAll('main').select('#quoteCompare').select('#quote')
  if (D3 && close) {
    D3.html(close.toFixed(2))
  }
  const D4 = d3.selectAll('main').select('#quoteCompare').select('#diff')
  if (D4) {
    const d = close - open
    const p = (d / open) * 100.0
    // console.log('p', p)
    if (d > 0) {
      D4.attr('class', 'text-center text-xs text-green-700 md:text-base')
      const s = '+' + d.toFixed(2) + '/+' + p.toFixed(2) + '%'
      D4.html(s)
    } else {
      D4.attr('class', 'text-center text-xs text-red-700 md:text-base')
      const s = d.toFixed(2) + '/' + p.toFixed(2) + '%'
      D4.html(s)
    }
  }
}
/**
 *
 */
async function handleButton1D(indicatorId, name, callback, strategyId?) {
  console.log('button1D clicked indicatorId', indicatorId)
  startSpinner()
  const today = new Date()
  const [estTime1, estTime2] = await getOpenCloseTime()
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1m',
  }
  const Quotes: ChartResultArrayQuote[] = [] as ChartResultArrayQuote[]
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('handleButton1D replied results', results)
  if (results !== null) {
    for (let j = 0; j < results.quotes.length; j++) {
      if (results.quotes[j].volume !== 0) Quotes.push(results.quotes[j])
      // Quotes.push(results.quotes[j])
    }
    if (Quotes.length == 0) {
      for (let j = 0; j < results.quotes.length; j++) {
        Quotes.push(results.quotes[j])
      }
    }
    if (Quotes.length > 0) {
      const O = Quotes[0].open
      const C = Quotes[Quotes.length - 1].close
      showInterDiff(O, C, 'InterDay')
    }
    results.quotes = Quotes
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleButton5D(indicatorId, name, callback, strategyId?) {
  console.log('button5D clicked')
  startSpinner()
  const interval = 30 * 60 * 1000
  const [tmp, estTime2] = await getOpenCloseTime()
  // const estTime1 = new Date(tmp.getTime() - 4 * 24 * 60 * 60 * 1000)
  const fiveDays = await getFiveRegularDays(tmp)
  console.log('5D, fiveDays', fiveDays)
  const Quotes: ChartResultArrayQuote[] = [] as ChartResultArrayQuote[]
  for (let i = 4; i >= 0; i--) {
    const d = fiveDays[i]
    const [t1, t2] = await getOpenCloseTime(d)
    const queryOptions: ChartOptionsWithReturnArray = {
      period1: t1,
      period2: t2,
      interval: '15m',
    }
    const O: YFProps = { symbol: name, options: queryOptions }
    const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
    if (results !== null) {
      for (let j = 0; j < results.quotes.length; j++) {
        if (results.quotes[j].volume !== 0) Quotes.push(results.quotes[j])
      }
    }
    if (i == 0) {
      const startDate = fiveDays[4]
      const dt = Math.trunc((5 * 24 * 60) / Quotes.length)
      //let preTime = new Date(Quotes[0].date).getTime()
      //const gaps: number[] = [] as number[]
      for (let i = 0; i < Quotes.length; i++) {
        //const t = new Date(Quotes[i].date).getTime()
        //if (t - preTime > 60 * 60 * 1000 * 12) gaps.push(i)
        //preTime = t
        Quotes[i].date = new Date(startDate.getTime() - 13 * 60 * 60 * 1000 + i * dt * 60 * 1000)
      }
      /*
      console.log('5D gaps', gaps)
      for (let j = 0; j < gaps.length; j++) {
        const l = gaps[j]
        if (l > 0) {
          const t = new Date(Quotes[l + j - 1].date.getTime() + 15 * 60 * 1000)
          const v = {...Quotes[l - 1]}
          v.date = new Date(t)
          v.close = null
          Quotes.splice(l, 0, v)
        }
      }*/
      if (results !== null) {
        const O = Quotes[0].open
        const C = Quotes[Quotes.length - 1].close
        showInterDiff(O, C, 'In 5D')
        results.quotes = Quotes
        const R: CandlestickChartProps = { title: name, D: results }
        const B: ButtonClickedProps = { id: indicatorId, result: R }
        callback(B)
      }
    }
  }
  stopSpinner()
}
/**
 *
 */
async function handleButton1M(indicatorId, name, callback, strategyId?) {
  console.log('button1M clicked')
  startSpinner()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 30 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  // console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const O = results.quotes[0].open
    const C = results.quotes[results.quotes.length - 1].close
    showInterDiff(O, C, 'In 1M')
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleButton6M(indicatorId, name, callback, strategyId?) {
  console.log('button6M clicked')
  startSpinner()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 180 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  // console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const O = results.quotes[0].open
    const C = results.quotes[results.quotes.length - 1].close
    showInterDiff(O, C, 'In 6M')
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleButtonYTD(indicatorId, name, callback, strategyId?) {
  console.log('buttonYTD clicked')
  startSpinner()
  const daysBetween = (startDate, endDate) => {
    const oneDay = 1000 * 60 * 60 * 24
    const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    const differenceMs = Math.abs(endUTC - startUTC)
    return Math.floor(differenceMs / oneDay)
  }
  const year = new Date().getFullYear()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(year + '-01-01')
  const sDate = estTime2.setHours(0, 0, 0, 0)
  const nDay = new Date(sDate)
  const diffDays = daysBetween(estTime1, nDay)
  // I need 400 quotes data
  let Interval:
    | '5m'
    | '1m'
    | '2m'
    | '15m'
    | '30m'
    | '60m'
    | '90m'
    | '1h'
    | '1d'
    | '5d'
    | '1wk'
    | '1mo'
    | '3mo'
    | undefined = '1d'
  if (diffDays > 180) Interval = '5d'
  if (diffDays <= 180 && diffDays > 30) Interval = '1d'
  if (diffDays <= 30 && diffDays > 5) Interval = '30m'
  if (diffDays <= 5) Interval = '15m'
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: Interval,
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  // console.log('handleButtonYTD actions replied results', results)
  if (results !== null) {
    const O = results.quotes[0].open
    const C = results.quotes[results.quotes.length - 1].close
    showInterDiff(O, C, 'YTD')
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleButton1Y(indicatorId, name, callback, strategyId?) {
  console.log('button1Y clicked')
  startSpinner()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 365 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1wk',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  // console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const O = results.quotes[0].open
    const C = results.quotes[results.quotes.length - 1].close
    showInterDiff(O, C, 'In 1Y')
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleButton5Y(indicatorId, name, callback, strategyId?) {
  console.log('button5Y clicked')
  startSpinner()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 5 * 365 * (24 + 5) * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1wk',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  // console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const O = results.quotes[0].open
    const C = results.quotes[results.quotes.length - 1].close
    showInterDiff(O, C, 'In 5Y')
    const R: CandlestickChartProps = { title: name, D: results }
    const B: ButtonClickedProps = { id: indicatorId, result: R }
    callback(B)
  }
  stopSpinner()
}
/**
 *
 */
async function handleIndicatorButton(indicatorId, buttonId, name, callback) {
  switch (buttonId) {
    case 'button-1D':
    case '1 D':
      return handleButton1D(indicatorId, name, callback)
      break
    case 'button-5D':
    case '5 D':
      return handleButton5D(indicatorId, name, callback)
      break
    case 'button-1M':
    case '1 M':
      return handleButton1M(indicatorId, name, callback)
      break
    case 'button-6M':
    case '6 M':
      return handleButton6M(indicatorId, name, callback)
      break
    case 'button-1Y':
    case '1 Y':
      return handleButton1Y(indicatorId, name, callback)
      break
    case 'button-5Y':
    case '5 Y':
      return handleButton5Y(indicatorId, name, callback)
      break
    case 'button-YTD':
    case 'YTD':
      return handleButtonYTD(indicatorId, name, callback)
      break
    default:
      console.log('handleIndicatorButton', buttonId)
      break
  }
}

const StockHolidays = [
  { date: new Date('2025-12-25'), description: `Christmas Day` },
  { date: new Date('2026-01-01'), description: `new Year's Day` },
  { date: new Date('2026-01-19'), description: `Martin Luther King, Jr. Day` },
  { date: new Date('2026-02-16'), description: `Washington's Birthday` },
  { date: new Date('2026-04-03'), description: `Good Firday` },
  { date: new Date('2026-05-25'), description: `Memorial Day` },
  { date: new Date('2026-06-19'), description: `Juneteenth National Independence Day` },
  { date: new Date('2026-07-03'), description: `Independence Day observed` },
  { date: new Date('2026-07-04'), description: `Independence Day` },
  { date: new Date('2026-09-07'), description: `Labor Day` },
  { date: new Date('2026-11-26'), description: `Thanksgiving Day` },
  { date: new Date('2026-12-25'), description: `Christmas Day` },
  { date: new Date('2027-01-01'), description: `new Year's Day` },
  { date: new Date('2027-01-18'), description: `Martin Luther King, Jr. Day` },
  { date: new Date('2027-02-15'), description: `Washington's Birthday` },
  { date: new Date('2027-03-26'), description: `Good Firday` },
  { date: new Date('2027-05-31'), description: `Memorial Day` },
  { date: new Date('2027-06-18'), description: `Juneteenth National Independence Day` },
  { date: new Date('2027-07-04'), description: `Independence Day` },
  { date: new Date('2027-07-05'), description: `Independence Day observed` },
  { date: new Date('2027-09-06'), description: `Labor Day` },
  { date: new Date('2027-11-25'), description: `Thanksgiving Day` },
  { date: new Date('2027-12-25'), description: `Christmas Day` },
]
const isStockHoliday = (today): [boolean, string] => {
  const year = today.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
  const month = today.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' })
  const day = today.toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric' })
  const usToday = new Date('${year}-${month}-${day}')
  let v: [boolean, string] = [false, '']
  for (let i = 0; i < StockHolidays.length; i++) {
    if (usToday.getTime() === StockHolidays[i].date.getTime()) {
      v = [true, StockHolidays[i].description]
      break
    }
  }
  return v
}

/**
 *
 */
/**
const showCoreData = (indicatorId, name, callback) => {
  console.log('showCoreData, name', name)
  const coredata = d3.select('#yahooFinance').select('#CoreData')
  const today = new Date()
  const year = today.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
  const month = today.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' })
  const day = today.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' })
  const hour = today.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hourCycle: 'h23',
  })
  const minute = today.toLocaleString('en-US', { timeZone: 'America/New_York', minute: '2-digit' })
  const second = today.toLocaleString('en-US', { timeZone: 'America/New_York', second: '2-digit' })
  let usToday = today.toLocaleString('en-US', { timeZone: 'America/New_York' })
  const dynamicWeekdayValue = 'long'
  const options = {
    timeZone: 'America/New_York',
    weekday: dynamicWeekdayValue as 'long' | 'short' | 'narrow',
  }
  const easternDay = new Date().toLocaleDateString('en-US', options)
  console.log('easternDay', easternDay)
  usToday = ': ' + easternDay + ', ' + usToday + ', est.'
  if (easternDay === 'Sunday') {
    coredata.html(`<span>US Market is closed on Sunday<span>. <span>US Now ${usToday}</span>`)
    return
  }
  if (easternDay === 'Saturday') {
    coredata.html(`<span>US Market is closed on Saturady.</span><span>US Now ${usToday}</span>`)
    return
  }
  const [r, v] = isStockHoliday(today)
  if (r) {
    coredata.html(`<span>US Market is closed on ${v}.</span><span>US Now ${usToday}</span>`)
    return
  }
  const now = Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
  const preMarketTime = 4 * 60 * 60
  const openTime = 9 * 60 * 60 + 30 * 60 + 0
  const closeTime = 16 * 60 * 60 + 0 * 60 + 0
  if (now < openTime) {
    const d = openTime - now
    const h = Math.floor(d / 3600)
    const m = Math.floor((d - h * 3600) / 60)
    coredata.html(
      `<span>US Market will open ${h} hours ${m} minutes later.</span><span>US Now ${usToday}</span>`
    )
    if (now > preMarketTime) handleButton1D(indicatorId, name, callback)
  } else if (now >= openTime && now < closeTime) {
    const d = closeTime - now
    const h = Math.floor(d / 3600)
    const m = Math.floor((d - h * 3600) / 60)
    coredata.html(
      `<span>US Market will close ${h} hours ${m} minutes later.</span><span>US Now ${usToday}</span>`
    )
    handleButton1D(indicatorId, name, callback)
  } else {
    coredata.html(`<span>US Market is closed.</span><span>US Now ${usToday}</span>`)
  }
}
*/
/**
 *
 */
interface YFD3ButtonsProps {
  onButtonClicked: (B: ButtonClickedProps) => void
}
/**
 *
 */
interface MenuProps {
  button: string
  items: ItemsProps[]
}
const YFD3Buttons: React.FC<YFD3ButtonsProps> = ({ onButtonClicked }) => {
  const [buttonClicked, setButtonClicked] = useState('button-1D')
  const [indicatorClicked, setIndicatorClicked] = useState('button-VOL')
  const [quotesButton, setQuotesButton] = useState('1 D')
  const [indicatorsButton, setIndicatorsButton] = useState('VOL')
  const [strategiesButton, setStrategiesButton] = useState('RSI2')
  const [timeoutId, setTimeoutId] = useState<{ id: number }>({ id: -1 })
  const timeoutRef = useRef<number>(Date.now())
  const coreDataRef = useRef<number>(0)
  const nameRef = useRef<string>('SOXL')
  const router = useRouter()
  const buttons = d3.selectAll('main').selectAll('button')
  const nodes = buttons.nodes()
  const cls =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-black text-xs md:text-base md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700'
  const clsH =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-red-500 text-xs md:text-base underline md:no-underline md:w-full md:bg-pink-500 md:text-white md:hover:bg-pink-700'
  /**
  const B: MenuItemsProps[] = [] as MenuItemsProps
  for (let i = 0; i < QuotesItems.length; i++) {
    for (let j = 0; j < QuotesItems[i].items.length; j++) {
      const N = QuotesItems[i].items[j]
      const M: MenuItemsProps = { menuItem: N}
      if (N.name === '1 D') B.push({ menuItem: N, action1: hanbleButton1D })
      if (N.name === '5 D') B.push({ menuItem: N, action1: hanbleButton5D })
    }
  }
  */
  QuotesItems[0].items[0] = { ...QuotesItems[0].items[0], action1: handleButton1D }
  QuotesItems[0].items[1] = { ...QuotesItems[0].items[1], action1: handleButton5D }
  QuotesItems[0].items[2] = { ...QuotesItems[0].items[2], action1: handleButton1M }
  QuotesItems[0].items[3] = { ...QuotesItems[0].items[3], action1: handleButton6M }
  QuotesItems[0].items[4] = { ...QuotesItems[0].items[4], action1: handleButtonYTD }
  QuotesItems[0].items[5] = { ...QuotesItems[0].items[5], action1: handleButton1Y }
  QuotesItems[0].items[6] = { ...QuotesItems[0].items[6], action1: handleButton5Y }
  for (let i = 0; i < IndicatorsItems.length; i++) {
    for (let j = 0; j < IndicatorsItems[i].items.length; j++) {
      IndicatorsItems[i].items[j] = {
        ...IndicatorsItems[i].items[j],
        action2: handleIndicatorButton,
      }
    }
  }
  const buttonItems: MenuProps[] = [
    {
      button: 'MenuQuotes',
      items: QuotesItems,
    },
    {
      button: 'MenuIndicators',
      items: IndicatorsItems,
    },
    {
      button: 'MenuStrategies',
      items: StrategiesItems,
    },
  ]
  const origButtons: ItemProps[] = [
    { name: 'button-1D', action1: handleButton1D },
    { name: 'button-5D', action1: handleButton5D },
    { name: 'button-1M', action1: handleButton1M },
    { name: 'button-6M', action1: handleButton6M },
    { name: 'button-YTD', action1: handleButtonYTD },
    { name: 'button-1Y', action1: handleButton1Y },
    { name: 'button-5Y', action1: handleButton5Y },
    { name: 'button-VOL', action2: handleIndicatorButton },
    { name: 'button-RSI', action2: handleIndicatorButton },
    { name: 'button-ATR', action2: handleIndicatorButton },
    { name: 'button-MCI', action2: handleIndicatorButton },
    { name: 'button-MACD', action2: handleIndicatorButton },
  ]
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    switch (id) {
      case 'button-1D':
      case 'button-5D':
      case 'button-1M':
      case 'button-6M':
      case 'button-YTD':
      case 'button-1Y':
      case 'button-5Y':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          origButtons.forEach((item) => {
            if (item.name === id) {
              if (item.action1) item.action1(indicatorClicked, nameRef.current, onButtonClicked)
            }
          })
          d3.select(this).attr('class', clsH)
          setButtonClicked(id)
          router.refresh()
        })
        if (buttonClicked === id) {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-VOL':
      case 'button-RSI':
      case 'button-ATR':
      case 'button-MFI':
      case 'button-MACD':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          origButtons.forEach((item) => {
            if (item.name === id) {
              if (item.action2) item.action2(id, buttonClicked, nameRef.current, onButtonClicked)
            }
          })
          d3.select(this).attr('class', clsH)
          setIndicatorClicked(id)
          router.refresh()
        })
        if (indicatorClicked === id) {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'MenuQuotes':
      case 'MenuIndicators':
      case 'MenuStrategies':
        d3.select(nodes[i]).on('click', function (event, d) {
          console.log('%s clicked', id)
          let menuItemsId
          if (id === 'MenuQuotes') {
            menuItemsId = d3.select('body').select('#ItemsQuotes')
          } else if (id === 'MenuIndicators') {
            menuItemsId = d3.select('body').select('#ItemsIndicators')
          } else {
            menuItemsId = d3.select('body').select('#ItemsStrategies')
          }
          const B = menuItemsId.selectAll('button')
          const N = B.nodes()
          console.log('N', N)
          for (let j = 0; j < N.length; j++) {
            // catch onClick event
            d3.select(N[j]).on('click', function () {
              const html = d3.select(this).html()
              console.log('%s clicked', html)
              nameRef.current = d3.select(this).attr('data-name')
              buttonItems.forEach((btn) => {
                if (btn.button === id) {
                  const btns = btn.items
                  for (let k = 0; k < btns.length; k++) {
                    const ids = btns[k].items
                    for (let l = 0; l < ids.length; l++) {
                      if (html === ids[l].name) {
                        const min = d3.select('body').select('#MenuItemName')
                        if (min) {
                          const Q = min.select('#Quotes')
                          const I = min.select('#Indicators')
                          const S = min.select('#Strategies')
                          if (id === 'MenuQuotes' && Q !== null) {
                            Q.html(html)
                            setQuotesButton(html)
                            const action = ids[l].action1 ?? null
                            if (action) {
                              action(indicatorsButton, nameRef.current, onButtonClicked)
                              router.refresh()
                            }
                          } else if (id === 'MenuIndicators' && I !== null) {
                            I.html(html)
                            setIndicatorsButton(html)
                            const action = ids[l].action2 ?? null
                            const strategyName = ids[l].strategyName ?? null
                            if (strategyName) {
                              setStrategiesButton(strategyName)
                              if (S !== null) S.html(strategyName)
                            }
                            //console.log('action', action)
                            if (action) {
                              action(html, quotesButton, nameRef.current, onButtonClicked)
                              router.refresh()
                            }
                            showMarquee(ids[l].fullName, ids[l].description)
                          } else if (id === 'MenuStrategies' && S !== null) {
                            S.html(html)
                            setStrategiesButton(html)
                          }
                        }
                        break
                      }
                    }
                  }
                }
              })
            })
            // catch on mouseover event
            d3.select(N[j]).on('mouseover', function (event) {
              buttonItems.forEach((btn) => {
                const html = d3.select(this).html()
                if (btn.button === id) {
                  const btns = btn.items
                  for (let k = 0; k < btns.length; k++) {
                    const ids = btns[k].items
                    for (let l = 0; l < ids.length; l++) {
                      if (html === ids[l].name) {
                        const fullName = ids[l].fullName
                        const description = ids[l].description
                        if (fullName !== undefined) {
                          // console.log('fullName:', fullName)
                          const vw = Math.max(
                            document.documentElement.clientWidth || 0,
                            window.innerWidth || 0
                          )
                          const vh = Math.max(
                            document.documentElement.clientHeight || 0,
                            window.innerHeight || 0
                          )
                          console.log('vw/vh', vw, vh)
                          if (vw >= 500) {
                            const pRect = this.parentNode.getBoundingClientRect()
                            tooltip
                              .style('left', pRect.left - 10 + 'px')
                              .style('top', pRect.top - 100 + 'px')
                            tooltip.html(fullName).style('opacity', 1)
                          }
                        }
                        if (description !== undefined) {
                          dialogtip.style('right', '50px').style('top', '150px')
                          dialogtip.html(description).style('opacity', 1)
                        }
                      }
                    }
                  }
                }
              })
            })
            // catch on mouseout event
            d3.select(N[j]).on('mouseout', function (event) {
              tooltip.style('opacity', 0)
              dialogtip.style('opacity', 0)
            })
            // highlight selected item
            const dispId = d3.select(N[j]).html()
            if (
              (dispId === quotesButton && id === 'MenuQuotes') ||
              (dispId === indicatorsButton && id === 'MenuIndicators') ||
              (dispId === strategiesButton && id === 'MenuStrategies')
            ) {
              d3.select(N[j]).attr('class', menuItemClassHighlight)
            } else {
              d3.select(N[j]).attr('class', menuItemClass)
            }
          }
        })
        break
      default:
        // console.log('button ID', id)
        break
    }
  }
  useEffect(() => {
    console.log('YFD3Button useEffect IN quotesButton', quotesButton)
    /**
     *
     */
    const showCoreData = (indicatorId, name, callback) => {
      console.log('showCoreData, name, quotesButton', name, quotesButton)
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const coredata = d3.select('#yahooFinance').select('#CoreData')
      const today = new Date()
      const year = today.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' })
      const month = today.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: '2-digit',
      })
      const day = today.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' })
      const hour = today.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hourCycle: 'h23',
      })
      const minute = today.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        minute: '2-digit',
      })
      const second = today.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        second: '2-digit',
      })
      let usToday = today.toLocaleString('en-US', { timeZone: 'America/New_York' })
      const dynamicWeekdayValue = 'long'
      const options = {
        timeZone: 'America/New_York',
        weekday: dynamicWeekdayValue as 'long' | 'short' | 'narrow',
      }
      const easternDay = new Date().toLocaleDateString('en-US', options)
      console.log('easternDay', easternDay)
      usToday = ': ' + easternDay + ', ' + usToday + ', est.'
      const spanTag = `<span className="opacity-0 md:opacity-100">US Now ${usToday}</span>`
      if (easternDay === 'Sunday') {
        coredata.html(`<span>US Market is closed on Sunday.</span>${spanTag}`)
        return
      }
      if (easternDay === 'Saturday') {
        coredata.html(`<span>US Market is closed on Saturady.</span>${spanTag}`)
        return
      }
      const [r, v] = isStockHoliday(today)
      if (r) {
        coredata.html(`<span>US Market is closed on ${v}.</span>${spanTag}`)
        return
      }
      const now = Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)
      const preMarketTime = 4 * 60 * 60
      const openTime = 9 * 60 * 60 + 30 * 60 + 0
      const closeTime = 16 * 60 * 60 + 0 * 60 + 0
      if (now < openTime) {
        const d = openTime - now
        const h = Math.floor(d / 3600)
        const m = Math.floor((d - h * 3600) / 60)
        coredata.html(
          `<span>US Market will open in ${h} hours ${m} minutes later.</span>${spanTag}`
        )
        if (now > preMarketTime && quotesButton === '1 D')
          handleButton1D(indicatorsButton, name, callback)
      } else if (now >= openTime && now < closeTime) {
        const d = closeTime - now
        const h = Math.floor(d / 3600)
        const m = Math.floor((d - h * 3600) / 60)
        coredata.html(
          `<span>US Market will close in ${h} hours ${m} minutes later.</span> ${spanTag}`
        )
        if (quotesButton === '1 D') handleButton1D(indicatorsButton, name, callback)
      } else {
        coredata.html(`<span>US Market is closed.</span>${spanTag}`)
      }
    }
    /**
     *
     */
    emitter.on('setTheme', (data) => {
      router.refresh()
    })
    /**
     *
     */
    emitter.on('searchTicker', (data) => {
      console.log('Event "searchTicker" emitted with data:', data)
      nameRef.current = data.ticker[0]
      for (let i = 0; i < nodes.length; i++) {
        const id = d3.select(nodes[i]).attr('id')
        switch (id) {
          case 'button-1D':
          case 'button-5D':
          case 'button-1M':
          case 'button-6M':
          case 'button-YTD':
          case 'button-1Y':
          case 'button-5Y':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'MenuQuotes':
          case 'MenuIndicators':
          case 'MenuStrategies':
            {
              let menuItemsId
              if (id === 'MenuQuotes') {
                menuItemsId = d3.select('body').select('#ItemsQuotes')
              } else if (id === 'MenuIndicators') {
                menuItemsId = d3.select('body').select('#ItemsIndicators')
              } else {
                menuItemsId = d3.select('body').select('#ItemsStrategies')
              }
              const B = menuItemsId.selectAll('button')
              const N = B.nodes()
              for (let j = 0; j < N.length; j++) {
                d3.select(N[j]).attr('data-name', nameRef.current)
              }
            }
            break
          default:
            break
        }
      }
      const min = d3.select('body').select('#MenuItemName')
      // console.log('search min', min.node())
      if (min) {
        const Q = min.select('#Quotes')
        const I = min.select('#Indicators')
        const S = min.select('#Strategies')
        Q.html('1 D')
        setQuotesButton('1 D')
        I.html('VOL')
        setIndicatorsButton('VOL')
        S.html('RSI2')
        setStrategiesButton('RSI2')
      }
      handleButton1D('VOL', data.ticker[0], onButtonClicked)
    })
    /**
     *
     */
    emitter.on('SlideMenuMsg', (data) => {
      console.log('emitter.on SlideMenuMsg', data)
      const min = d3.select('body').select('#MenuItemName')
      switch (data.menu) {
        case 'Quotes':
          {
            const item = data.item
            const Q = min.select('#Quotes')
            Q.html(item.name)
            setQuotesButton(item.name)
            QuotesItems.forEach((Q) => {
              Q.items.forEach((I) => {
                if (I.name == item.name) {
                  if (I.action1) I.action1(indicatorsButton, nameRef.current, onButtonClicked)
                }
              })
            })
            router.refresh()
          }
          break
        case 'Indicators':
          {
            const item = data.item
            const I = min.select('#Indicators')
            const S = min.select('#Strategies')
            I.html(item.name)
            setIndicatorsButton(item.name)
            IndicatorsItems.forEach((I) => {
              I.items.forEach((d) => {
                if (d.name == item.name) {
                  const strategyName = d.strategyName ?? null
                  if (strategyName) {
                    setStrategiesButton(strategyName)
                    if (S !== null) S.html(strategyName)
                  }
                  showMarquee(d.fullName, d.description)
                  if (d.action2) d.action2(d.name, quotesButton, nameRef.current, onButtonClicked)
                }
              })
            })
            router.refresh()
          }

          break
        case 'Strategies':
          break
      }
    })
    if (Date.now() - coreDataRef.current > 2 * 1000) {
      showCoreData(indicatorsButton, nameRef.current, onButtonClicked)
      coreDataRef.current = Date.now()
    }
    const oneMTimeout = () => {
      console.log('oneMTimeout IN')
      const id = setTimeout(function () {
        console.log('TimeOut, quotesButton', quotesButton)
        if (Date.now() - timeoutRef.current > 59 * 1000) {
          showCoreData(indicatorsButton, nameRef.current, onButtonClicked)
          timeoutRef.current = Date.now()
        }
        oneMTimeout()
      }, 60 * 1000) as unknown as number
      timeoutId.id = id
    }
    console.log('timeoutId', timeoutId)
    if (timeoutId.id > 0) clearTimeout(timeoutId.id)
    oneMTimeout()
  }, [nameRef, nodes, onButtonClicked])
  console.log('YFD3Buttons Leave!!')
  return <></>
}
export default YFD3Buttons
