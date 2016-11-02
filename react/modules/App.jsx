import React from 'react';
import Nav from './Nav';

export default function App(props) {
    return (
        <div>
            <h1>rbtv.youtube</h1>
            <Nav/>
            {props.children}
        </div>
    );
};
