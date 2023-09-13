var defaultMapPropsToArgs = function (props) { return [props]; };
export default function createRenderProp(hook, mapPropsToArgs) {
    if (mapPropsToArgs === void 0) { mapPropsToArgs = defaultMapPropsToArgs; }
    return function RenderProp(props) {
        var state = hook.apply(void 0, mapPropsToArgs(props));
        var children = props.children, _a = props.render, render = _a === void 0 ? children : _a;
        return render ? render(state) || null : null;
    };
}
