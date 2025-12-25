'use client'
import { Action } from 'kbar'
import emitter from '@/components/Emitter'
import { YFProps } from '@/components/YahooFinance'
import { updateTicker, getOpenCloseTime } from '@/lib/actions'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'

async function handlePerform(e) {
  console.log('handlePerform', e)
  const N = e.name.split('|')
  console.log('split', N)
  const [estTime1, estTime2] = await getOpenCloseTime()
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5m',
  }
  emitter.emit('searchTicker', { ticker: N, timestamp: Date.now() })
  const O: YFProps = { symbol: N[0], options: queryOptions }
  const results = await updateTicker(O)
}
const handleSearchDocumentLoad = (D) => {
  const myAction: Action[] = [] as Action[]
  for (let i = 0; i < D.length; i++) {
    const action: Action = {
      id: i.toString(),
      name: D[i],
      perform: handlePerform,
    }
    myAction.push(action)
  }
  return myAction
}

export default handleSearchDocumentLoad
