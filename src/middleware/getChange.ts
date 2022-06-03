

export const getChange = (remain: number) => {
    let changes = [100, 50, 25, 10, 5]
    let all_changes: number[] = []
    for (let index in changes) {


        let num = Math.floor(remain / changes[index])
        if (num > 0) {

            for (let j = 0; j < num; j++) {
                all_changes.push(changes[index])
            }
        }
        remain -= changes[index] * num
    }
    return all_changes
}
