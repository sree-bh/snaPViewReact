'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    lastSnap,
    ssInterval;

var basePath = 'resources/gallery/',
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

var NewSlide = React.createClass({
	  render: function() {

	      return <div className={'slide-container ' + this.props.data.cls}>
				  <div style={{backgroundImage: 'url(' + this.props.data.path + ')'}}
					className="slide"></div>
			  </div>;
	  }
});

var SnapViewer = React.createClass({
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
		if (this.pause()) {
			return;
		}
		
		this.setState({action: 'Pause'});
		ssInterval = setInterval(this.fnslideShow, 5000);
	},
	next: function (event) {
		this.fnslideShow(true);
	},
	pause: function () {
		if (!!ssInterval) {
			clearInterval(ssInterval);
			ssInterval = null;
			this.setState({action: 'Play'});
			
			return true;
		}
	},
	fnslideShow: function (stopSS, isPrev) {
		
		if (stopSS) {
			this.pause();
		}
		
		if (this.state.animationProgress) {
			return;
		}
		
		this.setState({animationProgress: true});
		
		if (isPrev) {
			setTimeout(function () {
				this.props.snData[this.state.prevIdx].cls = 'animate shown';
				this.props.snData[this.state.currentIdx].cls = 'next';
				this.props.snData[this.state.nextIdx].cls = '';
				this.setState({nextIdx: this.state.currentIdx});
				this.setState({currentIdx: this.state.prevIdx});
				this.setState({prevIdx: (this.state.currentIdx === 0 ?
						lastSnap: this.state.prevIdx - 1)});
			}.bind(this), 1);
		} else {
			setTimeout(function () {
				this.props.snData[this.state.prevIdx].cls = '';
				this.props.snData[this.state.currentIdx].cls = 'animate shown left';
				this.setState({prevIdx: this.state.currentIdx});
				this.setState({currentIdx: this.state.nextIdx});
				this.setState({nextIdx: (this.state.currentIdx === lastSnap ?
						lastSnap: this.state.nextIdx + 1)});
			}.bind(this), 1);
		}

		// on animation complete
		setTimeout(function () {
			this.props.snData[this.state.prevIdx].cls = 'left';
			this.props.snData[this.state.currentIdx].cls = 'shown';
			this.props.snData[this.state.nextIdx].cls = 'next';
			this.setState({animationProgress: false});
		}.bind(this), 1500);
	},
	render: function() {
		return <div>
					<div className="controls">
						<button onClick={this.prev}>&lt;</button>
						<button onClick={this.slideShow}>
							Slide Show {this.state.action}
						</button>
						<button onClick={this.next}>&gt;</button>
					</div>
			   		{this.props.snData.map(function(item) {
			   			return <NewSlide key={arguments[1]} data={item} />;
			   		})}
			  </div>;
	}
});

ReactDOM.render(
	<SnapViewer snData={snapList} />,
    document.getElementById('snapContainer')
);
