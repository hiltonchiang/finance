import clsx from 'clsx'
export interface ItemProps {
  name: string
  fullName?: string
  description?: string
  action1?: (indicatorId, name, callback) => void
  action2?: (indicatorId, buttonId, name, callback) => void
}
export interface ItemsProps {
  category: string
  items: ItemProps[]
}
/**
 * Items definitions of Strategies
 */
export const StrategiesItems: ItemsProps[] = [
  {
    category: 'Momentum',
    items: [
      {
        name: 'awesomeOsc',
        fullName: 'awesomeOscillatorStrategy',
        description: 'Awesome oscillator strategy',
      },
      {
        name: 'Ichimoku',
        fullName: 'ichimokuCloudStrategy',
        description: 'Ichimoku cloud strategy',
      },
      {
        name: 'RSI2',
        fullName: 'rsi2Strategy',
        description: `RSI 2. When 2-period RSI moves below 10, it is considered deeply oversold,and the other way around when moves above 90.`,
      },
      { name: 'Stoch' },
      { name: 'willRS' },
    ],
  },
  {
    category: 'Trend',
    items: [
      { name: 'APO', fullName: '' },
      { name: 'ARRON' },
      { name: 'BOP' },
      { name: 'CFO' },
      { name: 'KDJ' },
      { name: 'MACD' },
      { name: 'PSAR' },
      { name: 'typPRICE' },
      { name: 'Vortex' },
      { name: 'VWMA' },
    ],
  },
  {
    category: 'Volatility',
    items: [{ name: 'ab', fullName: '', description: '' }, { name: 'bb' }, { name: 'po' }],
  },
  {
    category: 'Volume',
    items: [
      { name: 'cmf' },
      { name: 'emv' },
      { name: 'fi' },
      { name: 'mfi' },
      { name: 'nvi' },
      { name: 'vwap' },
    ],
  },
]
/**
 * Items for Indicators
 */
export const IndicatorsItems: ItemsProps[] = [
  {
    category: 'Default',
    items: [
      {
        name: 'VOL',
        fullName: 'Volume',
        description:
          'Stock trading volume is the total number of shares, contracts, or units of a security traded between buyers and sellers during a specific period, typically a single trading day.',
      },
    ],
  },
  {
    category: 'Momentum',
    items: [
      {
        name: 'AO',
        fullName: 'awesomeOscillator',
        description: `Median Price = ((Low + High) / 2). <br/> AO = 5-Period SMA - 34-Period SMA.`,
      },
      {
        name: 'CMO',
        fullName: 'chaikinOscillator',
        description:
          'The ChaikinOscillator function measures the momentum of the Accumulation/Distribution (A/D) using the Moving Average Convergence Divergence (MACD) formula. It takes the difference between fast and slow periods EMA of the A/D. Cross above the A/D line indicates bullish. <br/> CO = Ema(fastPeriod, AD) - Ema(slowPeriod, AD)',
      },
      {
        name: 'Ichimoku',
        fullName: 'ichimokuCloud',
        description: `Ichimoku Cloud. Also known as Ichimoku Kinko Hyo, is a versatile indicator that defines support and resistence, identifies trend direction, gauges momentum, and provides trading signals. <br/>
          Tenkan-sen (Conversion Line) = (9-Period High + 9-Period Low) / 2 <br/>
          Kijun-sen (Base Line) = (26-Period High + 26-Period Low) / 2 <br/>
          Senkou Span A (Leading Span A) = (Conversion Line + Base Line) / 2 projected 26 periods in the future <br/>
          Senkou Span B (Leading Span B) = (52-Period High + 52-Period Low) / 2 projected 26 periods in the future <br/>
          Chikou Span (Lagging Span) = Closing plotted 26 periods in the past.`,
      },
      {
        name: 'PPO',
        fullName: 'percentagePriceOscillator',
        description: `Percentage Price Oscillator (PPO). It is a momentum oscillator for the price. It is used to indicate the ups and downs based on the price. A breakout is confirmed when PPO is positive. <br/>
          PVO = ((EMA(fastPeriod, prices) - EMA(slowPeriod, prices)) / EMA(longPeriod, prices)) * 100, <br/>
          Signal = EMA(9, PVO) <br/>
          Histogram = PVO - Signal`,
      },
      {
        name: 'PVO',
        fullName: 'percentageVolumeOscillator',
        description: `Percentage Volume Oscillator (PVO). It is a momentum oscillator for the volume. It is used to indicate the ups and downs based on the volume. A breakout is confirmed when PVO is positive. <br/>
          PVO = ((EMA(fastPeriod, volumes) - EMA(slowPeriod, volumes)) / EMA(longPeriod, volumes)) * 100. <br/>
          Signal = EMA(9, PVO), <br/>
          Histogram = PVO - Signal`,
      },
      {
        name: 'ROC',
        fullName: 'priceRateOfChange',
        description: `Price Rate of Change (ROC). <br/>
          ROC[i] = 0 when i < period,<br/>
          ROC[i] = (close[i] / close[i-period] - 1) * 100 when i >= period`,
      },
      {
        name: 'RSI',
        fullName: 'relativeStrengthIndex',
        description: `Relative Strength Index (RSI). <br/>
          It is a momentum indicator that measures the magnitude of recent price changes to evaluate overbought and oversold conditions using the given window period.<br/>
          RS = Average Gain / Average Loss, <br/>
          RSI = 100 - (100 / (1 + RS))`,
      },
      {
        name: 'Stoch',
        fullName: 'stochasticOscillator',
        description: `Stochastic Oscillator. <br/>
        It is a momentum indicator that shows the location of the closing relative to high-low range over a set number of periods.<br/>
        K = (Closing - Lowest Low) / (Highest High - Lowest Low) * 100<br/>
        D = 3-Period SMA of K`,
      },
      {
        name: 'willR',
        fullName: 'williamsR',
        description: `Williams R. Determine overbought and oversold.<br/>
        WR = (Highest High - Closing) / (Highest High - Lowest Low) * -100.<br/>
        Buy when -80 and below. Sell when -20 and above.`,
      },
    ],
  },
  {
    category: 'Trend',
    items: [
      {
        name: 'APO',
        fullName: 'absolutePriceOscillator',
        description: `Absolute Price Oscillator (APO) function calculates the technical indicator that is used to follow trends. APO crossing above zero indicates bullish, while crossing below zero indicates bearish. Positive value is upward trend, while negative value is downward trend.<br/>
        Fast = EMA(fastPeriod, values)<br/>
        Slow = EMA(slowPeriod, values)<br/>
        APO = Fast - Slow`,
      },
      {
        name: 'ARRON',
        fullName: 'aroon',
        description: `Aroon Indicator. It is a technical indicator that is used to identify trend changes in the price of a stock, as well as the strength of that trend. It consists of two lines, Arron Up, and Aroon Down. The Aroon Up line measures the strength of the uptrend, and the Aroon Down measures the strength of the downtrend. When Aroon Up is above Aroon Down, it indicates bullish price, and when Aroon Down is above Aroon Up, it indicates bearish price.<br/>
        Aroon Up = ((25 - Period Since Last 25 Period High) / 25) * 100<br/>
        Aroon Down = ((25 - Period Since Last 25 Period Low) / 25) * 100`,
      },
      {
        name: 'BOP',
        fullName: 'balanceOfPower',
        description: `The Balance of Power (BOP) function calculates the strength of buying and selling pressure. Positive value indicates an upward trend, and negative value indicates a downward trend. Zero indicates a balance between the two.<br/>
        BOP = (Closing - Opening) / (High - Low)`,
      },
      {
        name: 'CFO',
        fullName: 'chandeForecastOscillator',
        description: `The Chande Forecast Oscillator developed by Tushar Chande The Forecast Oscillator plots the percentage difference between the closing price and the n-period linear regression forecasted price. The oscillator is above zero when the forecast price is greater than the closing price and less than zero if it is below.<br/>
        R = Linreg(Closing)<br/>
        CFO = ((Closing - R) / Closing) * 100`,
      },
      {
        name: 'MCFO',
        fullName: 'movingChandeForecastOscillator',
        description: `Moving Chande Forecast Oscillator calculates based on the given period. The Chande Forecast Oscillator developed by Tushar Chande The Forecast Oscillator plots the percentage difference between the closing price and the n-period linear regression forecasted price. The oscillator is above zero when the forecast price is greater than the closing price and less than zero if it is below.<br/>
        R = Linreg(Closing)<br/>
        CFO = ((Closing - R) / Closing) * 100`,
      },
      {
        name: 'CCI',
        fullName: 'communityChangeIndex',
        description: `The Community Channel Index (CCI) is a momentum-based oscillator used to help determine when an investment vehicle is reaching a condition of being overbought or oversold.<br/>
        Moving Average = Sma(Period, Typical Price)<br/>
        Mean Deviation = Sma(Period, Abs(Typical Price - Moving Average))<br/>
        CMI = (Typical Price - Moving Average) / (0.015 * Mean Deviation)`,
      },
      {
        name: 'DEMA',
        fullName: 'doubleExponentialMovingAverage',
        description: `Dema calculates the Double Exponential Moving Average (DEMA).<br/>
        DEMA = (2 * EMA(values)) - EMA(EMA(values))`,
      },
      {
        name: 'EMA',
        fullName: 'exponentialMovingAverage',
        description: `Exponential moving average (EMA).`,
      },
      {
        name: 'KDJ',
        fullName: 'randomIndex',
        description: `The kdj function calculates the KDJ indicator, also known as the Random Index. KDJ is calculated similar to the Stochastic Oscillator with the difference of having the J line. It is used to analyze the trend and entry points.<br/>
        The K and D lines show if the asset is overbought when they crosses above 80%, and oversold when they crosses below 20%. The J line represents the divergence.<br/>
        RSV = ((Closing - Min(Low, rPeriod)) / (Max(High, rPeriod) - Min(Low, rPeriod))) * 100<br/>
        K = Sma(RSV, kPeriod)<br/>
        D = Sma(K, dPeriod)<br/>
        J = (3 * K) - (2 * D)`,
      },
      {
        name: 'MI',
        fullName: 'massIndex',
        description: `The Mass Index (MI) uses the high-low range to identify trend reversals based on range expansions.<br/>
        Singe EMA = EMA(9, Highs - Lows)<br/>
        Double EMA = EMA(9, Single EMA)<br/>
        Ratio = Single EMA / Double EMA<br/>
        MI = Sum(25, Ratio)`,
      },
      {
        name: 'MACD',
        fullName: 'movingAverageConvergenceDivergence',
        description: `Moving Average Convergence Divergence (MACD).<br/>
        MACD = 12-Period EMA - 26-Period EMA.<br/>
        Signal = 9-Period EMA of MACD.`,
      },
      {
        name: 'MMAX',
        fullName: 'movingMax',
        description: `Moving max for the given period.`,
      },
      {
        name: 'MMIN',
        fullName: 'movingMin',
        description: `Moving min for the given period.`,
      },
      {
        name: 'MSUM',
        fullName: 'movingSum',
        description: `Moving sum for the given period.`,
      },
      {
        name: 'PSAR',
        fullName: 'parabolicSAR',
        description: `Parabolic SAR. It is a popular technical indicator for identifying the trend and as a trailing stop.<br/>
        PSAR = PSAR[i - 1] - ((PSAR[i - 1] - EP) * AF)<br/>
        If the trend is Falling:<br/>
        - PSAR is the maximum of PSAR or the previous two high values.<br/>
        - If the current high is greather than or equals to PSAR, use EP.<br/>
        If the trend is Rising:<br/>
        - PSAR is the minimum of PSAR or the previous two low values.<br/>
        - If the current low is less than or equals to PSAR, use EP.<br/>
        If PSAR is greater than the closing, trend is falling, and the EP is set to the minimum of EP or the low.<br/>
        If PSAR is lower than or equals to the closing, trend is rising, and the EP is set to the maximum of EP or the high.<br/>
        If the trend is the same, and AF is less than 0.20, increment it by 0.02.<br/>
        If the trend is not the same, set AF to 0.02.`,
      },
      {
        name: 'QSTICK',
        fullName: 'QSTICK',
        description: `The Qstick function calculates the ratio of recent up and down bars.<br/>
        QS = Sma(Closing - Opening)`,
      },
      {
        name: 'RMA',
        fullName: 'rollingMovingAverage',
        description: `Rolling moving average (RMA).<br/>
        R[0] to R[p-1] is SMA(values)<br/>
        R[p] and after is R[i] = ((R[i-1]*(p-1)) + v[i]) / p`,
      },
      {
        name: 'SMA',
        fullName: 'simpleMovingAverage',
        description: `A Simple Moving Average (SMA) is a technical indicator that calculates the average price of an asset over a specific number of periods (e.g., days, hours) by summing closing prices and dividing by that number. It smooths out price volatility to identify trends, with equal weight assigned to all data points.  `,
      },
      { name: 'typPRICE' },
      { name: 'Vortex' },
      { name: 'VWMA' },
    ],
  },
  {
    category: 'Volatility',
    items: [{ name: 'ab', fullName: '', description: '' }, { name: 'bb' }, { name: 'po' }],
  },
  {
    category: 'Volume',
    items: [
      { name: 'cmf' },
      { name: 'emv' },
      { name: 'fi' },
      { name: 'mfi' },
      { name: 'nvi' },
      { name: 'vwap' },
    ],
  },
]
export const QuotesItems: ItemsProps[] = [
  {
    category: 'NewVersion',
    items: [
      { name: '1 D' },
      { name: '5 D' },
      { name: '1 M' },
      { name: '6 M' },
      { name: 'YTD' },
      { name: '1 Y' },
      { name: '5 Y' },
    ],
  },
]

export const menuButtonCls = clsx(
  'set-ring-1 inset-ring-white/5 inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2',
  'dark:bg-white/10 bg-stone-950 text-sm font-semibold text-white hover:bg-white/20'
)
export const menuItemsClsQuotes = clsx(
  'hidden data-[headlessui-state~=open]:block',
  'data-closed:scale-95 data-closed:transform data-closed:opacity-0',
  'data-enter:duration-100 data-enter:ease-out',
  'data-leave:duration-75 data-leave:ease-in',
  'absolute left-0 md:transform',
  'z-10 mt-2 w-[fit-content(100%)] origin-top-right divide-y divide-white/10 rounded-md bg-blue-500 outline-1 -outline-offset-1 outline-white/10 transition'
)
export const menuItemsClsIndicators = clsx(
  'hidden data-[headlessui-state~=open]:block',
  'data-closed:scale-95 data-closed:transform data-closed:opacity-0',
  'data-enter:duration-100 data-enter:ease-out',
  'data-leave:duration-75 data-leave:ease-in',
  'absolute left-1/2 top-1/2 -translate-x-1/4 -translate-y-1/4 md:transform',
  'z-10 mt-2 w-[fit-content(100%)] origin-top-right divide-y divide-white/10 rounded-md bg-blue-500 outline-1 -outline-offset-1 outline-white/10 transition'
)
export const menuItemsClsStrategies = clsx(
  'hidden data-[headlessui-state~=open]:block',
  'data-closed:scale-95 data-closed:transform data-closed:opacity-0',
  'data-enter:duration-100 data-enter:ease-out',
  'data-leave:duration-75 data-leave:ease-in',
  'absolute left-1/2 top-1/2 md:transform',
  'z-10 mt-2 w-[fit-content(100%)] origin-top-right divide-y divide-white/10 rounded-md bg-blue-500 outline-1 -outline-offset-1 outline-white/10 transition'
)
export const menuItemClass = clsx(
  `flex-shrink-0 snap-center rounded-md px-4 py-2`,
  `font-bold text-center text-xs text-black`,
  `w-[fit-content(100%)]`,
  `bg-blue-500`,
  `md:text-base md:bg-blue-500 md:text-white md:hover:bg-blue-700`
)

export const menuItemClassHighlight = clsx(
  `flex-shrink-0 snap-center rounded-md px-4 py-2`,
  `font-bold text-center text-xs text-black`,
  `border border-2 border-white p-2`,
  `w-[fit-content(100%)]`,
  `bg-blue-500`,
  `md:text-base md:bg-blue-500 md:text-white md:hover:bg-blue-700`
)
