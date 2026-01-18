import * as d3 from 'd3'

interface Pos {
  x: number
  y: number
}
const LineFunction = d3
  .line<Pos>()
  .x((d: Pos) => d.x)
  .y((d: Pos) => d.y)

const LineFunctionCurve = d3
  .line<Pos>()
  .x((d: Pos) => d.x)
  .y((d: Pos) => d.y)
  .curve(d3.curveBasis)

function getChartDim(): [number, number] {
  const chartDiv = d3.select('#chart').node() as HTMLElement
  if (chartDiv) {
    const rect = chartDiv?.getBoundingClientRect()
    const width = rect.width // returns a number (float)
    const height = rect.height // returns a number (float)
    return [width, height]
  } else {
    return [0, 0]
  }
}
// input: data is an number[]
// output: out is an svg HTMLElement
const D3Line: React.FC<{ data: number[]; show: boolean }> = ({ data, show }) => {
  if (data.length === 0) return
  const [w, h] = getChartDim()
  console.log('D3Line, [w,h]', w, h)
  const max = Math.max(...data)
  const min = Math.min(...data)
  console.log('D3Line, max min', max, min)
  const topMargin = 10
  const leftMargin = 10
  // A * min + B = topMargin
  // A * max + B = h - topMargin
  // A = (h - topMargin * 2) / (max-min)
  // B = topMargin - (h-topMargin * 2) / (max-min) * min
  const A = (h - topMargin * 2) / (max - min)
  const B = topMargin - A * min
  const dx = (w - leftMargin * 2) / data.length
  const lineData: Pos[] = [] as Pos[]
  for (let i = 0; i < data.length; i++) {
    const X = i * dx
    const Y = data[i] * A + B
    lineData.push({ x: X, y: Y })
  }
  const C = LineFunction(lineData)
  const pathD: string | undefined = C ? C : undefined
  console.log('D3Line', pathD)
  const viewBox = `0, 0, ${w}, ${h}`
  const clsNme = `mr-2 flex-shrink-0` + show ? '' : 'hidden'
  return (
    <>
      <svg
        className={clsNme}
        height={h}
        strokeLinejoin="round"
        version="1.1"
        viewBox={viewBox}
        width={w}
        fill="currentColor"
      >
        <path fillRule="evenodd" clipRule="evenodd" d={pathD}></path>
      </svg>
    </>
  )
}

export default D3Line
