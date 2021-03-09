import compareAsc from 'date-fns/compareAsc';
import {
  buildDateFromTime,
  formatDigitToString,
} from 'shared/helpers/DateHelper';

export default {
  computed: {
    channelConfig() {
      return window.chatwootWebChannel;
    },
    replyTime() {
      return window.chatwootWebChannel.replyTime;
    },
    replyTimeStatus() {
      switch (this.replyTime) {
        case 'in_a_few_minutes':
          return this.$t('REPLY_TIME.IN_A_FEW_MINUTES');
        case 'in_a_few_hours':
          return this.$t('REPLY_TIME.IN_A_FEW_HOURS');
        case 'in_a_day':
          return this.$t('REPLY_TIME.IN_A_DAY');
        default:
          return this.$t('REPLY_TIME.IN_A_FEW_HOURS');
      }
    },
    outOfOfficeMessage() {
      return this.channelConfig.outOfOfficeMessage;
    },
    isInBetweenTheWorkingHours() {
      const {
        closedAllDay,
        openHour,
        openMinute,
        closeHour,
        closeMinute,
      } = this.currentDayAvailability;

      if (closedAllDay) {
        return false;
      }

      const { utcOffset } = this.channelConfig;
      const startTime = buildDateFromTime(
        formatDigitToString(openHour),
        formatDigitToString(openMinute),
        utcOffset
      );
      const endTime = buildDateFromTime(
        formatDigitToString(closeHour),
        formatDigitToString(closeMinute),
        utcOffset
      );

      if (
        compareAsc(new Date(), startTime) === 1 &&
        compareAsc(endTime, new Date()) === 1
      ) {
        return true;
      }

      return false;
    },
    currentDayAvailability() {
      const dayOfTheWeek = new Date().getDay();
      const [workingHourConfig = {}] = this.channelConfig.workingHours.filter(
        workingHour => workingHour.day_of_week === dayOfTheWeek
      );
      return {
        closedAllDay: workingHourConfig.closed_all_day,
        openHour: workingHourConfig.open_hour,
        openMinute: workingHourConfig.open_minutes,
        closeHour: workingHourConfig.close_hour,
        closeMinute: workingHourConfig.close_minutes,
      };
    },
  },
};
