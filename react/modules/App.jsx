const React = require('react');
const Nav = require('./Nav');

module.exports = function AppModule(props) {
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
