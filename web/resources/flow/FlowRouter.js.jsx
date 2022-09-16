/**
 * Set up routing for all Flow views
 *
 * For an example with protected routes, refer to /product/ProductRouter.js.jsx
 */

// import primary libraries
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import global components
import Binder from '../../global/components/Binder.js.jsx';
import YTRoute from '../../global/components/routing/YTRoute.js.jsx';

// import flow views
import CreateFlow from './views/CreateFlow.js.jsx';
import FlowList from './views/FlowList.js.jsx';
import SingleFlow from './views/SingleFlow.js.jsx';
import UpdateFlow from './views/UpdateFlow.js.jsx';

class FlowRouter extends Binder {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <YTRoute exact login={true} path="/flows" component={FlowList} />
        <YTRoute exact login={true} path="/flows/new" component={CreateFlow} />
        <YTRoute exact login={true} path="/flows/:flowId" component={SingleFlow}/>
        <YTRoute exact login={true} path="/flows/:flowId/update" component={UpdateFlow}/>
      </Switch>
    )
  }
}

export default FlowRouter;
