import * as chat from './chat'
import { Player, Vector3, on, emitClient, nextTick, onClient} from 'alt-server'
import { WorldGrid } from './grid';
import { onceServer } from 'alt-client';

export class Utils {

    /**
     * Simple commandHandler for teleport
     * @param {Player} player 
     * @param {string} newPos
     */
    static playerTP(player: Player, newPos: string [])
    {
        player.pos = new Vector3(parseInt(newPos[0]), parseInt(newPos[1]), parseInt(newPos[2]));
    }

    /**
     * Simple commandHandler  for getting player's position
     * @param {Player} player 
     */
    static playerPos(player: Player)
    {
        chat.send(player, `Your position: (${player.pos.x},${player.pos.y},${player.pos.z})`)
    }

    static initServer() {
        let gr = new WorldGrid();
        chat.registerCmd('tp', Utils.playerTP);
        chat.registerCmd('pos', Utils.playerPos);

        on('playerConnect', (player) => {
            player.spawn(-1317, 85, 55, 15);
            player.model = 'mp_f_freemode_01';
            emitClient(player, 'isReady');
        });

        onClient('playerReady', (player) => {
            player.setMeta('ready', true);
        })
    }
}


