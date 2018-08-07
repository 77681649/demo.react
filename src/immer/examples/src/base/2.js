/**
 * curring
 */
import produce from "../immer"

const mapper  = produce(function(draft,index){
  draft.index = index
})

console.dir([{},{},{}].map(mapper))