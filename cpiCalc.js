"use strict";
//blame atom i perfer 4 space tabs not 1 space
$(document).ready(function(){
  $("#salary2015").keyup(function(){
    $("#taxCurrent").text( "Tax: \n$" + calcTax(2015, $("#salary2015").val()));
    $("#ETR").text("Current Effective Tax Rate:\n" + (Math.round( calcTax(2015, $("#salary2015").val()) / $("#salary2015").val() * 1000)/10) + "%");
    updateInflation();
  });
});
let cpi = JSON.parse('{"1950":9.834730290,"1960":8.007331081,"1970":6.108685567,"1980":2.876419903,"2015": 1}');
let taxRate2016 = [[9225, .10], [37450, .15], [90750, .25], [189300, .33],  [411500, .35], [413200, 39.6]];
let taxRate2015 = [[9075, .10], [36900, .15, 907.50], [89350, .25, 5081.25], [186350, .28, 18193.75],  [405100, .33, 45353.75], [406750, .35, 117541.25], [406751, .396, 118118.75]];
let taxRate1950 = [[2000, .20], [4000, .22], [6000, .3], [8000, .34], [10000, .38], [12000, .43], [14000, .47], [16000, .5], [18000, .53], [20000, .56], [22000, .59], [26000, .62], [32000, .65], [38000, .69], [44000, .72], [50000, .75], [60000, .78], [70000, .81], [80000, .84], [90000, .87], [100000, .89], [150000, .9] , [200000, .91]];
let taxRate1970 = [[500, .14], [100, .15] , [1500, .16], [2000, .17], [4000, .19], [6000, .22], [8000, .25], [10000, .28], [12000, .32], [14000, .36], [16000, .39], [18000, .42], [20000, .45], [22000, .5], [26000, .53], [32000, .55], [38000, .58], [44000, .60], [50000, .62], [60000, .64], [70000, .66], [80000, .68], [90000, .69], [100000, .7]];
let taxRate1960 = taxRate1970;
let taxRate1980 = [[1700, 0], [2750, .14], [3800, .16], [5950, .18], [8000, .21], [10100, .24], [12300, .28], [14950, .32], [17600, .37], [22900, .43], [30000, .49], [42800, .54], [54700, .59], [81200, .64], [107700, .68], [107701, .7]];
function calcSalary(year, amt){
  return Math.round(amt/cpi[year.toString()]*100)/100;
}
function calcGraduated(rate, inc){
  let taxGrad = rate[0][1]*rate[0][0];
  let temp = 0;
  for(let i = 0; i < rate.length; i++){
    if(inc < rate[i][0]){
      temp = i;
      break;
    }
    else{
      temp = rate.length - 1;
    }
  }
  for(let i = 1; i <= temp; i++){
    taxGrad+=(rate[i][0]-rate[i-1][0])*rate[i][1];
  }
    return taxGrad;
}

function updateInflation(){
  var dat = "1950,1960,1970,1980".split(',');
  var salary;
  var tax;
  var etr;
  // if( !(dat.join('').match('[^0-9]') === null) ){
  //   alert("Invalid characters. Use only the dates 1914-2016, commas, and spaces");
  //   return;
  // }
  $("#salaries").empty();
  $("#years").empty();
  $("#taxes").empty();
  $("#ETRYears").empty();
  for(let i of dat){
    salary = calcSalary(i, $("#salary2015").val());
    tax = calcTax(i, salary);
    etr = Math.round( tax / salary * 1000)/10;
    $("#years").append("<h5 style='padding-top:1em;'>" + i + " :</h5>");
    $("#salaries").append("<h5 style='padding-top:1em;'> $" + beutify(salary) + " </h5>");
    $("#taxes").append("<h5 style='padding-top:1em;'> $" +  beutify(tax) + " </h5>");
    $("#ETRYears").append("<h5 style='padding-top:1em;'>" + beutify(etr) + "% </h5>");
  }
}

function calcTax(year, amt){
  let rate = eval("taxRate" + year);
    for(var i = rate.length; i--; i>=0){
      if(amt <= rate[0][0] ) return Math.trunc(amt*rate[0][1] * 100)/100;
      if(amt >= rate[i][0]){
         return Math.round((calcGraduated(rate, amt) + rate[i][1]*(amt  -  rate[i][0]))*100)/100;
         break;
       }
    }
  }

  function beutify(num){
    return num.toLocaleString('en-US', {minimumFractionDigits: 2})
  }
