import * as option from './option';
import * as dashboard from './dashboard';
import * as trace from './trace';
import * as topology from './topology';
import * as alarm from './alarm';
export default {
  ...option,
  ...dashboard,
  ...trace,
  ...topology,
  ...alarm,
};
