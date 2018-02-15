import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import RxDB from 'rxdb';
import faker from 'faker';

RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-websql'));

class App extends Component {
  state = {
    docs: [],
    db: {},
    schema: {
      disableKeyCompression: true,
      version: 0,
      title: 'human schema no compression',
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        }
      },
      required: ['firstName', 'lastName']
    }
  }

  async componentWillMount() {
    const mySchema = {
      disableKeyCompression: true,
      version: 0,
      title: 'human schema no compression',
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        }
      },
      required: ['firstName', 'lastName']
    };

    const db = await RxDB.create({
      name: 'heroesdb',           // <- name
      adapter: 'websql',          // <- storage-adapter
      password: 'myPassword',     // <- password (optional)
      multiInstance: true         // <- multiInstance (default: true)
    });

    this.setState({ db })

    console.dir(db);

    const collection = await db.collection({
      name: 'heroes',
      schema: mySchema
    });

    collection.sync({
      remote: 'http://127.0.0.1:5984/test', // remote database. This can be the serverURL, another RxCollection or a PouchDB-instance
      waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
      direction: {                          // direction (optional) to specify sync-directions
        pull: true, // default=true
        push: true  // default=true
      },
      options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
        live: true,
        retry: true
      },
    });

    await collection.find().$.subscribe(person => this.setState({docs: person}));

  }

  addNew = () => {
    this.state.db.collections.heroes.insert({
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value
    })
  }

  kill = async (id) => {
    try {
      const q = this.state.db.collections.heroes.findOne(id)
      await q.remove(); 
    }
    catch(error) {
      console.log('i got you')
      console.log(error)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {
          this.state.docs.map(doc => <div>{JSON.stringify(doc)}<button onClick={() => this.kill(doc._id)}>kill it</button></div>)
        }
        <label>first name</label>
        <input
          ref={(input) => { this.firstNameInput = input; }} />
        />
        <label>last name</label>
        <input 
          ref={(input) => { this.lastNameInput = input; }} />
        />
        <button onClick={this.addNew}>Add it</button>
      </div>
    );
  }
}

export default App;
