export enum Etat {
    BOMBE,
    VIDEBOMBE,
    VIDE
}

export enum Action {
    FLAG,
    SHOW,
    HIDE
}

export type Size = { line: number, col: number }
export type Cell = { etat: Etat, n: number, action: Action }
export type Coordonne = { x: number, y: number }

export class Demineur {

    size: Size;
    arrayCell: Cell[][];

    constructor(size: Size) {
        if (size.line <= 2 || size.col <= 2)
            throw new Error("Bad Request");
        this.size = size;
        this.arrayCell = [];

        this.reset();

    }

    private randomCoord() {
        const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min));
        return {x: randomNumber(0, this.size.line), y: randomNumber(0, this.size.col)};
    }

    private getCell(coord: Coordonne) {
        return this.arrayCell[coord.x][coord.y];
    }

    private static compareCoord(coord1: Coordonne, coord2: Coordonne) {
        return coord1.x === coord2.x && coord1.y === coord2.y;
    }

    private coordAdjacent(coord: Coordonne) {

        const isValidCoord = (coord: Coordonne) => (
            (0 <= coord.x && coord.x < this.size.line) &&
            (0 <= coord.y && coord.y < this.size.col)
        );

        const coordAdjacent = (coord: Coordonne, diffX: number, diffY: number) => ({
            x: coord.x + diffX,
            y: coord.y + diffY
        });

        const diffs = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ];

        return diffs.map(diff => coordAdjacent(coord, diff[0], diff[1]))
            .filter(coord => isValidCoord(coord));
    }


    generateTab(coord0: Coordonne, numberBomb: number) {

        if (
            !(0 <= coord0.x && coord0.x <= this.size.line - 1) ||
            !(0 <= coord0.y && coord0.y <= this.size.col - 1) ||
            !(0 < numberBomb && numberBomb <= (this.size.line * this.size.col - 2))
        ) throw new Error("Bad Request");

        const arrayCoordBomb: Coordonne[] = [];

        for (let i = 0; i < numberBomb; i++) {

            let newCoord: Coordonne;

            do {
                newCoord = this.randomCoord();
            }
            while (
                (arrayCoordBomb.some(it => Demineur.compareCoord(it, newCoord))) ||
                Demineur.compareCoord(newCoord, coord0) ||
                this.coordAdjacent(coord0).some(it => Demineur.compareCoord(it, newCoord))
                );

            this.getCell(newCoord).etat = Etat.BOMBE;

            this.coordAdjacent(newCoord).forEach(coord => {
                this.getCell(coord).n++;
                if (this.getCell(coord).etat !== Etat.BOMBE)
                    this.getCell(coord).etat = Etat.VIDEBOMBE;
            });

            arrayCoordBomb.push(newCoord);

        }

    }

    // false: Game Over, true: sinon
    onClick(action: Action.FLAG | Action.SHOW, coord: Coordonne) {
        if (this.getCell(coord).action === Action.HIDE) {
            if (action === Action.FLAG) {
                this.getCell(coord).action = Action.FLAG;
            } else {
                if (this.getCell(coord).etat === Etat.BOMBE) {
                    return false;
                }
                else if (this.getCell(coord).etat === Etat.VIDEBOMBE)
                    this.getCell(coord).action = Action.SHOW;
                else {
                    this.getCell(coord).action = Action.SHOW;
                    this.deblocVide([coord]);
                }
            }
        } else {
            if (action === Action.FLAG)
                if (this.getCell(coord).action !== Action.SHOW)
                    this.getCell(coord).action = Action.HIDE;
        }
        return true;
    }

    numberFlag() {
        let cpt = 0;
        this.arrayCell.forEach(lineCell => lineCell.forEach(cell => {
            if (cell.action === Action.FLAG) cpt++;
        }));
        return cpt;
    }

    reset() {
        this.arrayCell = [];
        for (let i = 0; i < this.size.line; i++) {
            const lineCell: Cell[] = [];
            for (let j = 0; j < this.size.col; j++)
                lineCell.push({etat: Etat.VIDE, n: 0, action: Action.HIDE});
            this.arrayCell.push(lineCell);
        }
    }

    deblocVide(allEmptyCell: Coordonne[] = []) {
        let _allEmptyCell: Coordonne[] = [];
        allEmptyCell.forEach(c => {
            _allEmptyCell = [
                ..._allEmptyCell,
                ...this.coordAdjacent(c)
                    .filter(c => this.getCell(c).etat === Etat.VIDE)
                    .filter(c => allEmptyCell.every(c1 => !Demineur.compareCoord(c, c1)))
                    .filter(c => _allEmptyCell.every(c1 => !Demineur.compareCoord(c, c1)))
            ];
        });
        if (_allEmptyCell.length === 0) {
            allEmptyCell.forEach(c => {
                this.getCell(c).action = Action.SHOW;
                this.coordAdjacent(c).forEach(c => this.getCell(c).action = Action.SHOW);
            });
            return allEmptyCell;
        }

        this.deblocVide([...allEmptyCell, ..._allEmptyCell]);
    }

    getVictoire() {
        for (let i = 0; i < this.size.line; i++)
            for (let j = 0; j < this.size.col; j++) {
                if (this.arrayCell[i][j].etat !== Etat.BOMBE && this.arrayCell[i][j].action === Action.HIDE)
                    return false;
                if (this.arrayCell[i][j].etat === Etat.BOMBE && this.arrayCell[i][j].action !== Action.FLAG)
                    return false
            }

        return true;
    }
}