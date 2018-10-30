import React, { Component } from 'react';
import { Grommet, Box } from 'grommet';
import grommet from './theme';
import Header from '../Header';
import TaskManager from '../TaskManager'

class App extends Component {
  render() {
    return (
      <Grommet theme={grommet}>
        <Box
          background={{ "color": "background-1" }}
        >
          <Header />
          <TaskManager />
        </Box>
      </Grommet>
    );
  }
}

export default App;