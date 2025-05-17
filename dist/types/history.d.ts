/**
 * Changes history manager
 */
export default function history(): {
    _value: any[];
    readonly pop: any;
    readonly previous: any;
    last: any;
    undo(): any;
};
