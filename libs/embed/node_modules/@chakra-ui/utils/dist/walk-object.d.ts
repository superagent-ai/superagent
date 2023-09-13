declare type WalkObjectPredicate<Leaf = unknown> = (value: unknown, path: string[]) => Leaf;
declare type MappedLeavesObject<Obj, LeafType> = {
    [Prop in keyof Obj]: Obj[Prop] extends Array<any> ? MappedLeavesObject<Obj[Prop][number], LeafType>[] : Obj[Prop] extends object ? MappedLeavesObject<Obj[Prop], LeafType> : LeafType;
};
declare function walkObject<Target, LeafType>(target: Target, predicate: WalkObjectPredicate<LeafType>): MappedLeavesObject<Target, ReturnType<WalkObjectPredicate<LeafType>>>;

export { MappedLeavesObject, WalkObjectPredicate, walkObject };
