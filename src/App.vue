<template>
   <div class="container-fluid app">
       <div class="row">
        <div class="col">
          <h1>9-to-5</h1>
        </div>
       </div>
       <div class="row">
        <div class="col-12 col-sm-5 my-auto">
         <button @click="addRow" id="addRowButton" class="btn btn-block btn-success">Zeile hinzufügen</button>
        </div>
        <div class="form-group col-12 col-sm">
         <label for="overtime">Geplante Überstunden</label>
          <div class="input-group input-group-sm">
         <input type="time" name="overtime" class="form-control form-control-sm" disabled="true" id="overtime">
          <div class="input-group-append">
      <button class="btn btn-sm btn-outline-secondary" type="button" disabled="true"><img src="./assets/ic_refresh_black_24px.svg" alt="refresh"></button>
          </div>
    </div>
        </div>
       </div>
      <div class="row">
          <form class="col justify-content-around">
        <timeslot v-for="(row) in timeslots" :id="row" :key="row" v-on:summing="getTotalSum"  v-on:remove="removeRow(row)"></timeslot>
        </form>
      </div>
      <div class="row">
        <div class="col-12 col-sm">
          <table class="table table-sm table-responsive">
            <thead>
              <tr>
                <th scope="col">Arbeitszeit</th>
                <th scope="col">Pause</th>
                <th scope="col">Anwesenheit</th>
                <th scope="col">Überstunden</th>
                <th scope="col"><img src="./assets/ic_alarm_black_24px.svg" alt="" srcset=""></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{sumOutput}}</td> 
                <td>{{pauseOutput}}</td>
                <td>{{attendanceOutput}}</td>
                <td>{{overtimeOutput}}</td>
                <td>{{alert}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
import $ from "jquery";
import "bootstrap";
import _ from "underscore";
import Timeslot from "./components/timeslot.vue";

export default {
  name: "App",

  data() {
    return {
      sums: [],
      sum: 0,
      pause: 0,
      timeslots: []
    };
  },
  computed: {
    sumOutput() {
      if (this.sums.length > 0) {
        const dura = this.$moment.duration("00:00:00");
        this.sum = this.sums.reduce((accumulator, element) => {
          let temp = this.$moment.duration(element.slotsum);
          return accumulator.add(temp);
        }, dura);
        this.sum = this.$moment(this.sum.asMilliseconds()).utc();
        return this.sum.format("HH:mm:ss");
      } else {
        return this.$moment(this.$moment.duration("00:00:00").asMilliseconds())
          .utc()
          .format("HH:mm:ss");
      }
    },
    attendance() {
      if (this.sums.length > 0) {
        return this.$moment(this.sum).add(
          this.$moment.duration(this.pauseOutput)
        );
      } else {
        return this.$moment(
          this.$moment.duration("00:00:00").asMilliseconds()
        ).utc();
      }
    },
    attendanceOutput() {
      return this.attendance.utc().format("HH:mm:ss");
    },
    overtime() {
      let attendance = this.attendance.utc();
      let MAX_TIME = this.$moment.duration("08:30:00").valueOf();

      if (attendance.valueOf() > MAX_TIME) {
        return this.$moment(attendance).subtract(
          this.$moment.duration("08:30:00")
        );
      } else {
        return this.$moment(this.$moment.duration("00:00:00"));
      }
    },
    overtimeOutput() {
      return this.overtime.format("HH:mm:ss");
    },
    alert() {
      let attendance = this.attendance.utc().valueOf();
      let MAX_TIME = this.$moment.duration("08:30:00").valueOf();

      if (attendance > MAX_TIME) {
        return "Geh nach Hause!";
      } else if (attendance < MAX_TIME) {
        return "Arbeit Arbeit";
      } else {
        return "-";
      }
    },
    pauseOutput: {
      get() {
        if (
          this.sum.valueOf() >
          this.$moment(this.$moment.duration("08:00:00").asMilliseconds())
            .utc()
            .valueOf()
        ) {
          return "00:45";
        } else if (
          this.sum.valueOf() >
          this.$moment(this.$moment.duration("06:00:00").asMilliseconds())
            .utc()
            .valueOf()
        ) {
          return "00:30";
        } else if (this.sums.length === 0) {
          return "-";
        }
      },
      set(durationString) {
        this.pause = this.$moment(
          this.$moment.duration(durationString).asMilliseconds()
        )
          .utc()
          .valueOf();
      }
    }
  },
  methods: {
    addRow() {
      const rnd = Math.floor(Math.random() * 10 + 1);
      this.timeslots.push(
        this.$moment()
          .add(rnd, "milliseconds")
          .toString()
      );
      $("#addRowButton").prop("disabled", function() {
        return !$(this).prop("disabled");
      });
      setTimeout(() => {
        $("#addRowButton").prop("disabled", function() {
          return !$(this).prop("disabled");
        });
      }, 1000);
    },
    removeRow(row) {
      this.timeslots.splice(this.timeslots.indexOf(row), 1);
      this.sums.splice(
        this.sums.findIndex(element => element.id === row.id),
        1
      );
    },
    getTotalSum(payload) {
      const unpacked = payload;
      if (this.contains(unpacked)) {
        this.sums.map(item => {
          if (unpacked.id === item.id) {
            const idx = this.sums.findIndex(element => {
              return element.id === unpacked.id;
            });
            this.sums[idx].slotsum = unpacked.slotsum;
          }
        });
      } else {
        this.sums.push(unpacked);
      }
    },
    contains(unpacked) {
      return this.sums.findIndex(element => element.id === unpacked.id) !== -1;
    }
  },
  components: {
    Timeslot
  }
};
</script>

<style lang="scss">
h1 {
  text-align: center;
}
.table-sm {
  tr {
    th {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      color: black;
    }
    td {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
}
</style>
