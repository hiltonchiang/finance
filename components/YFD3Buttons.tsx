import * as d3 from 'd3'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getOpenCloseTime, updateButton } from '@/lib/actions'
import { YFProps } from '@/components/YahooFinance'
import { CandlestickChartProps } from '@/components/ApexCharts'
import {
  ChartResultArray,
  ChartResultArrayQuote,
  ChartOptionsWithReturnArray,
} from 'yahoo-finance2/esm/src/modules/chart.js'
import { useEffect } from 'react'
import emitter from '@/components/Emitter'
/**
 *
 */
async function handleButton1D(name, callback) {
  console.log('button1D clicked')
  const today = new Date()
  const [estTime1, estTime2] = await getOpenCloseTime()
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5m',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton5D(name, callback) {
  console.log('button5D clicked')
  const interval = 30 * 60 * 1000
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 4 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '30m',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  if (results !== null) {
    const Quotes: ChartResultArrayQuote[] = [] as ChartResultArrayQuote[]
    let preDate: Date = new Date()
    for (let i = 0; i < results.quotes.length; i++) {
      const Q = results.quotes[i]
      if (i == 0) {
        preDate = Q.date
      }
      if (Q.volume !== 0) {
        Quotes.push(Q)
      }
    }
    console.log('button5D imputioned data', Quotes)
    results.quotes = Quotes
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
/**
 *
 */
async function handleButton1M(name, callback) {
  console.log('button1M clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 30 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
/**
 *
 */
async function handleButton6M(name, callback) {
  console.log('button6M clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 180 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
/**
 *
 */
async function handleButtonYTD(name, callback) {
  console.log('buttonYTD clicked')
  const year = new Date().getFullYear()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(year + '-01-01')
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
/**
 *
 */
async function handleButton1Y(name, callback) {
  console.log('button1Y clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 365 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1wk',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
/**
 *
 */
async function handleButton5Y(name, callback) {
  console.log('button5Y clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 5 * 365 * (24 + 5) * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1mo',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
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
const showCoreData = (name, callback) => {
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
  /**
  const numericDay =
    new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'narrow',
    }).length === 1
      ? new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          weekday: 'narrow',
        })
      : new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            weekday: 'short',
          }).length === 3
        ? [6, 0, 1, 2, 3, 4, 5][
            new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              weekday: 'short',
            })[0]
          ]
        : new Date().getDay()
  console.log('numericDay', numericDay)
  const easternDayNumber =
    new Date(dateString).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
    }) === 'Fri'
      ? 5
      : new Date(dateString).getDay()
  console.log('easternDayNumber', easternDayNumber)
  const easternDayNum = (function () {
    const d = new Date(dateString)
    d.setUTCHours(d.getUTCHours() + 4)
    return d.getDay()
  })()
  console.log('easternDayNum', easternDayNum)
  */
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
    coredata.html(`<span>US Market will open ${h} hours ${m} minutes later.</span><span>US Now ${usToday}</span>`)
    if (now > preMarketTime) handleButton1D(name, callback)
  } else if (now >= openTime && now < closeTime) {
    const d = closeTime - now
    const h = Math.floor(d / 3600)
    const m = Math.floor((d - h * 3600) / 60)
    coredata.html(`<span>US Market will close ${h} hours ${m} minutes later.</span><span>US Now ${usToday}</span>`)
    handleButton1D(name, callback)
  } else {
    coredata.html(`<span>US Market is closed.</span><span>US Now ${usToday}</span>`)
  }
}

/**
 *
 */
interface YFD3ButtonsProps {
  onButtonClicked: (O: CandlestickChartProps) => void
}
/**
 *
 */
const YFD3Buttons: React.FC<YFD3ButtonsProps> = ({ onButtonClicked }) => {
  const [buttonClicked, setButtonClicked] = useState('button-1D')
  const nameRef = useRef<string>('SOXL')
  const router = useRouter()
  const buttons = d3.selectAll('main').selectAll('button')
  const nodes = buttons.nodes()
  const cls =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-black text-xs md:text-base md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700'
  const clsH =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-red-500 text-xs md:text-base underline md:no-underline md:w-full md:bg-pink-500 md:text-white md:hover:bg-pink-700'
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    switch (id) {
      case 'button-1D':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton1D(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1D')
          router.refresh()
          d3.select(this).attr('class', clsH)
        })
        if (buttonClicked === 'button-1D') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-5D':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton5D(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-5D')
          router.refresh()
        })
        if (buttonClicked === 'button-5D') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-1M':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton1M(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1M')
          router.refresh()
        })
        if (buttonClicked === 'button-1M') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-6M':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton6M(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-6M')
          router.refresh()
        })
        if (buttonClicked === 'button-6M') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-YTD':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButtonYTD(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-YTD')
          router.refresh()
        })
        if (buttonClicked === 'button-YTD') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-1Y':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton1Y(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1Y')
          router.refresh()
        })
        if (buttonClicked === 'button-1Y') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-5Y':
        d3.select(nodes[i]).on('click', function (event, d) {
          nameRef.current = d3.select(this).attr('data-name')
          handleButton5Y(nameRef.current, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-5Y')
          router.refresh()
        })
        if (buttonClicked === 'button-5Y') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      default:
        break
    }
  }
  useEffect(() => {
    console.log('YFD3Button b4 emitter.on')
    emitter.on('searchTicker', (data) => {
      console.log('Event "searchTicker" emitted with data:', data)
      nameRef.current = data.ticker[0]
      for (let i = 0; i < nodes.length; i++) {
        const id = d3.select(nodes[i]).attr('id')
        switch (id) {
          case 'button-1D':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-5D':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-1M':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-6M':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-YTD':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-1Y':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          case 'button-5Y':
            d3.select(nodes[i]).attr('data-name', nameRef.current)
            break
          default:
            break
        }
      }
      handleButton1D(data.ticker[0], onButtonClicked)
    })
    showCoreData(nameRef.current, onButtonClicked)
    const oneMTimeout = setInterval(() => {
      console.log('timeout')
      showCoreData(nameRef.current, onButtonClicked)
    }, 60 * 1000)
  }, [nameRef, nodes, onButtonClicked]) // The empty depen
  return <></>
}
export default YFD3Buttons
