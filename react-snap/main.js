'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    lastSnap,
    ssInterval;

var basePath = '../resources/gallery/',
    snapList = [
        {
        	path: basePath + 'Koala.jpg',
        	cls: 'shown',
        },
        {
        	path: basePath + 'Chrysanthemum.jpg',
        	cls: 'next',
        },
    	{
        	path: basePath + 'Desert.jpg',
        	cls: '',
        },
    	{
        	path: basePath + 'Penguins.jpg',
        	cls: '',
        },
    	{
        	path: basePath + 'Tulips.jpg',
        	cls: '',
        },
    	{
        	path: basePath + 'Lighthouse.jpg',
        	cls: 'left'
        }
    ];

var newSlide = React.createClass({
	  render: function() {
	      console.log(this.props);

	      return <div class="slide-container {this.props.data.cls}">
				  <div style="background-image: url({this.props.data.path});"
					class="slide"></div>
			  </div>;
	  }
});

var snapViewer = React.createClass({
	getInitialState: function () {
		lastSnap = this.props.snData.length - 1;

		return {
			action: 'Play',
			animationProgress: false,
			currentIdx: 0,
			nextIdx: 1,
			prevIdx: lastSnap
		};
    },
    prev: function (event) {
    	this.fnslideShow(true, true);
	},
	slideShow: function (event) {
		fnslideShow(true);
	},
	next: function (event) {
		this.fnslideShow(true);
	},
	fnslideShow: function (stopSS, isPrev) {
		
		if (stopSS) {
			pause();
		}
		
		if (this.state.animationProgress) {
			return;
		}
		
		this.state.animationProgress = true;
		
		if (isPrev) {
			setTimeout(function () {
				this.props.snData[this.state.prevIdx].cls = 'animate shown';
				this.props.snData[this.state.currentIdx].cls = 'next';
				this.props.snData[this.state.nextIdx].cls = '';
				this.state.nextIdx = this.state.currentIdx;
				this.state.currentIdx = this.state.prevIdx;
				this.state.prevIdx = (this.state.currentIdx === 0 ?
						lastSnap: this.state.prevIdx - 1);
			}.bind(this), 1);
		} else {
			setTimeout(function () {
				this.props.snData[this.state.prevIdx].cls = '';
				this.props.snData[this.state.currentIdx].cls = 'animate shown left';
				this.state.prevIdx = this.state.currentIdx;
				this.state.currentIdx = this.state.nextIdx;
				this.state.nextIdx = (this.state.currentIdx === lastSnap ?
						0: this.state.nextIdx + 1);
			}.bind(this), 1);
		}

		// on animation complete
		setTimeout(function () {
			this.props.snData[this.state.prevIdx].cls = 'left';
			this.props.snData[this.state.currentIdx].cls = 'shown';
			this.props.snData[this.state.nextIdx].cls = 'next';
			this.state.animationProgress = false;
		}.bind(this), 1500);
	},
	render: function() {
		return <div>
					<div class="controls">
						<button onClick={this.prev}>&lt;</button>
						<button onClick={this.slideShow}>
							Slide Show {this.state.action}
						</button>
						<button onClick={this.next}>&gt;</button>
					</div>
			   		{this.props.snData.map(function(item) {
			   			return <newSlide key={result.id} data={item} />;
			   		})}
			  </div>;
	}
});

ReactDOM.render(
	<snapViewer snData={snapList} />,
    document.getElementById('snapContainer')
);
