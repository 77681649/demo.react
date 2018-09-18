import prefixNamespace from '../src/prefixNamespace'


console.log(prefixNamespace({
  namespace:'index',
  reducers:{
    FETCH(){

    }
  }
}))

console.log(prefixNamespace({
  namespace:'index',
  reducers:[
    {
      FETCH(){}
    }
  ]
}))