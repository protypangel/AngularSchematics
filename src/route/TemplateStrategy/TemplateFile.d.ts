export interface RouteSpecTsDefinition {
    readonly ImportInterface: string;
    readonly Contents: string;
    readonly url: string;
}
export interface RouteTSDefinition {
    readonly ImportAndInterfaces: string;
    readonly Contents: string;
    readonly Implements: string;
}
export interface DefaultDefinition {
    readonly folderName: string;
}