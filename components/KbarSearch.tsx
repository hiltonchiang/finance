'use client'
import { KBarSearchProvider, type KBarConfig } from 'pliny/search/KBar'
import { Action } from "kbar"

const handlePerform = (e) => {
  console.log('handlePerform', e)
  const N = e.name.split('|')
  console.log('split', N)
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
