import React from 'react';

export default function ThumbComponent(props) {
    const labelLeft = props.labelLeft || '';
    const labelRight = props.labelRight || '';
    const badge = props.badge || '';

    return (
        <div className="thumbnail">
            <a className="link" href={props.link}>
                <img className="thumb" src={props.image}/>
                {labelLeft}
                {labelRight}
            </a>
            <div className="caption">
                <h3 className="title">
                    <a className="link" href={props.link}>{props.title}</a>
                    {badge}
                </h3>
                <p className="description">{props.description}</p>
            </div>
            {props.children}
        </div>
    );
}
