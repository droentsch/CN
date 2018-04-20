// A data structure indicating which files/directories are copied from src/node_modules to dist/node_modules.
export class NodeLib {
    constructor() { }
    public libs(): Array<any> {
        return [
            {
                'src': 'node_modules/**/*',
                'dest': 'node_modules'
            },
            {
                'src': 'config/**/*',
                'dest': 'config'
            }
        ];
    }
}