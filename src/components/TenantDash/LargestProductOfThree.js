function largestProductOfThree (arr) {
  // power sets of three. 
  var top = -100;
  
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      var two = 0;
      if (i !== j) {
        two = arr[i]*arr[j]
        for (var k = 0; k < arr.length; k++) {
          if (k !== i && k !== j) {
            if (two * arr[k] > top) {
              top = two * arr[k]
            }
          }
        }
      }
    }
  }
  return top
}

console.log(largestProductOfThree([ -5, -1, -3, -2, -4])) // -6
console.log(largestProductOfThree([ 2, 1, 3, 7 ])) //42