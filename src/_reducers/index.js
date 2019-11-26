import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
import { plant } from './plant.reducer';

const rootReducer = combineReducers({
  authentication,
  alert,
  plant
});

export default rootReducer;