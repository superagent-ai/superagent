# react-universal-interface

Easily create a component which is render-prop, Function-as-a-child and component-prop.

```js
import {render} from 'react-universal-interface';

class MyData extends React.Component {
    render () {
        return render(this.props, this.state);
    }
}
```

Now you can use it:

```jsx
<MyData render={(state) =>
    <MyChild {...state} />
} />

<MyData>{(state) =>
    <MyChild {...state} />
}</MyData>

<MyData comp={MyChild} />
<MyData component={MyChild} />
```

---

[![][npm-badge]][npm-url] [![][travis-badge]][travis-url] [![React Universal Interface](https://img.shields.io/badge/React-Universal%20Interface-green.svg)](https://github.com/streamich/react-universal-interface)

Use this badge if you support universal interface:

<div align="center">
    <a href="https://github.com/streamich/react-universal-interface">
        <img src="https://img.shields.io/badge/React-Universal%20Interface-green.svg" />
    </a>
</div>

```
[![React Universal Interface](https://img.shields.io/badge/React-Universal%20Interface-green.svg)](https://github.com/streamich/react-universal-interface)
```


---


Given a `<MyData>` component, it is said to follow **universal component interface** if, and only if, it supports
all the below usage patterns:

```jsx
// Function as a Child Component (FaCC)
<MyData>{
    (data) => <Child {...data} />
}</MyData>

// Render prop
<MyData render={
    (data) => <Child {...data} />
} />

// Component prop
<MyData component={Child} />
<MyData comp={Child} />

// Prop injection
<MyData>
    <Child />
</MyData>

// Higher Order Component (HOC)
const ChildWithData = withData(Child);

// Decorator
@withData
class ChildWithData extends {
    render () {
        return <Child {...this.props.data} />;
    }
}
```

This library allows you to create universal interface components using these two functions:

- `render(props, data)`
- `createEnhancer(Comp, propName)`

First, in your render method use `render()`:

```js
class MyData extends Component {
    render () {
        return render(this.props, data);
    }
}
```

Second, create enhancer out of your component:

```js
const withData = createEnhancer(MyData, 'data');
```

Done!


## Installation

<pre>
npm i <a href="https://www.npmjs.com/package/react-universal-interface">react-universal-interface</a> --save
</pre>


## Usage

```js
import {render, createEnhancer} from 'react-universal-interface';
```


## Reference

### `render(props, data)`

- `props` &mdash; props of your component.
- `data` &mdash; data you want to provide to your users, usually this will be `this.state`.


### `createEnhancer(Facc, propName)`

- `Facc` &mdash; FaCC component to use when creating enhancer.
- `propName` &mdash; prop name to use when injecting FaCC data into a component.

Returns a component enhancer `enhancer(Comp, propName, faccProps)` that receives three arguments.

- `Comp` &mdash; required, component to be enhanced.
- `propName` &mdash; optional, string, name of the injected prop.
- `faccProps` &mdash; optional, props to provide to the FaCC component.


## TypeScript

TypeScript users can add typings to their render-prop components.

```ts
import {UniversalProps} from 'react-universal-interface';

interface Props extends UniversalProps<State> {
}

interface State {
}

class MyData extends React.Component<Props, State> {
}
```


## License

[Unlicense](./LICENSE) &mdash; public domain.


[npm-url]: https://www.npmjs.com/package/react-universal-interface
[npm-badge]: https://img.shields.io/npm/v/react-universal-interface.svg
[travis-url]: https://travis-ci.org/streamich/react-universal-interface
[travis-badge]: https://travis-ci.org/streamich/react-universal-interface.svg?branch=master
