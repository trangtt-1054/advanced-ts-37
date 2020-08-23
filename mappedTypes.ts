//Mapped Types: allow us to create a new type by iterating over a list of properties

type Properties = 'propA' | 'propB';

/** for every property 'P' in Properties, we create a new property */
type MyMappedType = {
  [P in Properties]: boolean;
};

type MyMappedType2 = {
  [P in Properties]: P; //or we can write SomeType[P]
};

//nếu ko extend generics thì error vì typescript expects a property to be either string|number|symbol, but the type parameter Properties can be anything from a boolean to a map => have to make sure every property in that union is string|number|symbol
type GenericMappedType<Properties extends string | number | symbol> = {
  [P in Properties]: P;
};

//now we can create new type from above generics
type NewType = GenericMappedType<'propA' | 'propB'>;

//use mapped type to create new type from an existing type
type MappedType3<T> = {
  [P in keyof T]: T[P];
};
type NewType2 = MappedType3<{ name: 'molly'; job: 'event planner' }>; //NewType dạng property và value giống với T, giống như copy type của T cho NewType2

//instead of copying, we can modify somehow: like making them readonly or optional, make them nullable, etc
type MappedType4<T> = {
  readonly [P in keyof T]: T[P] | null;
};

//Built-in Pick and Record of TS uses mapped type behine the scence. Pick: pick some properties from this type and create new type. T is the existing type, Properties are the properties you want to pick from T, ofc we need to make sure these properties exist in type T
type MyPickType<T, Properties extends keyof T> = {
  [P in Properties]: T[P];
};

type NewType3 = MyPickType<
  { name: 'Kirk'; job: 'TSA Agent'; status: 'single' },
  'name' | 'job'
>; //pick only name và job vào làm property cho NewType3

//recreate Record type, bản chất K trong Record extends keyof any, nói là any nhưng cũng chỉ có thể là string|number|symbol. phải đặt là Record1 để tránh trùng với type Record đã có sẵn của TS, cơ mà definition thì như nhau.
type Record1<K extends keyof any, T> = {
  [P in K]: T;
};

const someRecord: Record<string | number, number> = {};
someRecord.apples = 10;
someRecord.oranges = 20;
someRecord[19] = 1; //key can be a number

//index signature giống Record<string, number>, có thể thay type của someRecord thành Record2 ok. có điều là index signature thì bị giới hạn cái key kia, ko dùng đc union để làm index signature chẳng hạn. Với record thì thoải mái
interface Record2 {
  [key: string]: number;
}

const someRecord2: Record<string | number, number> = {};
const someRecord3: Record<'name' | 'nickname' | 'accoundId', string> = {
  name: 'hot chick',
  nickname: 'moddleman',
  accoundId: 'jerk',
};

//add specific type to mapped type, viết trực tiếp vào mapped type thì nó ko cho, phải dùng intersection type
type Record3<K extends keyof any, T> = {
  [P in K]: T;
} & { someProperty: string };

const extended: Record3<string | number, string> = {
  name: 'abc',
  1990: 'dropped Harvard University',
  someProperty: 'extended property',
};
