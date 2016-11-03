import React from 'react';
import Nav from './Nav';

export default function App(props) {
    return (
        <div className="module-app">
            <h1>rbtv.youtube</h1>
            <Nav/>
            {props.children}
        </div>
    );
}
