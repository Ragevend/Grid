export class Chunk {
    m_x;
    get x() {
        return this.m_x;
    }
    m_y;
    get y() {
        return this.m_y;
    }
    m_start;
    get start() {
        return this.m_start;
    }
    m_end;
    get end() {
        return this.m_end;
    }
    get name() {
        return this.m_x + "_" + this.m_y;
    }
    constructor(start, end, x, y) {
        this.m_x = x;
        this.m_y = y;
        this.m_start = start;
        this.m_end = end;
    }
}
export class WorldGrid {
    m_size;
    static instance;
    m_chunks;
    get size() {
        return this.m_size;
    }
    set size(value) {
        this.m_size = value;
    }
    static getInstance() {
        if (!WorldGrid.instance)
            WorldGrid.instance = new WorldGrid(100);
        return WorldGrid.instance;
    }
    get chunks() {
        return this.m_chunks;
    }
    static coordsStart = { x: -4000, y: -4000 };
    static coordsEnd = { x: 4500, y: 8000 };
    constructor(chunkSize) {
        this.m_size = chunkSize;
        this.m_chunks = new Array();
    }
    /**
     * Spawn  from bottom, left to right row by row
     * **/
    async spawnGrid() {
        let xChunkNum = 0;
        let yChunkNum = 0;
        let curX = WorldGrid.coordsStart.x;
        let curY = WorldGrid.coordsStart.y;
        let nextY = await this.getNextLayer(yChunkNum, 'y');
        let tmpArr = new Array();
        while (true) {
            let nextX = await this.getNextLayer(xChunkNum, 'x');
            tmpArr.push(new Chunk({ x: curX, y: curY }, { x: nextX, y: nextY }, xChunkNum, yChunkNum));
            //log(`Chunk N ${xChunkNum}_${yChunkNum}: (${curX},${curY}) -  (${nextX},${nextY})`)
            if (nextX == WorldGrid.coordsEnd.x) {
                xChunkNum = 0;
                curX = WorldGrid.coordsStart.x;
                WorldGrid.getInstance().chunks.push(tmpArr);
                tmpArr = new Array();
                yChunkNum++;
                curY = nextY;
                if (curY == WorldGrid.coordsEnd.y)
                    break;
                nextY = await this.getNextLayer(yChunkNum, 'y');
            }
            else {
                curX = nextX;
                xChunkNum++;
            }
        }
    }
    /**
     * Returns next layer: vertical(y) or horizontal(x)
     * @param {number} chunkNumber
     * @param {number} coordinate
     * @returns {number}
     */
    async getNextLayer(chunkNum, coord) {
        if (coord === 'x' || coord === 'y') {
            let layer = WorldGrid.coordsStart[coord] + this.m_size * ++chunkNum;
            return layer < WorldGrid.coordsEnd[coord] ? layer : WorldGrid.coordsEnd[coord];
        }
        throw new Error('Wrong Coords');
    }
}
