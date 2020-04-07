let obj = {};
obj._matchField = [];
//represenst how oftenthe index is represented as value (5 times a level)
const disribution = [
    [6, 15, 3, 1],
    [6, 16, 0, 3],
    [6, 14, 5, 0],
    [6, 15, 2, 2],
    [6, 15, 4, 1]
];
let ran5 = () => Math.floor(Math.random() * 5);
let placeAtRandom = (e) => {
    let x = ran5();
    let y = ran5();
    let i = 0;
    let found = false;
    //start at random point and from there liniar search
    while (i < 25 && !found) {
        if (obj._matchField[y][x] ==== 1) {
            found = true;
            obj._matchField[y][x] = e;
        }
        x++;
        if (x > 4) {
            x = 0;
            y++;
        }
        if (y > 4) {
            y = 0
        }
        i++;
    }
    //console.log(i < 25 ? `placed ${e} at x${x}y${y}` : "ran out")
}
obj.newGame = (level) => {
    for (let i = 0; i < 5; i++) {
        obj._matchField[i] = [1, 1, 1, 1, 1];
    }
    //0 bases index
    level -= 1;
    //5 versions per level
    level *= 5;
    //pick one distribution
    level += ran5();
    let choosenDistribution = disribution[level];
    for (let i = 0; i < 5; i++) {
        //1's are already pre filled
        if (i != 1) {
            for (let j = 0; j < choosenDistribution[i]; j++) {
                //fill i j times in the field
                placeAtRandom(i);
            }
        }
    }
}
obj.getRowPoints = (y) => {
    y -= 1;
    return obj._matchField[y].reduce((acc, e) => acc + e, 0);
};
obj.getRowTraps = (y) => {
    y -= 1;
    return obj._matchField[y].reduce((acc, e) => acc + (e === 0 ? 1 : 0), 0);
};
obj.getColumnPoints = (x) => {
    x -= 1;
    return obj._matchField.reduce((acc, e) => acc + e[x], 0);
};
obj.getColumnTraps = (x) => {
    x -= 1;
    return obj._matchField.reduce((acc, e) => acc + (e[x] === 0 ? 1 : 0), 0);
};

module.exports = obj;