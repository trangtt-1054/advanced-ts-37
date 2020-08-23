//type SomeType = T extends U ? X : Y
//if T is assignale to U, then choose type X, otherwise choose Y
//this happens when it doesn't have enough information about one or two type in the condition

type SomeType = number;
type ConditionalType = SomeType extends string ? string : null;

//args of child fn depends on the args of parent
function myFoo<T>(value: T) {
  type A = T extends boolean
    ? 'TYPE A'
    : T extends string
    ? 'TYPE B'
    : T extends number
    ? 'TYPE C'
    : 'TYPE D';
  const someOtherFoo = (someArg: T extends boolean ? 'TYPE A' : 'TYPE B') => {
    const a: 'TYPE A' | 'TYPE B' = someArg; //lúc này chưa biết someArg là type nào nên có thể assign type union cho nó
  };
  return someOtherFoo;
}

const result = myFoo(''); //someOtherFoo will be called with 'TYPE B' because string is not assignable to boolean
const result2 = myFoo(true);

//Distributive property of conditional types
type StringOrNot<T> = T extends string ? string : never; //never: never happens/doesn't exist. never can be used to filter union type
type AUnion = string | boolean | never; //hover vào thấy TS chỉ nhận string | boolean thôi, cái never bị ignore;

//type Exclude<T, U> = T extends U ? never : T;
//Exclude takes 2 union types, T & U, from T it exculdes all elements of U
//TypeA | TypeB | TypeC - TypeB | TypeC = TypeA
type ResultType = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; //type "c"

/* về bản chất thì exclude work như sau, quá trình này gọi là distributive
conditional type is distributed, for each element in T, ts will compare it with U
'a' extends 'a' | 'b' never : 'a' => never ('a' extends 'a' | 'b' là true)
'b' extends 'a' | 'b' never : 'b' => never 
'c' extends 'a' | 'b' never : 'c' => 'c'
*/

type MyType<T> = T extends string | number ? T : never;
type MyResult = MyType<string | number | boolean>; //vì MyType là distributive nên từng element sẽ đc compared against điều kiện kia (string | number), string extends string | number ko ? => ok, number cũng thế, boolean thì ko extend string | number nên become never

//check thì T và các điều kiện extends phải đc giữ nguyên ko đc thêm thắt thay wrap nó vào các cái khác. ví dụ
type MyType2<T> = (() => T) extends () => string | number ? T : never;
type Result2 = MyType2<string | number | boolean>; //MyResult2 = never, 1 fn returns string  \ number | boolean is not assignable to 1 fn return string | number.
type Result3 = MyType2<string | number>; // = string | number, lúc này MyType becomes non-distributive

//can also make conditional type not distributive by wrapping it in a tuple
type MyType3<T> = [T] extends [string | number] ? T : never;

//use conditional type to infer some type or part of that type
type InferSomething<T> = T extends infer U ? U : any;
type Inferred = InferSomething<'This is a string'>; //infer the type of the whole T, kiểu nó tự infer đc cái string này, tự infer đc thì dùng cái đc infer luôn

type InferSomething2<T> = T extends { a: infer A; b: number } ? A : any;
//có thể extends 1 object, function, etc... ở đây là infer type of property a in that object, also infer this a if only T is assignable to an object that has property 'a', 'b'
type Inferred2 = InferSomething2<{ a: 'Hello' }>; //là any vì nó chỉ infer nếu object kia có cả a và b
type Inferred3 = InferSomething2<{ a: 'Hello'; b: 20 }>; //h thì infer đc string literal là 'Hello'

//có thể infer multitple
type InferMultiple<T> = T extends { a: infer A; b: infer B } ? A & B : any;
type Inferred4 = InferMultiple<{
  a: { name: 'Stainer'; job: 'Transportation Security' };
  b: { where: 'Planet Earth'; temperature: -20 };
}>;

//ReturnType: returns the type of the return value of a function, bản chất của ReturnType là dùng infer
//type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type FuncReturnValue = ReturnType<() => true>;

//các utility types khác cũng dùng conditional types: Exclude, Extract, NonNullable, ReturnType, InstanceType
