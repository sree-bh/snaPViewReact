'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var Hello = React.createClass({
    render: function() {
        return <h2>Hello {this.props.name}</h2>;
    }
});
 
ReactDOM.render(
	<Hello name="World" />,
    document.getElementById('container')
);
