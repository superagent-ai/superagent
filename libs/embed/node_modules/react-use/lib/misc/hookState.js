"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHookState = void 0;
function resolveHookState(nextState, currentState) {
    if (typeof nextState === 'function') {
        return nextState.length ? nextState(currentState) : nextState();
    }
    return nextState;
}
exports.resolveHookState = resolveHookState;
