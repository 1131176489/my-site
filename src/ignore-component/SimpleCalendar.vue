<template>
  <div class="simple-calendar">
    <div class="calendar-header">
      <button @click="prevYear">«</button>
      <button @click="prevMonth">‹</button>
      <h2 @click="showYearPicker = !showYearPicker" class="month-year-display">
        {{ currentMonthYear }}
      </h2>
      <button @click="nextMonth">›</button>
      <button @click="nextYear">»</button>
    </div>

    <div v-if="showYearPicker" class="year-picker">
      <div class="year-picker-header">
        <button @click="yearRange -= 12">‹‹</button>
        <span>{{ yearRange}} - {{ yearRange + 11 }}</span>
        <button @click="yearRange += 12">››</button>
      </div>
      <div class="year-grid">
        <button
            v-for="year in visibleYears"
            :key="year"
            @click="selectYear(year)"
            :class="{ 'current-year': year === currentDate.getFullYear() }"
        >
          {{ year }}
        </button>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-header">
        {{ day }}
      </div>
      <div
          v-for="date in visibleDates"
          :key="date.toISOString()"
          :class="['day-cell', {
            'not-current-month': !isCurrentMonth(date),
            'current-month':isCurrentMonth(date) ,
            'highlight':isHighlight(date)
          }]"
      >
        {{ date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import moment from "moment";
interface Props {
  myProp: string;
  highlightDate:string[]
}
const currentDate = ref(new Date());
const showYearPicker = ref(false);
const yearRange = ref(Math.floor(currentDate.value.getFullYear() / 10) * 10);
const props = defineProps({
  highlightDate:{
    type: Array,
    required:true,
  }
})
console.log(props["highlightDate"]);
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const currentMonthYear = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`;
});

const visibleYears = computed(() => {
  const years = [];
  for (let i = 0; i < 12; i++) {
    years.push(yearRange.value + i);
  }
  return years;
});

const visibleDates = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDayOfWeek = lastDay.getDay();

  const prevMonthDays = firstDayOfWeek;
  const nextMonthDays = 6 - lastDayOfWeek;

  const dates = [];

  // 上个月日期
  for (let i = prevMonthDays; i > 0; i--) {
    dates.push(new Date(year, month, -i + 1));
  }

  // 当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }

  // 下个月日期
  for (let i = 1; i <= nextMonthDays; i++) {
    dates.push(new Date(year, month + 1, i));
  }

  return dates;
});

const isCurrentMonth = (date:Date) => {
  return date.getMonth() === currentDate.value.getMonth();
};
const isHighlight = (date:Date) => {
  // console.log(props["highlightDate"])
  // console.log(moment(date).format('YYYY-MM-DD'))
  return props["highlightDate"].includes(moment(date).format('YYYY-MM-DD'))
};
const prevMonth = () => {
  currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
  );
};

const prevYear = () => {
  currentDate.value = new Date(
      currentDate.value.getFullYear() - 1,
      currentDate.value.getMonth(),
      1
  );
  yearRange.value = Math.floor(currentDate.value.getFullYear() / 10) * 10;
};

const nextYear = () => {
  currentDate.value = new Date(
      currentDate.value.getFullYear() + 1,
      currentDate.value.getMonth(),
      1
  );
  yearRange.value = Math.floor(currentDate.value.getFullYear() / 10) * 10;
};

const selectYear = (year:any) => {
  currentDate.value = new Date(
      year,
      currentDate.value.getMonth(),
      1
  );
  showYearPicker.value = false;
};
</script>

<style scoped>
.simple-calendar {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header button {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}

.month-year-display {
  cursor: pointer;
  margin: 0 10px;
  padding: 5px 10px;
}

.month-year-display:hover {
  background-color: #f0f0f0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-header, .day-cell {
  text-align: center;
  padding: 10px;
}

.day-header {
  font-weight: bold;
  background: #f0f0f0;
}

.day-cell {
  border: 1px solid #eee;
  min-height: 30px;
}

.day-cell.not-current-month {
  color: #ccc;
}

.year-picker {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  z-index: 10;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.year-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.year-grid button {
  padding: 5px;
  border: 1px solid #eee;
  background: none;
  cursor: pointer;
}

.year-grid button:hover {
  background-color: #f0f0f0;
}

.year-grid button.current-year {
  background-color: #4285f4;
  color: white;
}
.day-cell.current-month.highlight{
  background-color: skyblue;
}
</style>