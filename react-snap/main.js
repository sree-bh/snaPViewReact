'use strict';


var ReactRouter = require('react-router'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link,
    History = ReactRouter.History,
    IndexRoute = ReactRouter.IndexRoute,
    history = require('history'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    lastSnap,
    ssInterval,
    basePath = 'resources/gallery/',
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

var AppHistory = history.useBasename(history.createHistory)({
    basename: ''
});

var NewSlide = React.createClass({
	  render: function() {

	      return <Link to={(this.props.state).toString()}>
      				<div className={'slide-container ' + this.props.data.cls}>
      					<div style={{backgroundImage: 'url(' + this.props.data.path + ')'}}
      						className="slide"></div>
					</div>
				</Link>;
	  }
});

var SnapViewer = React.createClass({
	mixins: [ History ],
	getStateFromStore: function (props) {
		var currentIdx = props ? +props.params.id - 1 : 0;

		lastSnap = snapList.length - 1;

		return {
			snData: snapList,
			action: 'Play',
			animationProgress: false,
			currentIdx: currentIdx,
			nextIdx: (currentIdx === lastSnap ? 0 : currentIdx + 1),
			prevIdx: (currentIdx === 0 ? lastSnap : currentIdx - 1)
		}
	},
	getInitialState: function () {
		return this.getStateFromStore();
    },
    componentWillReceiveProps(nextProps) {
        //this.setState(this.getStateFromStore(nextProps));
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
				this.state.snData[this.state.prevIdx].cls = 'animate shown';
				this.state.snData[this.state.currentIdx].cls = 'next';
				this.state.snData[this.state.nextIdx].cls = '';
				this.setState({nextIdx: this.state.currentIdx});
				this.setState({currentIdx: this.state.prevIdx});
				this.setState({prevIdx: (this.state.currentIdx === 0 ?
						lastSnap: this.state.prevIdx - 1)});
			}.bind(this), 1);
		} else {
			setTimeout(function () {
				this.state.snData[this.state.prevIdx].cls = '';
				this.state.snData[this.state.currentIdx].cls = 'animate shown left';
				this.setState({prevIdx: this.state.currentIdx});
				this.setState({currentIdx: this.state.nextIdx});
				this.setState({nextIdx: (this.state.currentIdx === lastSnap ?
						0 : this.state.nextIdx + 1)});
			}.bind(this), 1);
		}

		// on animation complete
		setTimeout(function () {
			this.state.snData[this.state.prevIdx].cls = 'left';
			this.state.snData[this.state.currentIdx].cls = 'shown';
			this.state.snData[this.state.nextIdx].cls = 'next';
			this.setState({animationProgress: false});
			this.history.pushState(null, (this.state.currentIdx + 1).toString());
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
			   		{this.state.snData.map(function(item) {
			   			return <NewSlide state={arguments[1] + 1} key={arguments[1]} data={item}/>;
			   		})}
			  </div>;
	}
});

ReactDOM.render(
	<Router history={AppHistory}>
	    <Route path='/' component={SnapViewer}>
	    	<Route path=":id" component={NewSlide} />
	    </Route>
	</Router>,
	document.getElementById('snapContainer')
);
