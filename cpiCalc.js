"use strict";
//blame atom i perfer 4 space tabs not 1 space
$(document).ready(function(){
  $("#salary2015").keyup(function(){
    if($("#salary2015").val() > 0){
      $("#taxCurrent").text( "Tax: \n$" + calcTax(2015, $("#salary2015").val()));
      $("#ETR").text("Current Effective Tax Rate:\n" + (Math.round( calcTax(2015, $("#salary2015").val()) / $("#salary2015").val() * 1000)/10) + "%");
      updateInflation();
    }
  });
});
let cpi = JSON.parse('{"1950":9.834730290,"1960":8.007331081,"1970":6.108685567,"1980":2.876419903,"2015": 1}');
let taxRate1950 = [[2000, .174], [4000, .2002], [6000, .2366], [8000, .273], [10000, .3094], [12000, .3458], [14000, .3913], [16000, .4277], [18000, .455], [20000, .4823], [22000, .5096], [26000, .5369], [32000, .5642], [38000, .5915], [44000, .6279], [50000, .6552], [60000, .6825], [70000, .70098], [80000, .7371], [90000, .7644], [100000, .7917], [136719, .8099] , [150000, .82503], [200000, .83430], [200001, .84357]];
let taxRate1960 = [[2000, .2],[4000, .22],[6000, .26],[8000, .3],[10000, .34], [12000, .38], [14000, .43], [16000, .47], [18000, .5], [20000, .53], [22000, .56], [26000, .59], [32000, .62], [38000, .65], [44000, .69], [50000, .72], [60000, .75], [70000, .78], [80000, .81], [90000, .84], [100000, .87], [150000, .89], [200000, .9], [200001, .91]];
let taxRate1970 = [[500, .14], [1000, .15], [1500, .164], [2000, .17425], [4000, .19475], [6000, .2255], [8000, .25625], [10000, .287], [12000, .328], [14000, .369], [16000, .39975], [18000, .4305], [20000, .46125], [22000, .492], [26000, .5125], [32000, .54325], [38000, .56375], [44000, .5945], [50000, .6150], [60000, .6355], [70000, .656], [80000, .6765], [90000, .697], [100000, .7725], [100001, .7175]];
let taxRate1980 = [[1700, 0], [2750, .14], [3800, .16], [5950, .18], [8000, .21], [10100, .24], [12300, .28], [14950, .32], [17600, .37], [22900, .43], [30000, .49], [42800, .54], [54700, .59], [81200, .64], [107700, .68], [107701, .7]];
let taxRate2015 = [[9075, .10], [36900, .15, 907.50], [89350, .25, 5081.25], [186350, .28, 18193.75],  [405100, .33, 45353.75], [406750, .35, 117541.25], [406751, .396, 118118.75]];
let taxRate2016 = [[9225, .10], [37450, .15], [90750, .25], [189300, .33],  [411500, .35], [413200, 39.6]];
function calcSalary(year, amt){
  return Math.round(amt/cpi[year.toString()]*100)/100;
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
  if(amt >= rate[rate.length-1][0]){return Math.round((calcGraduated(rate, amt) + rate[rate.length-1][1] * (amt  -  rate[rate.length-1][0]) ) *100 ) / 100;}
  if(amt <= rate[0][0] ) return Math.trunc(amt*rate[0][1] * 100)/100;
    for(var i = rate.length; i--; i>=0){
      if(amt >= rate[i][0]){
         return Math.round((calcGraduated(rate, amt) + rate[i+1][1] * (amt  -  rate[i][0]) ) *100 ) / 100;
       }
    }
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
    for(let i = 1; i < temp; i++){
      taxGrad+= ( rate[i][0] - rate[i-1][0] ) * rate[i][1];
    }
      return taxGrad;
  }
  function beutify(num){
    return num.toLocaleString('en-US', {minimumFractionDigits: 2})
  }
