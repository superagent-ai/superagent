import * as React from 'react';
import {renderToString} from 'react-dom/server';
import {expect} from 'chai';
import render from '../render';

const Parent = (props) => render(props, {foo: 'bar'});

describe('render() SSR', () => {
    it('exists and does not crash', () => {
        expect(typeof render).to.equal('function');
    });

    it('renders as expected', () => {
        const html = renderToString(
            <Parent>
                <div>foobar</div>
            </Parent>
        );

        expect(html).to.equal('<div data-reactroot="">foobar</div>');
    });
});
