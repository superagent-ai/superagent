import wrapInStatefulComponent from './wrapInStatefulComponent';

const addClassDecoratorSupport = (Comp) => {
    const isSFC = !Comp.prototype;
    return !isSFC ? Comp : wrapInStatefulComponent(Comp);
};

export default addClassDecoratorSupport;
