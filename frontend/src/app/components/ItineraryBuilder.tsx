import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, Plus } from "lucide-react";
import { motion } from "motion/react";

const ItemTypes = {
  ACTIVITY: "activity",
};

const ActivityItem = ({ activity, index, moveActivity, dayIndex }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { index, dayIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    hover(item: any) {
      if (item.index === index && item.dayIndex === dayIndex) return;
      if (item.dayIndex === dayIndex) {
        moveActivity(dayIndex, item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node)) as any} 
      className={`bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 p-4 rounded-xl flex items-center gap-4 cursor-move transition-colors shadow-sm dark:shadow-none ${isDragging ? 'opacity-50 bg-indigo-50 dark:bg-indigo-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/15'}`}
    >
      <GripVertical className="text-slate-400 dark:text-white/40" />
      <div className="flex-1">
        <h4 className="font-bold text-slate-800 dark:text-white">{activity.title}</h4>
        <p className="text-sm text-slate-500 dark:text-white/60">{activity.time} • {activity.cost}</p>
      </div>
    </div>
  );
};

const DaySection = ({ day, dayIndex, moveActivity, addActivity }: any) => {
  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    drop: () => ({ name: 'DaySection' }),
  });

  return (
    <div ref={drop as any} className="mb-10 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
          Day {dayIndex + 1}
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{day.date}</h3>
      </div>
      
      <div className="ml-8 border-l-2 border-slate-200 dark:border-white/10 pl-8 space-y-4 py-2 relative">
        {day.activities.map((activity: any, index: number) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            index={index} 
            dayIndex={dayIndex}
            moveActivity={moveActivity}
          />
        ))}
        
        <button 
          onClick={() => addActivity(dayIndex)}
          className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:border-white/40 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex justify-center items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Add Activity
        </button>
      </div>
    </div>
  );
};

const ItineraryBuilder = () => {
  const [days, setDays] = useState([
    {
      date: "Sep 10 - Arrival",
      activities: [
        { id: "1", title: "Hotel Check-in at Shinjuku", time: "14:00", cost: "Expense: $0" },
        { id: "2", title: "Explore Omoide Yokocho", time: "18:00", cost: "Expense: $30" },
      ]
    },
    {
      date: "Sep 11 - Culture",
      activities: [
        { id: "3", title: "Meiji Shrine Visit", time: "09:00", cost: "Expense: $0" },
        { id: "4", title: "Harajuku Shopping", time: "12:00", cost: "Expense: $100" },
      ]
    }
  ]);

  const moveActivity = (dayIndex: number, dragIndex: number, hoverIndex: number) => {
    const newDays = [...days];
    const draggedActivity = newDays[dayIndex].activities[dragIndex];
    newDays[dayIndex].activities.splice(dragIndex, 1);
    newDays[dayIndex].activities.splice(hoverIndex, 0, draggedActivity);
    setDays(newDays);
  };

  const addActivity = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.push({
      id: Math.random().toString(),
      title: "New Activity",
      time: "TBD",
      cost: "Expense: $0"
    });
    setDays(newDays);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-3xl mx-auto py-4">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">Drag & Drop Itinerary</h2>
        {days.map((day, index) => (
          <DaySection 
            key={index} 
            day={day} 
            dayIndex={index} 
            moveActivity={moveActivity} 
            addActivity={addActivity} 
          />
        ))}
        <button className="mt-4 bg-white dark:bg-white/10 text-slate-700 dark:text-white px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/20 transition-all font-bold shadow-sm">
          + Add another Day
        </button>
      </div>
    </DndProvider>
  );
};

export default ItineraryBuilder;
