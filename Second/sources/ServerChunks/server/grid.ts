import { ColshapeRectangle, emitClient, Player, log, on } from "alt-server";
import { readFileSync } from 'fs';

const configFile = 'srvconfig.cfg';

interface Point {
    x: number;
    y: number;
}

export class WorldGrid {
    private readonly m_size: number;

    public get size(): number {
        return this.m_size;
    }
    
    private static readonly coordsStart: Point = { x: -4000, y: -4000};
    private static readonly coordsEnd: Point = { x: 4500, y: 8000};

    constructor() {
        this.m_size = this.processConfig();
        this.spawnGrid();
    }

    private processConfig() : number {
        let size = 100;
        try {
            size = Math.floor(JSON.parse(readFileSync(configFile, 'utf8'))['ChunkSize']) || size;
        } catch (error) {
            log(error);
        }
        return size;
    }

    /** Spawn  from bottom, left to right row by row **/
    private spawnGrid() {

        let xChunkNum = 0;
        let yChunkNum = 0;

        let curX = WorldGrid.coordsStart.x;
        let curY = WorldGrid.coordsStart.y;

        let nextY = this.getNextLayer(yChunkNum, 'y');

        while (true)
        {
            let nextX = this.getNextLayer(xChunkNum, 'x');

            let chunk = new ColshapeRectangle(curX, curY, nextX, nextY);

            chunk.playersOnly = true;
            chunk.setMeta("isWorldChunk", true);
            chunk.setMeta("name", xChunkNum + " _ " + yChunkNum);

            log(`Chunk N ${xChunkNum}_${yChunkNum}: (${curX},${curY}) -  (${nextX},${nextY})`)
            
            if(nextX == WorldGrid.coordsEnd.x)
            {
                xChunkNum = 0;
                curX = WorldGrid.coordsStart.x;
                yChunkNum++;

                curY = nextY;
                if(curY == WorldGrid.coordsEnd.y)
                    break;

                nextY = this.getNextLayer(yChunkNum, 'y');
            }
            else
            {
                curX = nextX;
                xChunkNum++;
            }
        }

        on('entityEnterColshape', (shape, player) => {
            if(shape.hasMeta('isWorldChunk') && player.hasMeta('ready'))
                emitClient(player as Player, 'enterChunk', shape.getMeta('name'));
        });

        on('entityLeaveColshape', (shape, player) => {
            if(shape.getMeta('isWorldChunk')  && player.hasMeta('ready'))
                emitClient(player as Player, 'leftChunk', shape.getMeta('name'));
        });
    }

    /**
     * Returns next layer: vertical(y) or horizontal(x)
     * @param {number} chunkNumber
     * @param {number} coordinate
     * @returns {number}
     */
    private getNextLayer(chunkNum:number, coord: string) : number
    {
        if(coord === 'x' || coord === 'y')
        {
            let layer = WorldGrid.coordsStart[coord]  + this.m_size * ++chunkNum;
            return layer < WorldGrid.coordsEnd[coord] ?  layer :  WorldGrid.coordsEnd[coord];
        }
        throw new Error('Wrong Coords');
    }
}
