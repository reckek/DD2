// @ts-check

import del from "del";
import config from "../config";
import {createTask} from '../utils'

const [taskClear] = createTask('clear', () => del(config.dest.root));

export {taskClear}
