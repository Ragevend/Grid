interface Point {
    x: number;
    y: number;
}

export class WorldGrid {
    public static size: number;
    
    //For serverside checks and processing
    //Shared code like thing can be move to shared codebase between server and client
    private static readonly coordsStart: Point = { x: -4000, y: -4000};
    private static readonly coordsEnd: Point = { x: 4500, y: 8000};
}
