import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import RxDB from 'rxdb';

RxDB.plugin(require('pouchdb-adapter-http'));
RxDB.plugin(require('pouchdb-adapter-websql'));

class App extends Component {
  state = {
    docs: []
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
          this.state.docs.map(doc => <div>{JSON.stringify(doc)}</div>)
        }
      </div>
    );
  }
}

export default App;
