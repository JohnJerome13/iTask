/**
 * Reads and exports the reducers as defined by each resource module
 *
 * NOTE: this facilitates adding reducers via the CLI
 */

export { default as user } from '../resources/user/userReducers.js';


export { default as task } from '../resources/task/taskReducers.js';


export { default as flow } from '../resources/flow/flowReducers.js';
export { default as note } from '../resources/note/noteReducers.js';