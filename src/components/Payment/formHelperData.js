export const statesList = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const getDays = () => {
  let daysArray = []
  for (let i=1; i<=31; i++) {
    daysArray.push(i.toString())
  }
  return daysArray
}

export const days = getDays()

export const getYears = () => {
  let yearsArray = []
  let currentYear = new Date().getFullYear()
  for (let i=currentYear; i>=1950; i--) {
    yearsArray.push(i.toString())
  } 
  return yearsArray
}

export const years = getYears()