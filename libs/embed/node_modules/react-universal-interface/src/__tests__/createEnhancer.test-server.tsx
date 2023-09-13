import * as React from 'react';
import {renderToString} from 'react-dom/server';
import {expect} from 'chai';
import render from '../render';
import createEnhancer from '../createEnhancer';

const Parent = (props) => render(props, {foo: 'bar'});
const withParent = createEnhancer(Parent, 'parent');

describe('createEnhancer() SSR', () => {
    it('exists and does not crash', () => {
        expect(typeof createEnhancer).to.equal('function');
    });

    it('renders as expected', () => {
        const Comp = (props) => <div>{props.parent.foo}</div>;
        const CompEnhanced = withParent(Comp);
        const html = renderToString(<CompEnhanced />);

        expect(html).to.equal('<div data-reactroot="">bar</div>');
    });
});
