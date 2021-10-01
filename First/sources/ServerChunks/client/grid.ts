interface Point {
    x: number;
    y: number;
}

export class Chunk {
    private m_x: number;
    public get x(): number {
        return this.m_x;
    }

    private m_y: number;
    public get y(): number {
        return this.m_y;
    }

    private m_start: Point;
    public get start(): Point {
        return this.m_start;
    }

    private m_end: Point;
    public get end(): Point {
        return this.m_end;
    }

    public get name(): string {
        return this.m_x + "_" + this.m_y;
    }

    constructor(start:Point, end:Point, x:number, y:number) {
        this.m_x = x;
        this.m_y = y;
        this.m_start = start;
        this.m_end = end;
    }
}

export class WorldGrid {
    private m_size: number;
    private static instance: WorldGrid;
    private m_chunks: Array<Array<Chunk>>

    public get size(): number {
        return this.m_size;
    }
    
    public set size(value: number) {
        this.m_size = value;
    }

    public static getInstance(): WorldGrid {
        if (!WorldGrid.instance)
            WorldGrid.instance = new WorldGrid(100);

        return WorldGrid.instance;
    }

    public get chunks(): Array<Array<Chunk>> {
        return this.m_chunks;
    }
    
    public static readonly coordsStart: Point = { x: -4000, y: -4000};
    public static readonly coordsEnd: Point = { x: 4500, y: 8000};

    private constructor(chunkSize:number) {
        this.m_size = chunkSize;
        this.m_chunks = new Array();
    }

    /**
     * Spawn  from bottom, left to right row by row
     * **/
    public async spawnGrid() {

        let xChunkNum = 0;
        let yChunkNum = 0;

        let curX = WorldGrid.coordsStart.x;
        let curY = WorldGrid.coordsStart.y;

        let nextY = await this.getNextLayer(yChunkNum, 'y');
        let tmpArr = new Array<Chunk>();

        while (true)
        {
            let nextX = await this.getNextLayer(xChunkNum, 'x');
            tmpArr.push(new Chunk({x:curX, y:curY}, {x:nextX, y:nextY}, xChunkNum, yChunkNum));

            //log(`Chunk N ${xChunkNum}_${yChunkNum}: (${curX},${curY}) -  (${nextX},${nextY})`)
            
            if(nextX == WorldGrid.coordsEnd.x)
            {
                xChunkNum = 0;
                curX = WorldGrid.coordsStart.x;
                WorldGrid.getInstance().chunks.push(tmpArr);
                tmpArr = new Array<Chunk>();
                yChunkNum++;

                curY = nextY;
                if(curY == WorldGrid.coordsEnd.y)
                    break;

                nextY = await this.getNextLayer(yChunkNum, 'y');
            }
            else
            {
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
    private async getNextLayer(chunkNum:number, coord: string) : Promise<number>
    {
        if(coord === 'x' || coord === 'y')
        {
            let layer = WorldGrid.coordsStart[coord]  + this.m_size * ++chunkNum;
            return layer < WorldGrid.coordsEnd[coord] ?  layer :  WorldGrid.coordsEnd[coord];
        }
        throw new Error('Wrong Coords');
    }
}
