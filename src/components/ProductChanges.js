import React, { Component } from 'react'
import 'less/productchanges.less'

export class ProductChanges extends Component {
  render() {
    return (
      <div className='container-fluid product-changes'>
        <div className='col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2'>
          <div className='panel'>
            <header className='panel-heading'>Product changes</header>
            <div className='panel-body'>
              <article>
                <div className='changes'>
                  {
                    CHANGES.map((change, i) => (
                      <div className='item' key={i}>
                        <div className='date col-xs-3 col-md-2'>
                          <span>{ change.date }</span>
                        </div>
                        <div className='text col-xs-9 col-md-10'>
                          <span className='title'>
                            { change.tag }: { change.title }
                          </span>
                          <span className='info'>{ change.text }</span>
                        </div>
                      </div>
                      )
                    )
                  }
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const CHANGES = [
{
  date: 'JANUARY 31',
  tag: 'Update',
  title: 'Tradefeed: Toggle Desktop Notifications',
  text: 'You can now toggle desktop notifications for your individual presets.'
},
{
  date: 'JANUARY 28th',
  tag: 'Update',
  title: 'Added American Odds format:',
  text: 'You can now toggle between american and decimal odds'
},
{
  date: 'DEC 28',
  tag: 'Update',
  title: 'Tradefeed: filter on odds types',
  text: 'You can now filter on odds types in your presets. If you prefer certain odds types to different presets to up your game, this is now available.'
},
{
  date: 'DEC 12',
  tag: 'Update',
  title: 'Analytics: filter on odds types',
  text: 'You can now filter on odds types as well. The reason behind this is to delve into the closing edges on different odds types to really find leaks.'
},
{
  date: 'NOV 30',
  tag: 'Update',
  title: 'Analytics: filter on closing edge',
  text: 'You can now filter on closing edges. The reason behind this is to inspect the trades you make that end up in -EV, to see if there\'s any leaks you can find manually.'
},
{
  date: 'NOV 30',
  tag: 'Update',
  title: 'Sort your tradefeeds the name',
  text: 'The tradefeeds will now be sorted based on the name of the tradefeed. Name your presets with 1. or a) in front and they\'ll be automatically sorted.'
},{
  date: 'NOV 24',
  tag: 'UPDATE',
  title: 'Register removed trades',
  text: 'If you have the trade open and it gets removed from the tradefeed for whatever reason, it will no longer close, but show a big red EXPIRED instead. This means you can still register the trade if you placed it at the bookmakers.'
},
{
  date: 'NOV 24',
  tag: 'UPDATE',
  title: 'Slack notifications',
  text: 'We have removed email notifications in favor of Slack notifications. This helps you not clutter up your inbox, and get the information in a more structured way where you\'re at. By using the Slack mobile app that is available on all platforms, you can get notifications on your mobile as well.'
},
{
  date: 'NOV 24',
  tag: 'NEW',
  title: 'Who\'s online?',
  text: 'You can now see how many traders are online at any given point in the bottom left corner of the screen! Usually we\'re all online an hour before all the big rounds ;)'
},
{
  date: 'NOV 24',
  tag: 'NEW',
  title: 'Referral system',
  text: 'Everyone who\'s a customer with Trademate now has their own link they can use to refer people to the service. Both parties involved gets a 30 EUR discount on their next bill'
},
{
  date: 'NOV 10',
  tag: 'NEW',
  title: 'New analytics revision 1',
  text: 'More metrics in the analytics page and hit rate vs true closing odds chart. You can now see how you\'re running in the different odds ranges. This can be used to get an understanding of your variance and thus reduce it. How you would be running with flat unit staking on can also be seen by hovering on the different points.'
},
{
  date: 'NOV 1',
  tag: 'NEW',
  title: 'Improved analytics page',
  text: 'Added in more stats to the constructive analysis page including flat roi, average odds and average hours before the game in the stats breakdown section. You can now also filter on date ranges in the presets to check daily/weekly/monthly stats. New font color for better readability across the site.'
}
]
