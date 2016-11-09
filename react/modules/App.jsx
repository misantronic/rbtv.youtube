import React from 'react';
import Nav from './Nav';

export default function AppModule(props) {
    return (
        <div className="module-app">
            <header>
                <h1>rbtv.youtube</h1>
                <Nav/>
            </header>
            {props.children}
        </div>
    );
}
