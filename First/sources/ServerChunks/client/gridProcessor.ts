import {Player, emit, log} from 'alt-client'
import {Chunk, WorldGrid} from './grid'

export class GridProcessor {
    public static curChunk : Chunk

    /**
     * Init curChunk with current player's position
     */
    public static initCurChunk()
    {
        let curPos = Player.local.pos;
        let wg = WorldGrid.getInstance();
        let prevChun = GridProcessor.curChunk
        GridProcessor.curChunk = wg.chunks.at((+curPos.y + Math.abs(WorldGrid.coordsStart.y))/wg.size)?.at((+curPos.x + Math.abs(WorldGrid.coordsStart.x))/wg.size)
                    || new Chunk ({x:1, y:1}, {x:1, y:1},0, 0);

        if(!prevChun)
            emit('enterChunk', GridProcessor.curChunk.name)
    }

    public static updateCurChunk()
    {
        let prevChunk = GridProcessor.curChunk;

        GridProcessor.initCurChunk();

        if(prevChunk.name !== GridProcessor.curChunk.name)
        {
            emit('leftChunk', prevChunk.name);
            emit('enterChunk', GridProcessor.curChunk.name);
        }
    }

    /**
     * Process player's position into chunk representation
     */
    public static processPlayerPos()
    {
        let curPos = Player.local.pos;
    
        let curChunk = GridProcessor.curChunk;
        if(curPos.x < curChunk.start.x || curPos.x > curChunk.end.x ||
            curPos.y < curChunk.start.y || curPos.y > curChunk.end.y)
        {
            //if needed, we can get chunks around
            GridProcessor.updateCurChunk();
        }
    }
}