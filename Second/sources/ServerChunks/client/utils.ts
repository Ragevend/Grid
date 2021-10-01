import * as alt from 'alt-client';
import * as natives from 'natives'

export function initClient(){
    alt.onServer('leftChunk', (name: string) => {
        notify(`Left chunk ${name}`);
    })
    
    alt.onServer('enterChunk', (name: string) => {
        notify(`Entered chunk ${name}`);
    })
    
    alt.on('connectionComplete', () => {
        alt.setTimeout(() => { //ok for testing purposes, better way in clientside version
            alt.emitServer('playerReady');
        }, 1000);
    });
}


/** Simple notification above the minimap
* @param {string} Message
**/
function notify(msg: string)
{
    natives.beginTextCommandThefeedPost('STRING');
    natives.addTextComponentSubstringPlayerName(msg);
    natives.endTextCommandThefeedPostMessagetextTu(
        "CHAR_SOCIAL_CLUB",
        "CHAR_SOCIAL_CLUB",
        false,
        2,
        msg,
        '',
        0.5
    );
    natives.endTextCommandThefeedPostTicker(false, false);
}