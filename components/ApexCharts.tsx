'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { ApexOptions } from 'apexcharts'
import YahooFinance from 'yahoo-finance2'
import emitter from '@/components/Emitter'
import React, { useState, useEffect, useRef } from 'react'
import useWindowDimensions from '@/components/WindowDimension'
import { ChartResultArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import { ButtonClickedProps } from '@/components/YFD3Buttons'
import Spinner from '@/components/Spinner'
import {
  Action,
  Asset,
  AOConfig,
  ao,
  aoStrategy,
  CMOConfig,
  CMOResult,
  cmo,
  IchimokuCloudConfig,
  IchimokuCloudResult,
  ichimokuCloud,
  ichimokuCloudStrategy,
  PPOConfig,
  PPOResult,
  ppo,
  PVOConfig,
  PVOResult,
  pvo,
  ROCConfig,
  roc,
  RSIConfig,
  rsi,
  rsi2Strategy,
  ATRConfig,
  ATRResult,
  atr,
  MFIConfig,
  mfi,
  MACDConfig,
  MACDResult,
  macd,
} from 'indicatorts'

import {
  AnnotationLabel,
  ApexAxisChartSeries,
  ApexYAxis,
  PointAnnotations,
  PointAnnotationsMarker,
  XAxisAnnotations,
} from '@/components/FinanceConstants'
/**
 *
 */
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
  action?: Action
  ao?: number
  cmo?: { adResult: number; cmoResult: number }
  ichimoku?: { tenkan: number; kijun: number; ssa: number; ssb: number; laggingSpan: number }
  ppo?: { ppoResult: number; signal: number; histogram: number }
  pvo?: { pvoResult: number; signal: number; histogram: number }
  roc?: number
  rsi?: number
  atr?: { trLine: number; atrLine: number }
  mfi?: number
  macd?: number
}
// Define the type for the series data array
export interface CandlestickChartProps {
  title: string
  D: ChartResultArray
}
/**
 *
 */
const getTotalData = (D: ChartResultArray, id?: string): LineTotalPoint[] => {
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
  const buttonId = id ?? null
  console.log('getTotalData id', buttonId)
  const maxClose = Math.max(...closeA)
  const minClose = Math.min(...closeA)
  switch (id) {
    case 'VOL':
      for (let i = 0; i < D.quotes.length; i++) {
        lineTotalData.push({
          x: xA[i],
          y: closeA[i],
          v: volumeA[i],
        })
      }
      // console.log('getTotalData VOL lineTotalData', lineTotalData)
      break
    case 'AO':
      {
        // AwesomeOscillator
        console.log('getTotalData, AO')
        const aoConfig: AOConfig = { fast: 5, slow: 34 }
        const aoAsset: Asset = {
          dates: xA,
          openings: openA,
          closings: closeA,
          highs: highA,
          lows: lowA,
          volumes: volumeA,
        }
        const aoArray: number[] = ao(highA, lowA, aoConfig)
        const actionArray: Action[] = aoStrategy(aoAsset, aoConfig)
        console.log('AO actionArray', actionArray)
        const maxAo = Math.max(...aoArray)
        const minAo = Math.min(...aoArray)
        const scale = (maxClose - minClose) / (maxAo - minAo)
        const beta = 0.67
        const newAo = []
        for (let i = 0; i < D.quotes.length; i++) {
          // const newAo = aoArray[i] * scale * beta
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            ao: aoArray[i],
            action: actionArray[i],
          })
        }
      }
      break
    case 'CMO':
      {
        // Chaikin Oscillator
        const cmoConfig: CMOConfig = { fast: 3, slow: 10 }
        const cmoResult: CMOResult = cmo(highA, lowA, closeA, volumeA, cmoConfig)
        const maxAd = Math.max(...cmoResult.adResult)
        const minAd = Math.min(...cmoResult.adResult)
        const maxCmo = Math.max(...cmoResult.cmoResult)
        const minCmo = Math.min(...cmoResult.cmoResult)
        const scaleAd = (maxClose - minClose) / (maxAd - minAd)
        const scaleCmo = (maxClose - minClose) / (maxCmo - minCmo)
        const beta = 0.67
        // console.log('getTotalData CMO cmoResult', cmoResult)
        for (let i = 0; i < D.quotes.length; i++) {
          const newAd = cmoResult.adResult[i] // * scaleAd * beta
          const newCmo = cmoResult.cmoResult[i] // * scaleCmo * beta
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            cmo: { adResult: newAd, cmoResult: newCmo },
          })
        }
        // console.log('getTotalData cmo', lineTotalData)
      }
      break
    case 'Ichimoku':
      {
        const ichimokuConfig: IchimokuCloudConfig = { short: 9, medium: 26, long: 52, close: 26 }
        const ichimokuCloudResult = ichimokuCloud(highA, lowA, closeA, ichimokuConfig)
        const ichimokuAsset: Asset = {
          dates: xA,
          openings: openA,
          closings: closeA,
          highs: highA,
          lows: lowA,
          volumes: volumeA,
        }
        const actionArray = ichimokuCloudStrategy(ichimokuAsset, ichimokuConfig)
        for (let i = 0; i < D.quotes.length; i++) {
          const tenkan = ichimokuCloudResult.tenkan[i]
          const kijun = ichimokuCloudResult.kijun[i]
          const ssa = ichimokuCloudResult.ssa[i]
          const ssb = ichimokuCloudResult.ssb[i]
          const laggingSpan = ichimokuCloudResult.laggingSpan[i]
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            ichimoku: {
              tenkan: tenkan,
              kijun: kijun,
              ssa: ssa,
              ssb: ssb,
              laggingSpan: laggingSpan,
            },
            action: actionArray[i],
          })
          // console.log('getTotalData Ichimoku lineTotalData', lineTotalData)
        }
      }
      break
    case 'PPO':
      {
        const ppoConfig: PPOConfig = { fast: 12, slow: 26, signal: 9 }
        const ppoResult: PPOResult = ppo(closeA, ppoConfig)
        for (let i = 0; i < D.quotes.length; i++) {
          const result = ppoResult.ppoResult[i]
          const signal = ppoResult.signal[i]
          const histogram = ppoResult.histogram[i]
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            ppo: { ppoResult: result, signal: signal, histogram: histogram },
          })
        }
      }
      break
    case 'PVO':
      {
        const pvoConfig: PVOConfig = { fast: 12, slow: 26, signal: 9 }
        const pvoResult: PVOResult = pvo(volumeA, pvoConfig)
        for (let i = 0; i < D.quotes.length; i++) {
          const result = pvoResult.pvoResult[i]
          const signal = pvoResult.signal[i]
          const histogram = pvoResult.histogram[i]
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            pvo: { pvoResult: result, signal: signal, histogram: histogram },
          })
        }
      }
      break
    case 'ROC':
      {
        const rocConfig: ROCConfig = { period: 3 }
        const rocResult: number[] = roc(closeA, rocConfig)
        for (let i = 0; i < D.quotes.length; i++) {
          const result = rocResult[i]
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            roc: result,
          })
        }
        console.log('ROC lineTotalData', lineTotalData)
      }
      break
    case 'button-RSI':
    case 'RSI':
      {
        const rsiConf: RSIConfig = { period: 2 }
        const rsiAsset: Asset = {
          dates: xA,
          openings: openA,
          closings: closeA,
          highs: highA,
          lows: lowA,
          volumes: volumeA,
        }
        const rsiArray = rsi(closeA, rsiConf)
        const actionArray = rsi2Strategy(rsiAsset)
        for (let i = 0; i < rsiConf.period! - 1; i++) {
          rsiArray[i] = rsiArray[rsiConf.period! - 1]
        }
        for (let i = 0; i < D.quotes.length; i++) {
          let rsi = lowA[i] + (highA[i] - lowA[i]) * (rsiArray[i] / 100) * 0.1
          rsi = Math.round(rsiArray[i] * 100) / 100
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            rsi: rsi,
            action: actionArray[i],
          })
        }
      }
      break
    case 'button-ATR':
    case 'ATR':
      {
        const atrConf: ATRConfig = { period: 14 }
        const atrResult: ATRResult = atr(highA, lowA, closeA, atrConf)
        for (let i = 0; i < D.quotes.length; i++) {
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            atr: { trLine: atrResult.trLine[i], atrLine: atrResult.atrLine[i] },
          })
        }
      }
      break
    case 'button-MFI':
    case 'MFI':
      {
        const mfiConf: MFIConfig = { period: 14 }
        const mfiArray = mfi(highA, lowA, closeA, volumeA, mfiConf)
        for (let i = 0; i < D.quotes.length; i++) {
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            mfi: mfiArray[i],
          })
        }
      }
      break
    case 'button-MACD':
    case 'MACD':
      {
        const macdConf: MACDConfig = { fast: 12, slow: 26, signal: 9 }
        const macdResult: MACDResult = macd(closeA, macdConf)
        for (let i = 0; i < D.quotes.length; i++) {
          lineTotalData.push({
            x: xA[i],
            y: closeA[i],
            v: volumeA[i],
            macd: macdResult.macdLine[i],
          })
        }
      }
      break
    default:
      break
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
  const chartRef = useRef(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const lineTotalData: LineTotalPoint[] = getTotalData(D, 'VOL')
  // console.log('CandlestickChart IN lineTotalData', lineTotalData)
  /**
   *
   */
  const yAxis1: ApexYAxis = {
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
  const yAxis2: ApexYAxis = {
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
  const yAxis3: ApexYAxis = {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: '#A2E635',
    },
    labels: {
      style: {
        colors: '#A2E635',
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
        color: '#A2E635',
      },
    },
    opposite: true, // Place this Y-axis on the right side
  }
  /**
   *
   */
  const seriesLine: ApexAxisChartSeries = {
    name: 'Stock Price',
    type: 'line',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.y })),
    color: '#008FFB',
  }
  /**
   *
   */
  const seriesLine2: ApexAxisChartSeries = {
    name: 'Stock Price',
    type: 'line',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.y })),
    color: '#A2E635',
  }
  /**
   *
   */
  const seriesColumn: ApexAxisChartSeries = {
    name: 'Volume',
    type: 'column',
    data: lineTotalData.map((item) => ({ x: item.x, y: item.v })),
    color: '#00E396',
  }
  /**
   * setup ApexOptions
   */
  const [Options, setOptions] = useState<ApexOptions>({
    annotations: undefined,
    chart: {
      height: 'auto',
      type: 'line', // Default type, can be overridden in series
      stacked: false,
      background: resolvedTheme === 'dark' ? '#121212' : '#F8F8F8',
      events: {
        mounted: (chartContext) => {
          console.log('Chart Mounted, context', chartContext)
          // Capture the context on mount
          chartRef.current = chartContext
        },
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150, // Delay between data points animating
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    theme: {
      mode: resolvedTheme === 'dark' ? 'dark' : 'light',
    },
    stroke: {
      lineCap: 'round',
      curve: ['smooth', 'monotoneCubic', 'monotoneCubic'],
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
  interface optionsArrayProps {
    type:
      | 'line'
      | 'area'
      | 'bar'
      | 'pie'
      | 'donut'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'boxPlot'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
      | 'rangeArea'
      | 'treemap'
    options: ApexOptions
  }
  const [optionsArray, setOptionsArray] = useState<optionsArrayProps[]>([
    {
      type: 'line',
      options: Options,
    },
  ])
  /**
   *
   */
  function handleButtonClicked(B: ButtonClickedProps) {
    console.log('ApxCharters handleButtonClicked', B.id)
    // CandlestickChart(O.title, O.D)
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const O: CandlestickChartProps = B.result
    const lineTotalData: LineTotalPoint[] = getTotalData(O.D, B.id)
    interface LVProps {
      x: Date
      y: number | null
    }
    interface DAProps {
      x: Date
      y: number | null
      type: number | null
    }
    const DA: DAProps[] = [] as DAProps[]
    const D1: LVProps[] = [] as LVProps[]
    const D2: LVProps[] = [] as LVProps[]
    const D3: LVProps[] = [] as LVProps[]
    const D4: LVProps[] = [] as LVProps[]
    const D5: LVProps[] = [] as LVProps[]
    for (let i = 0; i < lineTotalData.length; i++) {
      const L = lineTotalData[i]
      D1.push({ x: L.x, y: L.y })
      D2.push({ x: L.x, y: L.v })
    }
    // const extraD: (number | null)[] = [] as (number | null)[]
    switch (B.id) {
      case 'button-VOL':
      case 'VOL':
        // for (let i = 0; i < lineTotalData.length; i++) {
        //  const L = lineTotalData[i]
        //  D2.push({ x: L.x, y: L.v })
        //}
        seriesLine.data = D1
        seriesColumn.data = D2
        setOptionsArray([
          {
            type: 'line',
            options: {
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
            },
          },
        ])
        break
      case 'AO':
        {
          console.log('ApxCharts AO')
          let first = false
          let prev: number | null = null
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const Y = lineTotalData[i].ao ?? null
            D3.push({ x: L.x, y: Y })
            const A = lineTotalData[i].action ?? null
            if (first === false) {
              if (A !== 0) {
                first = true
                prev = A
                DA.push({ x: L.x, y: Y, type: A })
              }
            } else {
              if (A !== 0 && A !== prev) {
                prev = A
                DA.push({ x: L.x, y: Y, type: A })
              }
            }
          }
          console.log('AO DA', DA)
          let yAvg = 0
          if (DA.length > 0) {
            for (let i = 0; i < DA.length; i++) {
              const D = DA[i]
              if (D !== null && D.y !== null) yAvg += D.y
            }
            yAvg = yAvg / DA.length
          }
          console.log('AO DA, yAvg', yAvg)
          if (yAxis3.title) yAxis3.title.text = 'AwesomeOsc'
          seriesLine.data = D1
          seriesLine2.data = DA.map((d) => ({ x: d.x, y: d.type }))
          seriesLine2.name = 'AwesomeOsc'
          seriesLine2.color = '#A2E635'
          const yAxisAO = yAxis1
          const yAxisAction = yAxis3
          if (yAxisAO.title) yAxisAO.title.text = 'AO'
          if (yAxisAction.title) yAxisAction.title.text = 'Action'
          interface pMarkerProps {
            size: number
            fillColor: string
            strokeColor: string
            radius: number
            cssClass?: string
          }
          interface pointsProps {
            x: number
            y: number | null
            marker: pMarkerProps
          }
          const pointsA: pointsProps[] = [] as pointsProps[]
          for (let i = 0; i < DA.length; i++) {
            const pMarker: pMarkerProps = {
              size: isMobile ? 2 : 8,
              fillColor: DA[i].type === 1 ? '#C026D3' : '#2563EB',
              strokeColor: 'red',
              radius: isMobile ? 1 : 2,
            }
            pointsA.push({
              x: DA[i].x.getTime(),
              y: DA[i].y,
              marker: pMarker,
            })
          }
          setOptionsArray([
            {
              type: 'line',
              options: {
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
                stroke: {
                  lineCap: 'round',
                  curve: ['monotoneCubic', 'stepline'],
                  width: [2, 3], // Line width for price series, 0 for volume series
                },
              },
            },
            {
              type: 'line',
              options: {
                ...Options,
                series: [
                  {
                    name: 'Quotes',
                    type: 'line',
                    data: D3,
                    color: '#EAB308',
                  },
                ],
                yaxis: [yAxisAO],
                title: {
                  ...Options.title, // Spread existing title options if any
                  text: O.title,
                },
                subtitle: {
                  ...Options.subtitle, // Spread existing subtitle options if any
                  text: O.D.meta.longName,
                },
                plotOptions: {
                  line: {
                    colors: {
                      threshold: yAvg,
                      colorAboveThreshold: '#DC2626',
                      colorBelowThreshold: '#A2E635',
                    },
                  },
                },
                annotations: {
                  points: pointsA.map((item) => ({ x: item.x, y: item.y, marker: item.marker })),
                },
              },
            },
          ])
        }
        break
      case 'CMO':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          const cmo = lineTotalData[i].cmo ?? null
          D3.push({ x: L.x, y: cmo ? cmo.cmoResult : null })
        }
        if (yAxis3.title) yAxis3.title.text = 'ChaikinOsc'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'ChaikinOsc'
        seriesLine2.color = '#A2E635'
        setOptionsArray([
          {
            type: 'line',
            options: {
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
            },
          },
        ])
        break
      case 'Ichimoku':
        {
          console.log('ApxCharts Ichimoku')
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const ichimoku = lineTotalData[i].ichimoku ?? null
            D3.push({ x: L.x, y: ichimoku ? ichimoku.tenkan : null })
            D4.push({ x: L.x, y: ichimoku ? ichimoku.kijun : null })
          }
          yAxis3.seriesName = 'tenkan'
          if (yAxis3.title) yAxis3.title.text = 'tenkan'
          seriesLine.data = D1
          seriesLine2.data = D3
          seriesLine2.name = 'tenkan'
          seriesLine2.color = '#A2E635'
          const series3: ApexAxisChartSeries = {
            name: 'kijun',
            type: 'line',
            color: '#DC2626',
            hidden: false,
            data: D4.map((d) => ({ x: d.x, y: d.y, strokeColor: '#BEF264' })),
          }
          const yAxis4: ApexYAxis = {
            ...yAxis3,
            title: {
              text: 'kijun',
            },
          }
          // if (yAxis4.title) yAxis4.title.text = 'kijun'
          setOptionsArray([
            {
              type: 'line',
              options: {
                ...Options, // Spread existing options to preserve other settings
                series: [seriesLine, series3, seriesLine2],
                yaxis: [yAxis1, yAxis4, yAxis3],
                title: {
                  ...Options.title, // Spread existing title options if any
                  text: O.title,
                },
                subtitle: {
                  ...Options.subtitle, // Spread existing subtitle options if any
                  text: O.D.meta.longName,
                },
              },
            },
          ])
        }
        break
      case 'PPO':
        {
          console.log('ApxCharts PPO')
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const ppo = lineTotalData[i].ppo ?? null
            D3.push({ x: L.x, y: ppo ? ppo.ppoResult : null })
            D4.push({ x: L.x, y: ppo ? ppo.signal : null })
            D5.push({ x: L.x, y: ppo ? ppo.histogram : null })
          }
          if (yAxis3.title) yAxis3.title.text = 'PPO'
          seriesLine.data = D1
          seriesLine2.data = D3
          seriesLine2.name = 'PPO'
          seriesLine2.color = '#A2E635'
          const yAxisSignal: ApexYAxis = {
            ...yAxis1,
            title: {
              text: 'Signal',
            },
          }
          const yAxisHistogram: ApexYAxis = {
            ...yAxis3,
            title: {
              text: 'Histogram',
            },
          }
          //if (yAxisSignal.title) yAxisSignal.title.text = 'Signal'
          //if (yAxisHistogram.title) yAxisHistogram.title.text = 'Histogram'
          setOptionsArray([
            {
              type: 'line',
              options: {
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
              },
            },
            {
              type: 'area',
              options: {
                ...Options,
                chart: {
                  type: 'area',
                },
                dataLabels: {
                  enabled: false,
                },
                series: [
                  {
                    name: 'PPO Signal',
                    type: 'area',
                    data: D4.map((d) => d.y),
                    color: '#EAB308',
                  },
                  {
                    name: 'PPO Histogram',
                    type: 'area',
                    data: D5.map((d) => d.y),
                    color: '#C026D3',
                  },
                ],
                yaxis: [yAxisSignal, yAxisHistogram],
                xaxis: {
                  type: 'datetime',
                  labels: {
                    datetimeUTC: false, // Set to false to use local time zone
                  },
                  categories: D1.map((t) => t.x.toISOString()),
                },
                stroke: {
                  curve: 'smooth',
                },
                title: {
                  ...Options.title, // Spread existing title options if any
                  text: O.title,
                },
                subtitle: {
                  ...Options.subtitle, // Spread existing subtitle options if any
                  text: O.D.meta.longName,
                },
              },
            },
          ])
        }
        break
      case 'PVO':
        {
          console.log('ApxCharts PVO')
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const pvo = lineTotalData[i].pvo ?? null
            D3.push({ x: L.x, y: pvo ? pvo.pvoResult : null })
            D4.push({ x: L.x, y: pvo ? pvo.signal : null })
            D5.push({ x: L.x, y: pvo ? pvo.histogram : null })
          }
          if (yAxis3.title) yAxis3.title.text = 'PVO'
          seriesLine.data = D1
          seriesLine2.data = D3
          seriesLine2.name = 'PVO'
          seriesLine2.color = '#A2E635'
          // const yAxisSignal = yAxis1
          // const yAxisHistogram = yAxis3
          // if (yAxisSignal.title) yAxisSignal.title.text = 'Signal'
          // if (yAxisHistogram.title) yAxisHistogram.title.text = 'Histogram'
          const yAxisSignal: ApexYAxis = {
            ...yAxis1,
            title: {
              text: 'Signal',
            },
          }
          const yAxisHistogram: ApexYAxis = {
            ...yAxis3,
            title: {
              text: 'Histogram',
            },
          }
          setOptionsArray([
            {
              type: 'line',
              options: {
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
              },
            },
            {
              type: 'area',
              options: {
                ...Options,
                chart: {
                  type: 'area',
                },
                dataLabels: {
                  enabled: false,
                },
                series: [
                  {
                    name: 'PVO Signal',
                    type: 'area',
                    data: D4.map((d) => d.y),
                    color: '#EAB308',
                  },
                  {
                    name: 'PVO Histogram',
                    type: 'area',
                    data: D5.map((d) => d.y),
                    color: '#C026D3',
                  },
                ],
                yaxis: [yAxisSignal, yAxisHistogram],
                xaxis: {
                  type: 'datetime',
                  labels: {
                    datetimeUTC: false, // Set to false to use local time zone
                  },
                  categories: D1.map((t) => t.x.toISOString()),
                },
                stroke: {
                  curve: 'smooth',
                },
                title: {
                  ...Options.title, // Spread existing title options if any
                  text: O.title,
                },
                subtitle: {
                  ...Options.subtitle, // Spread existing subtitle options if any
                  text: O.D.meta.longName,
                },
              },
            },
          ])
        }
        break
      case 'ROC':
        {
          console.log('ApxCharts ROC')
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const roc = lineTotalData[i].roc ?? null
            D3.push({ x: L.x, y: roc })
          }
          if (yAxis3.title) yAxis3.title.text = 'ROC'
          console.log('ROC D3', D3)
          seriesLine.data = D1
          seriesLine2.data = D3
          seriesLine2.name = 'ROC'
          seriesLine2.color = '#A2E635'
          setOptionsArray([
            {
              type: 'line',
              options: {
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
              },
            },
          ])
        }
        break
      case 'button-RSI':
      case 'RSI':
        {
          let first = false
          let prev: number | null = null
          for (let i = 0; i < lineTotalData.length; i++) {
            const L = lineTotalData[i]
            const A = lineTotalData[i].action ?? null
            // D3.push({ x: L.x, y: L.rsi ?? null })
            D3.push({ x: L.x, y: L.action ?? null })
            if (first === false) {
              if (A !== 0) {
                first = true
                prev = A
                DA.push({ x: L.x, y: L.y, type: A })
              }
            } else {
              if (A !== 0 && A !== prev) {
                prev = A
                DA.push({ x: L.x, y: L.y, type: A })
              }
            }
          }
          console.log('RSI DA', DA)
          const xAxisAnnotations: XAxisAnnotations[] = [] as XAxisAnnotations[]
          const pointAnnotations: PointAnnotations[] = [] as PointAnnotations[]
          for (let i = 0; i < DA.length; i++) {
            const X1 = DA[i].x
            const X2 = i < DA.length - 1 ? DA[i + 1].x : X1
            xAxisAnnotations.push({
              x: X1.getTime(),
              x2: X2.getTime(),
              fillColor: DA[i].type == 1 ? 'E11D48' : '65A30D',
              opacity: 0.4,
            })
            const pMarker: PointAnnotationsMarker = {
              size: isMobile ? 2 : 8,
              fillColor: DA[i].type === 1 ? '#C026D3' : '#2563EB',
              strokeColor: 'red',
            }

            const pLabel: AnnotationLabel = {
              borderColor: '#C026D3',
              style: {
                color: '#fff',
                background: '#C026D3',
              },
              text: '',
            }
            if (DA[i].type == 1) {
              pLabel.text = 'Buy'
            } else if (DA[i].type == -1) {
              pLabel.text = 'Sell'
              pLabel.borderColor = '#2563EB'
              if (pLabel.style) pLabel.style.background = '#2563EB'
            }
            pointAnnotations.push({
              x: DA[i].x.getTime(),
              y: DA[i].y,
              marker: pMarker,
              label: pLabel,
            })
          }
          console.log('RSI pointAnnotations', pointAnnotations)
          if (yAxis3.title) yAxis3.title.text = 'RSI'
          seriesLine.data = D1
          seriesLine2.data = D3
          seriesLine2.name = 'RSI'
          seriesLine2.color = '#A2E635'
          seriesLine2.type = 'area'
          setOptionsArray([
            {
              type: 'line',
              options: {
                ...Options, // Spread existing options to preserve other settings
                series: [seriesLine, seriesLine2],
                yaxis: [yAxis1, yAxis3],
                title: {
                  ...Options.title, // Spread existing title options if any
                  text: O.title,
                },
                stroke: {
                  lineCap: 'round',
                  curve: ['smooth', 'stepline'],
                  width: [2, 3], // Line width for price series, 0 for volume series
                },
                subtitle: {
                  ...Options.subtitle, // Spread existing subtitle options if any
                  text: O.D.meta.longName,
                },
                annotations: {
                  /*
                  xaxis: xAxisAnnotations.map((a) => ({
                    x: a.x,
                    x2: a.x2,
                    fillColor: a.fillColor,
                    opacity: a.opacity,
                  })),
                  points: pointAnnotations.map((p, idx) => ({
                    x: p.x,
                    y: p.y,
                    marker: p.marker,
                    label: p.label ?? undefined,
                  })),*/
                },
              },
            },
          ])
        }
        break
      case 'button-ATR':
      case 'ATR':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          const atr = L.atr ?? null
          D3.push({ x: L.x, y: atr ? atr.atrLine : null })
        }
        if (yAxis3.title) yAxis3.title.text = 'ATR'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'ATR'
        seriesLine2.color = '#A2E535'
        setOptionsArray([
          {
            type: 'line',
            options: {
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
            },
          },
        ])
        break
      case 'button-MFI':
      case 'MFI':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.mfi ?? null })
        }
        if (yAxis3.title) yAxis3.title.text = 'MFI'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'MFI'
        seriesLine2.color = '#E11D48'
        setOptionsArray([
          {
            type: 'line',
            options: {
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
            },
          },
        ])
        break
      case 'button-MACD':
      case 'MACD':
        for (let i = 0; i < lineTotalData.length; i++) {
          const L = lineTotalData[i]
          D3.push({ x: L.x, y: L.macd ?? null })
        }
        if (yAxis3.title) yAxis3.title.text = 'MACD'
        seriesLine.data = D1
        seriesLine2.data = D3
        seriesLine2.name = 'MACD'
        seriesLine2.color = '#5EEAD4'
        setOptionsArray([
          {
            type: 'line',
            options: {
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
            },
          },
        ])
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
      for (let i = 0; i < optionsArray.length; i++) {
        const Options = optionsArray[i].options
        if (Options.chart) Options.chart.background = data.theme === 'light' ? '#F8F8F8' : '#121212'
        if (Options.theme) Options.theme.mode = data.theme === 'light' ? 'light' : 'dark'
      }
      setOptionsArray(optionsArray)
    })
  }, [Options, optionsArray])
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
        {optionsArray.map((item, index) => (
          <ReactApexChart
            key={index}
            options={item.options}
            series={item.options.series}
            type={item.type}
          />
        ))}
        <LoadingSpinner />
      </div>
      <YFD3Buttons onButtonClicked={handleButtonClicked} />
    </div>
  )
}

export default CandlestickChart
