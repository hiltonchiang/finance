import YF, { YFProps } from '@/components/YahooFinance'
import { getChartOptions } from '@/lib/actions'

export default async function Home() {
  const yfprops: YFProps = await getChartOptions()
  console.log('yfprops', yfprops)
  return (
    <>
      <div id="main-finance-page">
        <YF symbol={yfprops.symbol} options={yfprops.options} />
      </div>
    </>
  )
}
