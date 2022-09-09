import { useState, useCallback } from 'react';
import { DatePicker, Space } from 'antd';

/**
 * This solution is distributed as is:
 * https://github.com/react-component/picker/issues/123#issuecomment-728755491
 */
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export interface IDatePickerAndDayJSPageProps {
}

export function DatePickerAndDayJSPage (props: IDatePickerAndDayJSPageProps) {
  const [dateStart, setDateStart] = useState('2022-09-16T00:28:00.000Z');

  const changeDate = useCallback((value: string) => {
    setDateStart(value);
  }, []);
  return (
    <>
    <Space>
      <DatePicker
        inputReadOnly={true}
        // disabled={false}
        style={{ width: '100%' }}
        allowClear={false}
        value={dayjs(dateStart) as any}
        format={'DD/MM/YYYY'}
        onChange={(value: any) => changeDate(value)}
      />
    </Space>
    </>
  );
}
