<template>
  <div class="calendar">
    <table @click="$event.stopPropagation()" class="calendar-panel" v-show="show">
      <thead>
        <tr class="calendar-header">
          <th class="calendar-prev" @click="prev">&lt;</th>
          <th class="calendar-select" :colspan="mode === 'date' ? 5 : 1">
            <div v-show="mode === 'date'" @click="changeMode">{{year}}年 {{month}}月</div>
            <div v-show="mode === 'month'" @click="changeMode">{{year}} 年</div>
            <div v-show="mode === 'year'">{{ yearRangeStart }} - {{ yearRangeEnd }}</div>
          </th>
          <th class="calendar-next" @click="next">&gt;</th>
        </tr>
        <tr v-show="mode === 'date'" class="calendar-weeks">
          <th class="calendar-week" v-for="week in calendar.weeks">{{ week }}</th>
        </tr>
      </thead>
      <tbody class="calendar-body">
        <tr
          v-show="mode === 'date'"
          v-for="line in calendar.days">
          <td
            class="calendar-day"
            :class="{'disabled': day.disabled, 'selected': day.selected, 'range': day.range}"
            @click="selectDate"
            v-for="day in line">{{ day.date }}</td>
        </tr>
        <tr
          v-show="mode === 'month'"
          v-for="line in months"
          >
          <td
            @click="selectMonth"
            class="calendar-month"
            v-for="eachMonth in line">{{ eachMonth }} 月</td>
        </tr>
        <tr
          v-show="mode === 'year'"
          v-for="line in years"
          >
          <td
            @click="selectYear"
            class="calendar-year"
            v-for="eachYear in line">{{ eachYear }}</td>
        </tr>
      </tbody>
    </table>
    <input type="text"
      class="date-picker"
      @change="dateChangeHandler"
      @focus="show = true"
      @click="$event.stopPropagation()"
      ref='datePicker'
      >
  </div>
</template>

<script>
export default {
  name: 'VCalender',
  data () {
    return {
      show: false,
      mode: 'date',
      range: false,
      rangeStart: '',
      rangeEnd: '',
      dateSelected: '',
      year: 0,
      month: 0,
      yearRangeStart: 0,
      yearRangeEnd: 0,
      months: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]
    }
  },
  computed: {
    calendar () {
      let crtMonthFirstDateDay = new Date(this.year, this.month - 1, 1).getDay()
      let crtMonthLastDate = new Date(this.year, this.month, 0).getDate()
      let prevMonthLastDate = new Date(this.year, this.month - 1, 0).getDate()
      let nextMonthDateNum = 42 - crtMonthLastDate - crtMonthFirstDateDay
      let totalDate = []
      for (let i = 0; i < crtMonthFirstDateDay; i++) {
        totalDate.push({
          date: prevMonthLastDate,
          disabled: true
        })
        prevMonthLastDate--
      }
      totalDate.reverse()

      if (!this.range) {
        let dateSelected = new Date(this.dateSelected)
        let isCrtMonth = (this.year === dateSelected.getFullYear()) && (this.month === dateSelected.getMonth() + 1)

        let isThisYear = this.year === new Date().getFullYear()
        let isPrevYear = this.year < new Date().getFullYear()
        let isThisMonth = this.month === (new Date().getMonth() + 1)
        let isPrevMonth = this.month < (new Date().getMonth() + 1)

        for (let i = 1; i <= crtMonthLastDate; i++) {
          totalDate.push({
            date: i,
            selected: isCrtMonth && (i === dateSelected.getDate()),
            disabled: isPrevYear || (isThisYear && isPrevMonth) || (isThisYear && isThisMonth && i < new Date().getDate())
          })
        }
      } else {
        let selectedStart = this.rangeStart !== ''
        let rangeStartDate, rangeEndDate
        if (!selectedStart) {
          rangeStartDate = new Date(this.rangeStart)
          let isCrtMonth = (this.year === rangeStartDate.getFullYear()) && (this.month === rangeStartDate.getMonth() + 1)
          for (let i = 1; i <= crtMonthLastDate; i++) {
            totalDate.push({
              date: i,
              selected: isCrtMonth && (i === rangeStartDate.getDate())
            })
          }
        } else {
          rangeStartDate = new Date(this.rangeStart)
          rangeEndDate = new Date(this.rangeEnd)
          let rangeStartTime = rangeStartDate.getTime()
          let rangeEndTime = rangeEndDate.getTime()
          let startIsCrtMonth = this.year === rangeStartDate.getFullYear() && this.month === rangeStartDate.getMonth() + 1
          let endIsCrtMonth = this.year === rangeEndDate.getFullYear() && this.month === rangeEndDate.getMonth() + 1
          for (let i = 1; i <= crtMonthLastDate; i++) {
            let tmp = new Date(this.year, this.month - 1, i)
            totalDate.push({
              date: i,
              selected: (startIsCrtMonth && i === rangeStartDate.getDate()) || (endIsCrtMonth && i === rangeEndDate.getDate()),
              range: rangeStartTime < tmp.getTime() && tmp.getTime() < rangeEndTime
            })
          }
        }
      }
      for (let i = 1; i <= nextMonthDateNum; i++) {
        totalDate.push({
          date: i,
          disabled: true
        })
      }
      let days = []
      for (let i = 0; i < 6; i++) {
        days.push(totalDate.splice(0, 7))
      }
      return {
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        days: days
      }
    },
    value () {
      if (!this.range) {
        return this.dateSelected
      }
      return this.rangeStart + '~' + this.rangeEnd
    },
    years () {
      let tmp = []
      let start = this.yearRangeStart - 1
      let end = this.yearRangeEnd + 1
      for (let i = start; i <= end; i++) {
        tmp.push(i)
      }
      let years = []
      for (let i = 0; i < 4; i++) {
        years.push(tmp.splice(0, 3))
      }
      return years
    }
  },
  watch: {
    year (newYear) {
      this.yearRangeStart = newYear - (newYear % 10)
      this.yearRangeEnd = this.yearRangeStart + 9
    },
    value () {
      this.dateChangeHandler(this.value)
    }
  },
  created () {
    this.month = new Date().getMonth() + 1
    this.year = new Date().getFullYear()
    this.yearRangeStart = this.year - (this.year % 10)
    this.yearRangeEnd = this.yearRangeStart + 9
  },
  ready () {
    document.body.addEventListener('click', () => this.close(), false)
  },
  methods: {
    prev () {
      if (this.mode === 'date') {
        if (this.month > 1) {
          this.month--
        } else {
          this.month = 12
          this.year--
        }
      }
      if (this.mode === 'month') {
        this.year--
      }
      if (this.mode === 'year') {
        this.yearRangeStart = this.yearRangeStart - 10
        this.yearRangeEnd = this.yearRangeEnd - 10
      }
    },
    next () {
      if (this.mode === 'date') {
        if (this.month < 12) {
          this.month++
        } else {
          this.month = 1
          this.year++
        }
      }
      if (this.mode === 'month') {
        this.year++
      }
      if (this.mode === 'year') {
        this.yearRangeStart = this.yearRangeStart + 10
        this.yearRangeEnd = this.yearRangeEnd + 10
        console.log('ok')
      }
    },
    selectDate (e) {
      if (!this.hasClass(e.target, 'disabled')) {
        let date = new Date(this.year, this.month - 1, e.target.textContent)
        if (!this.range) {
          this.dateSelected = this.dateFromat(date, 'yyyy-MM-dd')
          this.sueccess()
        } else {
          if (this.rangeStart === '' && this.rangeEnd === '') {
            this.rangeStart = this.dateFromat(date, 'yyyy-MM-dd')
          } else if (this.rangeStart !== '' && this.rangeEnd === '') {
            let tempDate = new Date(this.rangeStart)
            if (tempDate.getTime() > date.getTime()) {
              this.rangeEnd = this.rangeStart
              this.rangeStart = this.dateFromat(date, 'yyyy-MM-dd')
            } else {
              this.rangeEnd = this.dateFromat(date, 'yyyy-MM-dd')
            }
            this.sueccess()
          } else {
            this.rangeStart = this.dateFromat(date, 'yyyy-MM-dd')
            this.rangeEnd = ''
          }
        }
      }
    },
    selectMonth (e) {
      this.month = Number(e.target.textContent.replace(' 月', ''))
      this.mode = 'date'
    },
    selectYear (e) {
      this.year = Number(e.target.textContent)
      this.mode = 'month'
    },
    changeMode () {
      if (this.mode === 'date') {
        this.mode = 'month'
      } else if (this.mode === 'month') {
        this.mode = 'year'
      }
    },
    close () {
      this.show = false
    },
    sueccess () {
      this.$refs.datePicker.value = this.value
    },
    dateFromat (date, format) {
      let o = {
        'yyyy': date.getFullYear(),
        'MM': this.zero(date.getMonth() + 1),
        'dd': this.zero(date.getDate()),
        'hh': this.zero(date.getHours()),
        'mm': this.zero(date.getMinutes()),
        'ss': this.zero(date.getSeconds())
      }
      for (let k in o) {
        format = format.replace(k, o[k])
      }
      return format
    },
    zero (number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    },
    hasClass (ele, className) {
      return ele.classList.contains(className)
    },
    dateChangeHandler (dateValue) {
      this.$emit('date-change', dateValue)
    }
  }
}
</script>

<style lang="scss">
$baseColor: #018fe5;
$lightColor: lighten($baseColor,10%);
$preLightColor: lighten($baseColor,30%);
$gray: #ccc;

.calendar {
  display: inline-block;
  position: relative;
  .date-picker {
    outline: none;
    width: 200px;
  }
  .calendar-panel {
    background-color: #eee;
    position: absolute;
    left: 0;
    top: -10px;
    transform: translateY(-100%);
    width: 240px;
    height: 300px;
    border-spacing: 0;
    background-color: #fff;
    box-shadow: 0 0 8px #ddd;
  }
  .calendar-header {
    line-height: 40px;
    background-color: $baseColor;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    .calendar-select,
    .calendar-prev,
    .calendar-next {
      cursor: pointer;
      &:hover {
        background-color: $lightColor;
      }
    }
    .calendar-select {
      white-space: nowrap;
    }
  }
  .calendar-weeks {
    .calendar-week {
      line-height: 30px;
      color: $baseColor;
      cursor: default;
    }
  }
  .calendar-body {
    .calendar-year,
    .calendar-month,
    .calendar-day {
      cursor: pointer;
      text-align: center;
      &:not(.disabled):hover {
        background-color: $lightColor;
        color: #fff;
      }
      &.disabled {
        color: $gray;
        cursor: default;
      }
      &.range {
        background-color: $preLightColor;
        color: #fff;
      }
      &.selected {
        background-color: $baseColor;
        color: #fff;
      }
    }
    .calendar-year,
    .calendar-month {
      width: 33.33333333%;
      &:hover {
        background-color: $preLightColor !important;
      }
    }
  }
}
</style>
