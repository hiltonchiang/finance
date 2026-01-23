import clsx from 'clsx'
import dynamic from 'next/dynamic'
import YahooFinance from 'yahoo-finance2'
import SlideMenu from '@/components/SlideMenu'
import CandlestickChart from '@/components/ApexCharts'
import useWindowDimensions from '@/components/WindowDimension'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import {
  ChartResultArrayQuote,
  ChartOptionsWithReturnArray,
} from 'yahoo-finance2/esm/src/modules/chart.js'

import {
  ItemProps,
  ItemsProps,
  StrategiesItems,
  IndicatorsItems,
  QuotesItems,
  menuItemsClsQuotes,
  menuItemsClsIndicators,
  menuItemsClsStrategies,
  menuItemClass,
  menuButtonCls,
} from '@/components/FinanceConstants'

export interface YFProps {
  symbol: string
  options: ChartOptionsWithReturnArray
}
/**
 *
 */
const YF = async ({ symbol, options }: YFProps) => {
  /**
   *
   */
  function QuotesDropDown() {
    const Items = ['1 D', '5 D', '1 M', '6 M', 'YTD', '1 Y', '5 Y']
    return (
      <Menu as="div" className="inline-block">
        <MenuButton id="MenuQuotes" className={menuButtonCls}>
          Quotes
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
        <MenuItems transition className={menuItemsClsQuotes} id="ItemsQuotes" static>
          {QuotesItems.map((E, idx) => (
            <span key={idx}>
              {E.items.map((item) => (
                <MenuItem key={item.name}>
                  <button
                    data-name={symbol}
                    data-fullname={item.fullName}
                    className={menuItemClass}
                  >
                    {item.name}
                  </button>
                </MenuItem>
              ))}
            </span>
          ))}
        </MenuItems>
      </Menu>
    )
  }
  const RangeButtons = () => {
    const clsName =
      'flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700'
    interface ItemProps {
      button: string
      display: string
    }
    const Items: ItemProps[] = [
      { button: 'button-1D', display: '1 D' },
      { button: 'button-5D', display: '5 D' },
      { button: 'button-1M', display: '1 M' },
      { button: 'button-1M', display: '6 M' },
      { button: 'button-YTD', display: 'YTD' },
      { button: 'button-1Y', display: '1 Y' },
      { button: 'button-5Y', display: '5 Y' },
    ]
    return (
      <div className="md:max-w-1xl mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-7">
          {Items.map((item) => (
            <button key={item.button} id={item.button} data-name={symbol} className={clsName}>
              {item.display}
            </button>
          ))}
        </div>
      </div>
    )
  }
  /**
   *
   */
  function StrategiesDropDown() {
    return (
      <Menu as="div" className="inline-block">
        <MenuButton className={menuButtonCls} id="MenuStrategies">
          Strategies
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
        <MenuItems transition className={menuItemsClsStrategies} id="ItemsStrategies" static>
          {StrategiesItems.map((E, idx) => (
            <span key={idx}>
              {E.items.map((item) => (
                <MenuItem key={item.name}>
                  <button
                    data-name={symbol}
                    data-fullname={item.fullName}
                    className={menuItemClass}
                  >
                    {item.name}
                  </button>
                </MenuItem>
              ))}
            </span>
          ))}
        </MenuItems>
      </Menu>
    )
  }
  /**
   *
   */
  function IndicatorsDropDown() {
    return (
      <Menu as="div" className="inline-block">
        <MenuButton className={menuButtonCls} id="MenuIndicators">
          Indicators
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
        <MenuItems transition className={menuItemsClsIndicators} id="ItemsIndicators" static>
          {IndicatorsItems.map((E, idx) => (
            <span key={idx}>
              {E.items.map((item) => (
                <MenuItem key={item.name}>
                  <button
                    data-name={symbol}
                    data-fullname={item.fullName}
                    className={menuItemClass}
                  >
                    {item.name}
                  </button>
                </MenuItem>
              ))}
            </span>
          ))}
        </MenuItems>
      </Menu>
    )
  }
  const IndicatorButtons = () => {
    const clsName =
      'flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700'
    return (
      <div className="md:max-w-1xl mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-5">
          {/*<div className="flex justify-center space-x-4">*/}
          <button id="button-VOL" data-name={symbol} className={clsName}>
            VOL
          </button>
          <button id="button-RSI" data-name={symbol} className={clsName}>
            RSI
          </button>
          <button id="button-ATR" data-name={symbol} className={clsName}>
            ATR
          </button>
          <button id="button-MFI" data-name={symbol} className={clsName}>
            MFI
          </button>
          <button id="button-MACD" data-name={symbol} className={clsName}>
            MACD
          </button>
        </div>
      </div>
    )
  }
  /**
   *
   */
  try {
    const yahooFinance = new YahooFinance()
    // const R = await yahooFinance.search(symbol)
    const Q = await yahooFinance.quote(symbol)
    const results = await yahooFinance.chart(symbol, options)
    const M = results.meta
    const Quotes: ChartResultArrayQuote[] = [] as ChartResultArrayQuote[]
    if (results !== null) {
      for (let j = 0; j < results.quotes.length; j++) {
        if (results.quotes[j].volume !== 0) Quotes.push(results.quotes[j])
        // Quotes.push(results.quotes[j])
      }
      if (Quotes.length === 0) {
        for (let j = 0; j < results.quotes.length; j++) {
          Quotes.push(results.quotes[j])
        }
      }
      results.quotes = Quotes
    }

    //console.log('YahooFinance', symbol, options)
    //console.log('YahooFinance results', symbol, results)
    //console.log('YahooFinance Q', symbol, Q)
    const fiftyTwoWeekDelta =
      M.fiftyTwoWeekHigh !== undefined && M.fiftyTwoWeekLow !== undefined
        ? M.fiftyTwoWeekHigh - M.fiftyTwoWeekLow
        : NaN
    const dayDelta =
      M.regularMarketDayHigh !== undefined && M.regularMarketDayLow !== undefined
        ? M.regularMarketDayHigh - M.regularMarketDayLow
        : NaN
    const fiftyT: number =
      fiftyTwoWeekDelta > 0
        ? M.fiftyTwoWeekLow !== undefined
          ? ((M.regularMarketPrice - M.fiftyTwoWeekLow) / fiftyTwoWeekDelta) * 100
          : NaN
        : NaN
    const fiftyTwoP = isNaN(fiftyT) ? NaN : `${fiftyT.toFixed(0)}%`
    const dayCloseT =
      dayDelta > 0
        ? M.regularMarketDayLow !== undefined
          ? ((M.regularMarketPrice - M.regularMarketDayLow) / dayDelta) * 100
          : NaN
        : NaN
    const dayCloseP = isNaN(dayCloseT) ? NaN : `${dayCloseT.toFixed(0)}%`
    const dayOpenT =
      dayDelta > 0
        ? M.regularMarketDayLow !== undefined
          ? ((Q.regularMarketOpen - M.regularMarketDayLow) / dayDelta) * 100
          : NaN
        : NaN
    const dayOpenP = isNaN(dayOpenT) ? NaN : `${dayOpenT.toFixed(0)}%`
    const openCloseDelta = dayOpenT - dayCloseT
    const openCloseColor = openCloseDelta > 0 ? 'red' : 'green'
    const openCloseT = openCloseDelta > 0 ? openCloseDelta : -openCloseDelta
    const openCloseP = `${openCloseT.toFixed(0)}%`
    const interLeft = openCloseDelta > 0 ? dayCloseP : dayOpenP
    const intraDayDelta = M.regularMarketPrice - Q.regularMarketPreviousClose
    const intraDayP = (intraDayDelta / Q.regularMarketPreviousClose) * 100
    const intraDayDiff =
      intraDayDelta > 0
        ? `+${intraDayDelta.toFixed(2)}/+${intraDayP.toFixed(2)}%`
        : `${intraDayDelta.toFixed(2)}/${intraDayP.toFixed(2)}%`
    const ninetyDAvg =
      Q.averageDailyVolume3Month > 1000000
        ? `${(Q.averageDailyVolume3Month / 1000000).toFixed(2)}M`
        : `${(Q.averageDailyVolume3Month / 1000).toFixed(2)}K`
    const tenDAvg =
      Q.averageDailyVolume10Day > 1000000
        ? `${(Q.averageDailyVolume10Day / 1000000).toFixed(2)}M`
        : `${(Q.averageDailyVolume10Day / 1000).toFixed(2)}K`
    const DVol = M.regularMarketVolume
    const DAvg =
      DVol !== null && DVol !== undefined
        ? DVol > 1000000
          ? `${(DVol / 1000000).toFixed(2)}M`
          : `${(DVol / 1000).toFixed(2)}K`
        : 'NaN'
    const priceUp = intraDayDiff
    console.log('dayOpenP, dayCloseP', dayOpenP, dayCloseP)
    const dayCloseDiv = () => {
      const cPriceLength = M.regularMarketPrice.toFixed(2).length
      const xMove = -1 * (cPriceLength / 2) * 16
      const transX = `translateX(${xMove}px)`
      return (
        <div
          className="absolute translate-y-12 text-xs md:text-base"
          style={{ left: dayCloseP, transform: transX }}
        >
          {M.regularMarketPrice}
        </div>
      )
    }
    return (
      <>
        <CandlestickChart title={symbol} D={results} />
        <div id="yahooFinance" className="space-y-4">
          <div id="MenuItemName" className="grid grid-cols-3 gap-4">
            <span className="text-center text-xs font-bold md:text-base" id="Quotes">
              1 D
            </span>
            <span className="text-center text-xs font-bold md:text-base" id="Indicators">
              VOL
            </span>
            <span className="text-center text-xs font-bold md:text-base" id="Strategies">
              RSI2
            </span>
          </div>
          <div id="MenuItems" className="hidden md:grid md:grid-cols-3 md:gap-4">
            <QuotesDropDown />
            <IndicatorsDropDown />
            <StrategiesDropDown />
          </div>
          <div id="SlideMenuItems" className="grid hidden grid-cols-3 gap-4">
            <SlideMenu />
          </div>
          <div id="CoreData" className="flex items-center justify-between text-sm md:text-base">
            Core Data
          </div>
          {/* Intraday compare*/}
          <div id="quoteCompare" className="relative grid grid-rows-2 gap-1">
            <div className="absolute bottom-0 left-0 -ml-0.5 h-px w-full translate-y-2 transform bg-blue-300" />
            <div className="absolute left-0 top-0 -ml-0.5 h-px w-full -translate-y-1 transform bg-blue-300" />
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">preClose</div>
              <div id="IntraDay" className="text-center text-xs md:text-base">
                IntraDay
              </div>
              <div className="text-right text-xs md:text-base">Quote</div>
            </div>
            <div className="grid grid-cols-3">
              <div id="preClose" className="text-left text-xs md:text-base">
                {Q.regularMarketPreviousClose}
              </div>
              {intraDayDelta > 0 ? (
                <div id="diff" className="text-center text-xs text-green-700 md:text-base">
                  {intraDayDiff}
                </div>
              ) : (
                <div id="diff" className="text-center text-xs text-red-700 md:text-base">
                  {intraDayDiff}
                </div>
              )}
              <div id="quote" className="text-right text-xs md:text-base">
                {M.regularMarketPrice.toFixed(2)}
              </div>
            </div>
          </div>
          {/* VolumeCompare*/}
          <div className="relative grid grid-rows-2 gap-1">
            <div className="absolute bottom-0 left-0 -ml-0.5 h-px w-full translate-y-2 transform bg-blue-300" />
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">90D Avg</div>
              <div className="text-center text-xs md:text-base">10D Avg</div>
              <div className="text-right text-xs md:text-base">Volume</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">{ninetyDAvg}</div>
              <div className="text-center text-xs md:text-base">{tenDAvg}</div>
              <div className="text-right text-xs md:text-base">{DAvg}</div>
            </div>
          </div>
          <div className="relative grid grid-rows-2 gap-6">
            {/* 52Week Range*/}
            <div id="fiftyTwoWeekRange" className="relative grid grid-cols-3">
              <div className="absolute bottom-0 left-0 -ml-0.5 h-1 w-full translate-y-2 transform bg-blue-300" />
              <div className="text-left text-xs md:text-base">{M.fiftyTwoWeekLow}</div>
              <div className="text-center text-xs md:text-base">52WK</div>
              <div className="text-right text-xs md:text-base">{M.fiftyTwoWeekHigh}</div>
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-red-500 md:size-4 md:translate-y-5"
                style={{ left: fiftyTwoP }}
              />
            </div>
            {/* Day Range*/}
            <div id="dayRange" className="relative grid grid-cols-3">
              <div className="absolute bottom-0 left-0 -ml-0.5 h-1 w-full translate-y-2 transform bg-blue-300" />
              <div
                className="absolute bottom-0 -ml-0.5 h-1 translate-y-2 transform"
                style={{ left: interLeft, backgroundColor: openCloseColor, width: openCloseP }}
              />
              <div className="text-left text-xs md:text-base">
                {M.regularMarketDayLow?.toFixed(2)}
              </div>
              <div className="text-center text-xs md:text-base">InterDay</div>
              <div className="text-right text-xs md:text-base">
                {M.regularMarketDayHigh?.toFixed(2)}
              </div>
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-red-500 md:size-4 md:translate-y-6"
                style={{ left: dayCloseP }}
              />
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-green-500 md:size-4 md:translate-y-6"
                style={{ left: dayOpenP }}
              />
              <div
                className="absolute translate-y-8 text-xs md:translate-y-12 md:text-base"
                style={{ left: dayCloseP }}
              >
                {M.regularMarketPrice}
              </div>
              <div
                className="absolute translate-y-8 text-xs md:translate-y-12 md:text-base"
                style={{ left: dayOpenP }}
              >
                {Q.regularMarketOpen}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return <></>
  }
}

export default YF
