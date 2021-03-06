import * as alt from "alt-server";
let cmdHandlers = {};
function invokeCmd(player, cmd, args) {
    cmd = cmd.toLowerCase();
    const callback = cmdHandlers[cmd];
    if (callback) {
        callback(player, args);
    }
    else {
        send(player, `{FF0000} Unknown command /${cmd}`);
    }
}
alt.onClient("chat:message", (player, msg) => {
    if (msg[0] === "/") {
        msg = msg.trim().slice(1);
        if (msg.length > 0) {
            alt.log("[chat:cmd] " + player.name + ": /" + msg);
            let args = msg.split(" ");
            let cmd = args.shift();
            invokeCmd(player, cmd, args);
        }
    }
    else {
        msg = msg.trim();
        if (msg.length > 0) {
            alt.log("[chat:msg] " + player.name + ": " + msg);
            alt.emitClient(null, "chat:message", player.name, msg.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34"));
        }
    }
});
export function send(player, msg) {
    alt.emitClient(player, "chat:message", null, msg);
}
export function registerCmd(cmd, callback) {
    cmd = cmd.toLowerCase();
    if (cmdHandlers[cmd] !== undefined) {
        alt.logError(`Failed to register command /${cmd}, already registered`);
    }
    else {
        cmdHandlers[cmd] = callback;
    }
}
