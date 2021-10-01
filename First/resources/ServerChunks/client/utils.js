import * as alt from 'alt-client';
import * as natives from 'natives';
import { WorldGrid } from './grid';
import { GridProcessor } from './gridProcessor';
export function initClient() {
    alt.onServer('getReady', async (chunkSize, pos) => await preparePlayer(chunkSize, pos));
}
async function preparePlayer(chunkSize, pos) {
    let wg = WorldGrid.getInstance();
    wg.size = chunkSize;
    wg.spawnGrid();
    const spawnCheck = alt.everyTick(() => {
        if (alt.Player.local.pos.distanceTo(new alt.Vector3(0, 0, 0)) != 0)
            alt.emit('playerSpawned');
    });
    alt.once('playerSpawned', () => {
        alt.clearEveryTick(spawnCheck);
        GridProcessor.initCurChunk();
        alt.on('leftChunk', (msg) => notify("Left chunk " + msg));
        alt.on('enterChunk', (msg) => notify("Entered chunk " + msg));
        alt.onServer('updateCurChunk', GridProcessor.updateCurChunk);
        alt.everyTick(drawBoundaries);
        alt.everyTick(GridProcessor.processPlayerPos);
    });
}
/**
 * Simple notification above the minimap
 * @param {string} Message
 */
function notify(msg) {
    natives.beginTextCommandThefeedPost('STRING');
    natives.endTextCommandThefeedPostMessagetextTu("CHAR_SOCIAL_CLUB", "CHAR_SOCIAL_CLUB", false, 2, msg, '', 0.5);
    natives.endTextCommandThefeedPostTicker(false, false);
}
function drawBoundaries() {
    let playerPos = alt.Player.local.pos;
    let curChunk = GridProcessor.curChunk;
    natives.drawBox(curChunk.start.x, curChunk.start.y, playerPos.z - 0.5, curChunk.end.x, curChunk.end.y, playerPos.z + 0.1, 0, 255, 0, 64);
}
