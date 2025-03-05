export interface DefaultDefinition {
    folderName: string;
}

export interface RouteSpecTsDefinition extends DefaultDefinition {
    url: string;
    ImportInterface: string;
}

export interface RouteTSDefinition extends DefaultDefinition {
    ImportAndInterfaces: string;
    Contents: string;
    Implements: string;
}