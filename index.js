class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }
  get balance() {
    const reducer = (balanceCurr, transObjCurr) => balanceCurr + transObjCurr.value;
    return this.transactions.reduce(reducer, 0);
  }
  addTransaction(transaction) {
    this.transactions.push(transaction);
  }
}

class Transaction {
  constructor(account, amount) {
    this.account = account;
    this.amount = amount;
  }
  commit() {
    /**
     * Because in a function, the THIS keyword refers to the contect in which it is called
     * A Transaction is an abstract class so it will never call this function
     * Instead it is the subclass who is going to call this function
     * Therefore, when the subclass Withdrawl and Deposit call this commit function, the this keyword is going to bind to (refers to) the the WithDrawl class and Deposit Class
     * Because that is where the commit function will be called
     * So it results, this.value will not be undefined
     * But it will be the value defined by the getter below
     * And you dont even have to worry about updating the balance because when we want to retrieve the account will automatically calcualte the balance for us on the fly
     */
    if (this.isAllowed()) {
      this.time = new Date();
      this.account.addTransaction(this);
      return true;
    } else return false;
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
  isAllowed() {
    return (this.account.balance - this.value >= 0);
  }
}

class Deposit extends Transaction {
  isAllowed() {
    return this.value > 0;
  }
  get value() {
    return this.amount;
  }
}

/**
 * The get keyword here is actually very clever
 * it allows one superclass to generalize the fact that there is an amount for all transaction
 * But it determines the value to + or - depending on what kind of transaction it is, and that is done through the get keyword
 * The superclass can then use this.value in the commit function to then again generalize one common commit, but depending on whether withDrawl or Deposit calls the commit methods, it will have different side effect
 */

const myAccount = new Account("snow-patrol");

// DRIVER CODE BELOW
// We use the code below to "drive" the application logic above and make sure it's working as expected
t3 = new Deposit(myAccount, 300);
t3.commit();
console.log('Transaction 3:', t3);

t1 = new Withdrawal(myAccount, 50.25);
t1.commit();
console.log('Transaction 1:', t1);

t2 = new Withdrawal(myAccount, 9.99);
t2.commit();
console.log('Transaction 2:', t2);

console.log(myAccount.balance);
