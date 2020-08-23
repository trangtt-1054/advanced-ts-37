interface Car {
  wheels: number;
  carry();
}

interface Truck {
  wheels: number;
  payload();
}

function getVehicle(): Car | Truck {
  return {
    wheels: 4,
    payload: () => console.log('Truck is being load'),
  };
}

let vehicle = getVehicle();

/* Cách 1: vehicle.payload() //ko call đc payload type Car | Truck ko có method nào là payload() cả
Bình thường sẽ phải casting kiểu này

if (vehicle as Car) {
  console.log('car')
} else if (vehicle as Truck) {
  console.log('truck')
}
*/

//Cách 2: type predicate
function isTruck(vehicle: Car | Truck) {
  //return a boolean but not explicit
  return typeof (vehicle as Truck).payload === 'function';
}

function isTruck2(vehicle: Car | Truck): vehicle is Truck {
  //more explicit
  return typeof (vehicle as Truck).payload === 'function';
}

console.log(isTruck(vehicle)); //true

//Cách 3: check to see if field exists inside of object, ko prefer cách này vì field là string nên dễ typo
function run(vehicle: Car | Truck) {
  if ('payload' in vehicle) {
    (vehicle as Truck).payload();
  } else {
    (vehicle as Car).carry();
  }
}

//assertion function, giống ví dụ trên nhưng dùng cho class chứ ko phải interface, class thì phải check instance
class Engineer {
  name: string;
  code() {
    console.log('compiling...');
  }
}

class Designer {
  name: string;
  design() {
    console.log('exporting...');
  }
}

function getMember(): Engineer | Designer {
  const engineer = new Engineer();
  engineer.name = 'Josh';
  return engineer;
}

let member = getMember();

//assert this member against same signature that gets passed in
function assertEngineer(
  member: Engineer | Designer
): asserts member is Engineer {
  //đã assert thì phải check instance
  if (member instanceof Engineer) {
    return;
  }
  throw new Error('Not an engineer');
}

//nếu ko có cái asserts member is Engineer (tức là return void) thì sẽ phải soi vào trong function xem vì sao lại fail
