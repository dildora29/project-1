'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2023-09-15T05:00:00',
    '2023-09-28T15:01:00',
    '2023-09-30T09:48:00',
    '2023-10-07T07:20:00',
    '2023-10-10T18:56:00',
    '2023-10-11T13:24:00',
    '2023-10-14T16:26:00',
    '2023-10-15T05:55:00',
  ],
  cashBackRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2023-09-15T05:00:00',
    '2023-09-28T15:01:00',
    '2023-09-30T09:48:00',
    '2023-10-07T07:20:00',
    '2023-10-10T18:56:00',
    '2023-10-11T13:24:00',
    '2023-10-14T16:26:00',
    '2023-10-15T05:55:00',
  ],
  cashBackRate: 1.5, // %
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2023-09-15T05:00:00',
    '2023-09-28T15:01:00',
    '2023-09-30T09:48:00',
    '2023-10-07T07:20:00',
    '2023-10-10T18:56:00',
    '2023-10-11T13:24:00',
    '2023-10-14T16:26:00',
    '2023-10-15T05:55:00',
  ],
  cashBackRate: 0.7, // %
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    '2023-10-07T07:20:00',
    '2023-10-10T18:56:00',
    '2023-10-11T13:24:00',
    '2023-10-14T16:26:00',
    '2023-10-15T05:55:00',
  ],
  cashBackRate: 1, // %
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumCashBack = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

function displayMovements(acc, sort) {
  // [200, 450, -400, 3000, -650, -130, 70, 1300],

  containerMovements.innerHTML = '';

  let sortedMovements = sort
    ? [...acc.movements].sort((a, b) => a - b)
    : acc.movements;

  // Create elemant
  sortedMovements.forEach((move, ind) => {
    let type = move > 0 ? 'deposit' : 'withdrawal';
    let time = new Date(acc.movementsDates[ind]);

    const html = ` 
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
            1 ${type}
        </div>
    <div class="movements__date">${displayTime(time)}</div>
        <div class="movements__value">${move}$</div>
    </div>
`;

    // insertAdjacentHTML => html elementi ichiga qo'shish
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function displayBalance(movements) {
  // [200, 450, -400, 3000, -650, -130, 70, 1300],
  let balance = movements.reduce((acc, element) => acc + element, 0);
  labelBalance.textContent = `${balance}$`;
}
// income
function displaySummary(account) {
  const income = account.movements
    .filter(move => move > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income}$`;

  // outcome
  const outcome = account.movements
    .filter(move => move < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${-outcome}$`;

  const cashback = account.movements
    .filter(move => move > 0)
    .map(move => (move * account.cashBackRate) / 100)
    .filter(cash => cash > 1)
    .reduce((acc, val) => acc + val);

  labelSumCashBack.textContent = `${cashback}$`;
}

// Create userName
accounts.forEach(acc => {
  let userName = acc.owner
    .toLowerCase()
    .split(' ')
    .map(el => el[0])
    .join('');

  acc.userName = userName;
});

// Update Interface
function updateUI(user) {
  displayMovements(user);
  displayBalance(user.movements);
  displaySummary(user);
}

function displayTime(date) {
  let now = new Date();

  function calcPassedDay(date1, date2) {
    let day = Math.trunc(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

    if (date1.getHours() - date2.getHours() < 0) return ++day;
    return day;
  }
  let passedDay = calcPassedDay(now, date);

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hour = String(date.getHours()).padStart(2, '0');
  let minut = String(date.getMinutes()).padStart(2, '0');

  // 15/10/2023, 21:30
  if (passedDay == 0) return `Today, ${hour}:${minut}`;
  if (passedDay == 1) return `Yesterday, ${hour}:${minut}`;

  return `${day}/${month}/${year}, ${hour}:${minut}`;
}

// displayTime(new Date('2023-10-16T07:20:00'));

// userLogOut

function userLogOut() {
  let time = 300;

  let min = Math.trunc(time / 60);
  let sec = time % 60;

  let timer = setInterval(() => {
    labelTimer.textContent = `${addZeroBegin(min)}:${addZeroBegin(sec)}`;

    if (sec == 0 && min != 0) {
      min--;
      sec = 60;
    } else if (min == 0 && sec == 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';

      clearInterval(timer);
    }

    sec--;
  }, 100);
}

function addZeroBegin(num){
  return String(num).padStart(2, '0')
}

//////////////////////////////////////
// Events

let currentUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  let user = accounts.find(
    acc => inputLoginUsername.value.toLowerCase() == acc.userName
  );

  if (!user || inputLoginPin.value != user.pin) {
    alert('Login or Password is incorrect');
    return;
    // return (
    //   <Stack spacing={2} sx={{ width: '100%' }}>
    //     <Button variant="outlined" onClick={handleClick}>
    //       Open success snackbar
    //     </Button>
    //     <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    //       <Alert
    //         onClose={handleClose}
    //         severity="success"
    //         sx={{ width: '100%' }}
    //       >
    //         This is a success message!
    //       </Alert>
    //     </Snackbar>
    //     <Alert severity="error">This is an error message!</Alert>
    //     <Alert severity="warning">This is a warning message!</Alert>
    //     <Alert severity="info">This is an information message!</Alert>
    //     <Alert severity="success">This is a success message!</Alert>
    //   </Stack>
    // );
  }

  currentUser = user;

  inputLoginUsername.value = inputLoginPin.value = '';
  // Show UI
  containerApp.style.opacity = 1;
  labelWelcome.textContent = `Hello, ${currentUser.owner.split(' ')[0]}`;
  labelDate.textContent = displayTime(new Date());

  // Update UI
  updateUI(currentUser);
  userLogOut();
});

// Transfer amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let amount = +inputTransferAmount.value;
  let transferTo = accounts.find(acc => acc.userName == inputTransferTo.value);

  if (!transferTo) alert('User no found');
  else if (transferTo.userName == currentUser.userName)
    alert("You cann't transfer yourself");
  else if (amount > parseInt(labelBalance.textContent))
    alert('You have not the amount to transfer');
  else {
    currentUser.movements.push(-amount);
    transferTo.movements.push(amount);

    currentUser.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    inputTransferTo.value = inputTransferAmount.value = '';

    // Update UI
    updateUI(currentUser);
  }
});

//Request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let loan = +inputLoanAmount.value;

  // let isEnough = false;
  // currentUser.movements.forEach(el => {
  //   if (el >= loan * 0.1) isEnough = true;
  // });

  // some / every
  // movements => [200, 450, -400, 3000, -650, -130, 70, 1300]

  let isEnough = currentUser.movements.some(el => el >= loan * 0.1);

  if (!isEnough && loan <= 0) {
    alert("Sorry we can't give you that much!");
    return;
  }

  setTimeout(() => {
    currentUser.movements.push(loan);
    currentUser.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = '';

    // Update UI
    updateUI(currentUser);
  }, 3000);
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  let userName = inputCloseUsername.value;
  let pin = +inputClosePin.value;
  let userIndex = accounts.findIndex(el => el.userName == userName);

  if (
    userIndex == -1 ||
    userName != currentUser.userName ||
    currentUser.pin != pin
  ) {
    alert('Credentials are not correct');
    return;
  }

  accounts.splice(userIndex, 1);
  containerApp.style.opacity = 0;
});

let sort = false;
btnSort.addEventListener('click', function (k) {
  k.preventDefault();

  sort = !sort;
  displayMovements(currentUser, sort);

  console.log(sort);
});

////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////
