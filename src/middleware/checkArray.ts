
const  money =  {
    5 : true,
    10: true,
    20: true,
    50: true,
    100: true
  }
export const  checkArray=(deposit: number): boolean => {
    return deposit in money
}

 