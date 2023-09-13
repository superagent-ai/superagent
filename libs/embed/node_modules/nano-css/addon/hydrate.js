'use strict';

exports.addon = function (renderer) {
    if (process.env.NODE_ENV !== 'production') {
        require('./__dev__/warnOnMissingDependencies')('hydrate', renderer, ['put']);
    }

    var hydrated = {};

    renderer.hydrate = function (sh) {
        var cssRules = sh.cssRules || sh.sheet.cssRules;

        for (var i = 0; i < cssRules.length; i++)
            hydrated[cssRules[i].selectorText] = 1;
    };

    if (renderer.client) {
        if (renderer.sh) renderer.hydrate(renderer.sh);

        var put = renderer.put;

        renderer.put = function (selector, css) {
            if (selector in hydrated) return;

            put(selector, css);
        };
    }
};
