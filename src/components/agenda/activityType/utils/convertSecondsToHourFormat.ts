export default function convertSecondsToHourFormat(seconds: number) {
  let hour: number | string = Math.floor(seconds / 3600);
  let minute: number | string = Math.floor((seconds / 60) % 60);
  let second: number | string = seconds % 60;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  if (hour == 0) return minute + ':' + second;
  return hour + ':' + minute + ':' + second;
}
