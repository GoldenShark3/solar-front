import {ObjectStatus} from "./ObjectStatus";

export class BasicObjectView {
    id: number = null;
    planet: number = null;
    population: number = null;
    fraction: string = null;
    title: string = null;
    x: number = null;
    y: number = null;
    aphelion: number = null;
    orbitalPeriod: number = null;
    angle: number = null;
    rotationAngle: number = null;
    hullId: number = null;
    active: boolean = null;
    durability: number = null;
    attachedToShip: number = null;
    attachedToSocket: number = null;
    status: ObjectStatus = null;
    speedX: number = null;
    speedY: number = null;
    accelerationX: number = null;
    accelerationY: number = null;
    positionIterationTs: number = null;
    clockwiseRotation: boolean = null;
    volume: number = null;
    energyConsumption: number = null;
    isEnabled: boolean = null;
    modificationId: number = null;


    constructor(id: number) {
        this.id = id;
    }
}