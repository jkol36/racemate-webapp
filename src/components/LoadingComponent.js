import React, { Component } from 'react';
import 'less/loading.less'

const phrases = [
{
 text: 'Remember. Measure you results month by month, not day by day.',
 small: '- Your friends at Trademate'
},
{
 text: 'Variance is part of the game. Take it in your stride, but don\'t let that slow you down.',
 small: '- Your friends at Trademate'
},
{
 text: 'You have to start somewhere. Even the best traders were beginners once.',
 small: '- Your friends at Trademate'
},
{
 text: 'Put in the work and you\'ll get your rewards.',
 small: '- Your friends at Trademate'
},
{
 text: 'Learn to love the process and the results will look after themselves',
 small: '- Your friends at Trademate'
},
{
 text: 'Greatness is not an event, it\'s a habit.',
 small: '- Your friends at Trademate'
},
{
 text: 'Compounded growth is your most powerful tool.',
 small: '- Your friends at Trademate'
},
{
 text: 'You miss 100% of the shots you don\'t take.',
 small: '- Your friends at Trademate'
},
{
  text: 'You can get a €30 credit by refering a friend to Trademate. Your friend will also get a €30 discount on his first purchase :-)',
  small: '- Your friends at Trademate'
}
]

export class LoadingComponent extends Component {
  componentWillMount() {
    this.phrase = phrases[Math.floor(Math.random() * phrases.length)]
  }
  render() {
    return (
      <div className='loading-outer-container'>
        <div className='container-fluid loading-container'>
          <img className='img img-responsive center-block' src='/static/img/logo-outline.png' />
          <div className='phrase'>
            <p>{ this.phrase.text }</p>
            <small>{ this.phrase.small }</small>
          </div>
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube" />
            <div className="sk-cube2 sk-cube" />
            <div className="sk-cube4 sk-cube" />
            <div className="sk-cube3 sk-cube" />
          </div>
        </div>
      </div>
    );
  }
}
