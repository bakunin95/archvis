
var cash = 0.95;
for(count = 100; count < 1405; count=count+5){
cash = cash + 0.05;
cash = Math.round(cash * 1000) / 1000;
console.log(count+":"+cash+",")
}