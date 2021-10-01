import * as chat from './chat'
import { Player, Vector3, on, emitClient, log, onClient} from 'alt-server'
import { WorldGrid } from './grid';
import { onceServer } from 'alt-client';
import { readFileSync } from 'fs';

const configFile = 'srvconfig.cfg';
const spawnPoint = new Vector3(-1317, 85, 55);

export class Utils {
    /**
     * Simple commandHandler for teleport
     * @param {Player} player 
     * @param {string} newPos
     */
    static playerTP(player: Player, newPos: string [])
    {
        player.pos = new Vector3(parseInt(newPos[0]), parseInt(newPos[1]), parseInt(newPos[2]));
        emitClient(player, 'updateChunk');
    }

    /**
     * Simple commandHandler  for getting player's position
     * @param {Player} player 
     */
    static playerPos(player: Player)
    {
        chat.send(player, `Your position: (${player.pos.x},${player.pos.y},${player.pos.z})`)
    }

    private static processConfig() : number {
        let size = 100;

        try {
            size = Math.floor(JSON.parse(readFileSync(configFile, 'utf8'))['ChunkSize']) || 5;
        } catch (error) {
            log(error);
        }

        return size;
    }

    static initServer() {
        WorldGrid.size = Utils.processConfig();

        chat.registerCmd('tp', Utils.playerTP);
        chat.registerCmd('pos', Utils.playerPos);

        on('playerConnect', (player) => {
            player.spawn(spawnPoint, 0);
            player.model = 'mp_f_freemode_01';
            emitClient(player, 'getReady', WorldGrid.size, spawnPoint);
        });
    }
}