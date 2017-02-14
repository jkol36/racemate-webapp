import React, { Component } from 'react'
import { hijack } from 'actions/auth'
import firebase from 'firebase'

export class HijackComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      query: ''
    }
  }

  componentDidMount() {
    firebase.database().ref('users').once('value')
      .then(snap => {
        const users = []
        snap.forEach(s => {
          users.push(s.val())
        })
        this.setState({
          users
        })
      })
  }

  hijack(uid) {
    this.props.dispatch(hijack(uid))
  }

  filterUsers() {
    if (this.state.query.length < 3)
      return this.state.users
    const regex = new RegExp(this.state.query, 'gi')
    return this.state.users.filter(u => {
      return (u.displayName && u.displayName.match(regex)) ||
        (u.email && u.email.match(regex)) ||
        (u.uid && u.uid.match(regex))
    })
  }

  render() {
    return (
      <div>
        <input className='form-control'
          value={this.state.query}
          onChange={(e) => this.setState({ query: e.target.value })}
          type='text'
        />
        <table className='table table-striped table-hover'>
          <tbody>
            {
              this.filterUsers().map((user, i) =>
                <tr key={i}>
                  <td>{ user.email }</td>
                  <td>{ user.displayName }</td>
                  <td>{ user.uid }</td>
                  <td>
                    <button className='btn btn-success'
                      onClick={() => this.hijack(user.uid) }>Hijack</button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}
