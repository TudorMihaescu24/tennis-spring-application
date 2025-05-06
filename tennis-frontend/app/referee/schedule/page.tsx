import TableSchedule from "@/components/TableSchedule";

export default function ScheduleReferee() {
  return (
    <div className="p-10">
      <TableSchedule api="http://localhost:5000/api/match/referee" />
    </div>
  );
}
