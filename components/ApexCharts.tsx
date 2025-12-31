'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { ApexOptions } from 'apexcharts'
import YahooFinance from 'yahoo-finance2'
import emitter from '@/components/Emitter'
import React, { useState, useEffect } from 'react'
import useWindowDimensions from '@/components/WindowDimension'
import { ChartResultArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import { ButtonClickedProps } from '@/components/YFD3Buttons'
import Spinner from '@/components/Spinner'
import {
  RSIConfig,
  rsi,
  ATRConfig,
  ATRResult,
  atr,
  MFIConfig,
  mfi,
  MACDConfig,
  MACDResult,
  macd,
} from 'indicatorts'
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})
const YFD3Buttons = dynamic(() => import('@/components/YFD3Buttons'), {
  ssr: false,
})
// Define the type for a single data point (OHLC: Open, High, Low, Close)
interface LineTotalPoint {
  x: Date
  y: number | null
  v: number | null
  rsi: number | null
  atr: number | null
  mfi: number | null
  macd: number | null
}
// Define the type for the series data array
export interface CandlestickChartProps {
  title: string
  D: ChartResultArray
}
/**
 *
 */
const getTotalData = (D: ChartResultArray): LineTotalPoint[] => {
  const lineTotalData: LineTotalPoint[] = [] as LineTotalPoint[]
  const xA: Date[] = [] as Date[]
  const openA: number[] = [] as number[]
  const closeA: number[] = [] as number[]
  const highA: number[] = [] as number[]
  const lowA: number[] = [] as number[]
  const volumeA: number[] = [] as number[]
  for (let i = 0; i < D.quotes.length; i++) {
    const Q = D.quotes[i]
    const X = new Date(Q.date.getTime() - 13 * 60 * 60 * 1000) // US ET
    const open = Q && Q.open ? Math.round(Q.open * 100) / 100 : null
    const high = Q && Q.high ? Math.round(Q.high * 100) / 100 : null
    const low = Q && Q.low ? Math.round(Q.low * 100) / 100 : null
    const close = Q && Q.close ? Math.round(Q.close * 100) / 100 : null
    const volume = Q && Q.volume ? Math.round(Q.volume * 100) / 100 : null
    xA.push(X)
    openA.push(open!)
    closeA.push(close!)
    highA.push(high!)
    lowA.push(low!)
    volumeA.push(volume!)
  }
  const rsiConf: RSIConfig = { period: 5 }
  const rsiArray = rsi(closeA, rsiConf)
  for (let i = 0; i < rsiConf.period! - 1; i++) {
    rsiArray[i] = rsiArray[rsiConf.period! - 1]
  }
  const atrConf: ATRConfig = { period: 14 }
  const atrResult: ATRResult = atr(highA, lowA, closeA, atrConf)
  // console.log('atr', atrResult.trLine, atrResult.atrLine)
  const mfiConf: MFIConfig = { period: 14 }
  const mfiArray = mfi(highA, lowA, closeA, volumeA, mfiConf)
  const macdConf: MACDConfig = { fast: 12, slow: 26, signal: 9 }
  const macdResult: MACDResult = macd(closeA, macdConf)
  for (let i = 0; i < D.quotes.length; i++) {
    let rsi = lowA[i] + (highA[i] - lowA[i]) * (rsiArray[i] / 100) * 0.1
    // rsi = Math.round(rsi * 100) / 100
    rsi = Math.round(rsiArray[i] * 100) / 100
    lineTotalData.push({
      x: xA[i],
      y: closeA[i],
      v: volumeA[i],
      rsi: rsi,
      atr: atrResult.atrLine[i],
      mfi: mfiArray[i],
      macd: macdResult.macdLine[i],
    })
  }
  return lineTotalData
}
/**
 *
 */
const CandlestickChart: React.FC<CandlestickChartProps> = ({ title, D }) => {
  const { height, width } = useWindowDimensions()
  const breakpoint = 768 // Example breakpoint for mobile/desktop
  const isMobile = width && width <= breakpoint ? true : false
  const [buttonClicked, setButtonClicked] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const lineTotalData: LineTotalPoint[] = getTotalData(D)
  /**
   *
   */
  const yAxis1 = {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: '#008FFB',
    },
    labels: {
      style: {
        colors: '#008FFB',
      },
      formatter: function (val) {
        if (val) {
          return val.toFixed(2)
        }
        return ''
      },
    },
    title: {
      text: 'Price ($)',
      style: {
        color: '#008FFB',
      },
    },
    tooltip: {
      enabled: true,
    },
  }
  /**
   *
   */
  const yAxis2 = {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: '#00E396',
    },
    labels: {
      style: {
        colors: '#00E396',
      },
      formatter: function (val) {
        if (val) {
          let v = val / 1000000
          if (v < 0.001) v = val / 1000
          return v.toFixed(2)
        }
        return ''
      },
    },
    title: {
      text: 'Volume (M)',
      style: {
        color: '#00E396',
      },
    },
    opposite: true, // Place this Y-axis on the right side
  }
  /**
   *
   */
  const yAxis3 = {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: '#00E396',
    },
    labels: {
      style: {
        colors: '#00E396',
      },
      formatter: function (val) {
        if (val) {
          return val.toFixed(2)
        }
        return ''
      },
    },
    title: {
      text: 'Indicator',
      style: {
        color: '#00E396',
      },
    },
    opposite: true, // Place this Y-axis on the right side
  }
  /**
   *
   */
  const seriesLine = {
    name: 'Stock Price',
    type: 'line',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.y })),
    color: '#008FFB',
  }
  /**
   *
   */
  const seriesLine2 = {
    name: 'Stock Price',
    type: 'line',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.y })),
    color: '#A2E635',
  }
  /**
   *
   */
  const seriesColumn = {
    name: 'Volume',
    type: 'column',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.v })),
    color: '#00E396',
  }
  /**
   * setup ApexOptions
   */
  const [Options, setOptions] = useState<ApexOptions>({
    chart: {
      height: 'auto',
      type: 'line', // Default type, can be overridden in series
      stacked: false,
      background: resolvedTheme === 'dark' ? '#121212' : '#F8F8F8',
    },
    theme: {
      mode: resolvedTheme === 'dark' ? 'dark' : 'light',
    },
    stroke: {
      lineCap: 'round',
      curve: ['smooth', 'monotoneCubic'],
      width: [2, 2, 2], // Line width for price series, 0 for volume series
    },
    title: {
      text: title,
      align: 'left',
    },
    subtitle: {
      text: D.meta.longName,
      align: 'center',
    },
    xaxis: {
      type: 'datetime', // X-axis is time-series
      labels: {
        datetimeUTC: false, // Set to false to use local time zone
      },
    },
    series: [seriesLine, seriesColumn],
    yaxis: [yAxis1, yAxis2],
    tooltip: {
      theme: resolvedTheme,
      fillSeriesColor: true,
      fixed: {
        enabled: true,
        position: 'topLeft', // or 'topRight', 'bottomLeft', 'bottomRight'
        offsetY: 30,
        offsetX: 60,
      },
      y: {
        formatter: function (val, opts) {
          if (opts.seriesIndex === 0) {
            return '$' + val?.toFixed(2)
          } else {
            return val?.toFixed(0)
          }
        },
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
    responsive: [
      {
        breakpoint: 768, // Adjust options when screen width is 480px or less
        options: {
          chart: {
            height: 300, // New height for mobile devices
            width: '100%', // Ensure it takes the full width of its container
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          tooltip: {
            enabled: false,
          },
          series: [
            {
              name: '',
            },
            {
              name: '',
            },
          ],
          subtitle: {
            text: undefined,
          },
          yaxis: [
            {
              title: {
                text: undefined,
              },
              labels: {
                show: false,
              },
            },
            {
              title: {
                text: undefined,
              },
              labels: {
                show: false,
              },
            },
          ],
          dataLabels: {
            enabled: false, // Hide data labels (names/values)
          },
          markers: {
            size: 0, // Hide markers (dots)
          },
          legend: {
            show: false,
            formatter: function (seriesName, opts) {
              if (seriesName === 'Stock Price' || seriesName === 'Volume') {
                return null
              }
              return seriesName
            },
          },
        },
      },
    ],
  })
  /**
   *
   */
  function handleButtonClicked(B: ButtonClickedProps) {
    console.log('ApxCharters handleButtonClicked', B.id)
    // CandlestickChart(O.title, O.D)
    const O: CandlestickChartProps = B.result
    const lineTotalData: LineTotalPoint[] = getTotalData(O.D)
    interface LVProps {
      x: Date
      y: number | null
    }
    const D1: LVProps[] = [] as LVProps[]
    const D2: LVProps[] = [] as LVProps[]
    const D3: LVProps[] = [] as LVProps[]
    for (let i = 0; i < lineTotalData.length; i++) {
      const L = lineTotalData[i]
      D1.push({ x: L.x, y: L.y })
      D2.push({ x: L.x, y: L.v })
    }
    switch (B.id) {
      case 'button-VOL':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D2.push({ x: L.x, y: L.v })
        }
        seriesLine.data = D1
        seriesColumn.data = D2
        setOptions({
          ...Options, // Spread existing options to preserve other settings
          series: [seriesLine, seriesColumn],
          yaxis: [yAxis1, yAxis2],
          title: {
            ...Options.title, // Spread existing title options if any
            text: O.title,
          },
          subtitle: {
            ...Options.subtitle, // Spread existing subtitle options if any
            text: O.D.meta.longName,
          },
        })
        break
      case 'button-RSI':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.rsi })
        }
        yAxis3.title.text = 'RSI'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'RSI'
        seriesLine2.color = '#A2E635'
        setOptions({
          ...Options, // Spread existing options to preserve other settings
          series: [seriesLine, seriesLine2],
          yaxis: [yAxis1, yAxis3],
          title: {
            ...Options.title, // Spread existing title options if any
            text: O.title,
          },
          subtitle: {
            ...Options.subtitle, // Spread existing subtitle options if any
            text: O.D.meta.longName,
          },
        })
        break
      case 'button-ATR':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.atr })
        }
        yAxis3.title.text = 'ATR'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'ATR'
        seriesLine2.color = '#FACC15'
        setOptions({
          ...Options, // Spread existing options to preserve other settings
          series: [seriesLine, seriesLine2],
          yaxis: [yAxis1, yAxis3],
          title: {
            ...Options.title, // Spread existing title options if any
            text: O.title,
          },
          subtitle: {
            ...Options.subtitle, // Spread existing subtitle options if any
            text: O.D.meta.longName,
          },
        })
        break
      case 'button-MFI':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.mfi })
        }
        yAxis3.title.text = 'MFI'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'MFI'
        seriesLine2.color = '#E11D48'
        setOptions({
          ...Options, // Spread existing options to preserve other settings
          series: [seriesLine, seriesLine2],
          yaxis: [yAxis1, yAxis3],
          title: {
            ...Options.title, // Spread existing title options if any
            text: O.title,
          },
          subtitle: {
            ...Options.subtitle, // Spread existing subtitle options if any
            text: O.D.meta.longName,
          },
        })
        break
      case 'button-MACD':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.macd })
        }
        yAxis3.title.text = 'MACD'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'MACD'
        seriesLine2.color = '#5EEAD4'
        setOptions({
          ...Options, // Spread existing options to preserve other settings
          series: [seriesLine, seriesLine2],
          yaxis: [yAxis1, yAxis3],
          title: {
            ...Options.title, // Spread existing title options if any
            text: O.title,
          },
          subtitle: {
            ...Options.subtitle, // Spread existing subtitle options if any
            text: O.D.meta.longName,
          },
        })
        break
      default:
        break
    }
  }
  useEffect(() => {
    //await emission of ThemeSwitch
    emitter.on('setTheme', (data) => {
      console.log('ApexCharts: Event "setTheme" ', data)
      setOptions({
        ...Options, // Spread existing options to preserve other settings
        chart: {
          ...Options,
          background: data.theme === 'light' ? '#F8F8F8' : '#121212',
        },
        theme: {
          mode: data.theme === 'light' ? 'light' : 'dark',
        },
      })
    })
  }, [Options])
  /**
   *
   */
  function LoadingSpinner() {
    return (
      <div id="loadingSpinner" className="absolute left-1/2 top-1/2 hidden">
        <Spinner size="lg" color="border-indigo-600" />
      </div>
    )
  }
  /**
   *
   */
  return (
    <div id="chart" className="relative">
      <div className="relative">
        <ReactApexChart options={Options} series={Options.series} type="line" />
        <LoadingSpinner />
      </div>
      <YFD3Buttons onButtonClicked={handleButtonClicked} />
    </div>
  )
}

export default CandlestickChart
