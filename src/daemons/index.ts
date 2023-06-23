import Telegram from '../telegram';
import employeesBirthday from './daemons/employeesBirthday';
import closeWorkShift from './daemons/closeWorkShift';

const Daemons = {
  daemons: {},
  async init() {
    // Start daemons here using method this.startDaemon(...)
    this.startDaemon('employeesBirthday', employeesBirthday.daemon, employeesBirthday.interval, Telegram.getBot());
    this.startDaemon('closeWorkShift', closeWorkShift.daemon, closeWorkShift.interval, Telegram.getBot());
    console.log('>>> [Daemons] Daemons launched');
  },
  startDaemon(name, daemon, interval, ...args) {
    this.daemons[name] = setInterval(daemon, interval, ...args);
  },
  deleteDaemon(name) {
    clearInterval(this.daemons[name]);
    delete this.daemons[name];
  },
};

export default Daemons;
