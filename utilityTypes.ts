//utility　help transform to make a new Type
//Partial: copy 1 Type với và tạo 1 type mới với các properties đó là optional
interface Starship {
  name: string;
  enableHyperjump: boolean;
}

//a function that allows to update properties of Starship
const updateStarship = (id: number, newStarship: Starship) => {};

updateStarship(1, { name: 'Explorer', enableHyperjump: true }); //nếu object chỉ có name hay enableHyperjump thì lỗi

const updateStarship2 = (id: number, newStarship: Partial<Starship>) => {};
updateStarship2(1, { name: 'Explorer' });

//Required: ngược lại với Partial, copy 1 type và biến tất cả các properties trong type đấy thành required, tương tự với Readonly
const starships: Record<string, Starship> = {
  Explorer1: {
    name: 'Explorer 1',
    enableHyperjump: true,
  },
  Explorer2: {
    name: 'Explorer 2',
    enableHyperjump: false,
  },
};

type StarshipNameOnly = Pick<Starship, 'name'>;
type StarshipWithoutName = Omit<Starship, 'name'>; //Omit ngược lại với Pick

//Exclude: substract one union type from another
type A = string | string[] | undefined;
type Excluded = Exclude<A, undefined>; // string | string [], (bỏ cái undefined đi)

type AvailableDrinks = 'Coffee' | 'Tea' | 'Orange Juice' | 'Lemonade';

let MyDrink: AvailableDrinks;
MyDrink = 'Coffee';

type DrinksIHate = 'Coffee' | 'Orange Juice';
let MyDrink2: Exclude<AvailableDrinks, DrinksIHate>;
MyDrink2 = 'Lemonade';

//Extract: opposite to Exclude
type DrinksILike = 'Tea' | 'Mohito' | 'Water';
let MyDrink3: Extract<AvailableDrinks, DrinksILike>; // còn mỗi 'Tea'

//NonNullable<T> loại bỏ hết các thể loại null hay undefined của T
interface SomeProperties {
  color?: 'blue' | 'red' | 'green';
}

function paint(id: number, color: SomeProperties['color']) {}
paint(1, undefined); //vì color là optional nên pass undefined vào ok, nếu ko muốn bị thế thì

function paint2(id: number, color: NonNullable<SomeProperties['color']>) {}
//paint2(1, undefined) : /by default TS allows us to assign null/undefined to any type, eg const A: string = null; => muốn disable thì phải strict null check true
paint2(1, 'red');

//ReturnType
function paint3(id: number, color: NonNullable<SomeProperties['color']>) {
  return {
    id,
    color,
  };
}

type PaintReturn = ReturnType<typeof paint3>;

//InstanceType: take T which is the type of static side of a class
class MyCar {
  name: string;

  drive() {}

  constructor(name: string) {
    this.name = name;
  }

  static buildCar() {
    //some code
  }
}

type CarInstanceType = InstanceType<typeof Car>; //Car. dùng typeof to get the type of the STATIC side of the car class, phải dùng typeof vì InstanceType nó chỉ cho lấy static side. Trong trường hợp này thì chẳng cần thiết phải dùng InstanceType, có thể viết Car directly cũng ok nhưng sẽ có 1 số mixing pattenr sẽ phải dùng

//for eg we have Car and User entity in db, muốn có 1 cái function để delete entity khỏi db, bình thường thì sẽ phải viết cái function delete đấy ở cả 2 class nhưng mà vì logic nó trùng nhau nên có thể cắt thành 1 cái function chung

//helper type to make sure BaseClass is a class which can be constructed or instantiated
type Constructable<ClassInstance> = new (...args: any[]) => ClassInstance; //define a constructor function using 'new' keyword, takes some args and return an instance of the class. What class? we have to make it generic

//vì Constructable cần 1 generic parameter nên pass tạm 1 cái empty object ok
function Deletable<BaseClass extends Constructable<{}>>(Base: BaseClass) {
  return class extends Base {
    //return 1 anonymous class là copy của Base và có thêm deleted & delete()
    deleted: boolean;
    delete() {}
  };
}

class Car {
  constructor(public name: string) {}
}

class User {
  constructor(public name: string) {}
}

const DeletableCar = Deletable(Car);
const DeletableUser = Deletable(User);

type DeletableUserInstance = InstanceType<typeof DeletableUser>;
type DeletableCarInstance = InstanceType<typeof DeletableCar>;

class Profile {
  //hold information about user and their car
  //user: DeletableUser => ko dùng đc vì Deletable là variable chứ ko phải class, muốn lấy instance type of DeletableUser variable phải dùng InstanceType
  user: DeletableUserInstance;
  car: DeletableCarInstance;
}

const profile = new Profile();
profile.user = new DeletableUser('Trang');
profile.car = new DeletableCar('Audi');

//ThisType<T> doesnt transform one type to another, acts as a marker that allows us to specify type of 'this' in an object
interface MyObject {
  sayHello(): void;
}

interface MyObjectThis {
  //this insterface is used to describe 'this' of other object
  helloWorld(): string;
}

const myObject: MyObject & ThisType<MyObjectThis> = {
  sayHello() {
    return this.helloWorld(); //describle 'this' apart from the main object, we have to set the context of 'this'
  },
};

//set context of this, set 'this' to the object that has 'helloWorld' method
myObject.sayHello = myObject.sayHello.bind({
  helloWorld() {
    return 'Helloooooooo';
  },
});

console.log(myObject.sayHello()); // run 'tsc utilityTypes.ts' để lấy về file js utilityTypes.js sau đó run 'node utulityTypes.js', kết quả là 'Helloooooooo'

//trong doc ghi là phải config noImplicitThis thì ThisType mới work
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M. Basically this says: the 'data' property should be an object of type D and 'methods' property should be an object of type M. and 'this' in 'methods' should be of type D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
