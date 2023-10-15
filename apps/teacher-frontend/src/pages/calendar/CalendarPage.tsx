import BasicCalendar from './BasicCalendar';
import CalendarView from './CalendarView';
import { TestCalendar } from './TestCalendar';

function CalendarPage() {
  return (
    <div style={{ height: '95vh' }}>
      {/* <BasicCalendar /> */}
      {/* <TestCalendar /> */}
      <CalendarView />
    </div>
  );
}

export default CalendarPage;
