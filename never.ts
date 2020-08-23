console.log(typeof null); //null chứ ko phải object như trong js
console.log(typeof undefined); //vẫn là undefined

//let val: number = undefined; //strict: false thì compile ok
function error(): never {
  throw new Error('Request failed');
}

//void: complete nhưng ko return gì cả, never là never complete
function neverFinish(): never {
  while (true) {}
}

//nên thêm return type là never vì nếu chỉ có string thì sẽ phải nhìn vào bên trong function xem có throw exception nào ko. Khi thêm never thì sẽ hiểu luôn là function này có khả năng throw exception (it doesn't work the way we expect)
function processString(msg: string): string | never {
  if (msg) {
    return 'Finished' + msg;
  }
  throw new Error('Processing failed');
}

console.log(processString('')); //Fails to run this code
