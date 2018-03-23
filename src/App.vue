<template>
   <div id="app" class="container">
    <h1>9-to-5</h1>
    <button @click="addRow" id="addRowButton" class="btn btn-success">
        Zeile hinzufügen
        </button>
    <form>
      <timeslot v-for="(row, index) in timeslots" v-bind:id="row" :key="row" v-on:summing="getTotalSum"  v-on:remove="removeRow(row)"></timeslot>
    </form>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Gesamtsumme</th>
          <th scope="col">Pause</th>
          <th scope="col">Überstunden</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{sumOutput}}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    {{this.sums.slot}}
  </div>
</template>

<script>
import $ from "jquery";
import "bootstrap";
import _ from "underscore";
import * as moment from "moment";
import "moment/locale/de";
import Timeslot from "./components/timeslot.vue";

export default {
  name: "app",
  data() {
    return {
      sums: [],
      sum: 0,
      pause: 0,
      overtime: 0,
      timeslots: []
    };
  },
  computed: {
    sumOutput() {
      if (this.sums.length > 0) {
        let mom = this.sums.reduce((acc, value) => {
          typeof value.slotsum === "string"
            ? (value.slotsum = moment(value.slotsum))
            : console.log(value.slotsum);
          return acc + value.slotsum;
        });
        return moment(mom)
          .add(1, "hours")
          .format(moment.HTML5_FMT.TIME);
      }
    }
  },
  methods: {
    addRow() {
      const rnd = Math.floor(Math.random() * 10 + 1);
      this.timeslots.push(moment().add(rnd, "milliseconds"));
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
        this.sums.findIndex(element => element.slot === row.slot),
        1
      );
    },
    getTotalSum(payload) {
      const unpacked = payload;
      if (this.contains(unpacked)) {
        this.sums.map(item => {
          if (_.isEqual(unpacked.slot, item.slot)) {
            const idx = this.sums.findIndex(element => {
              return element.slot === unpacked.slot;
            });
            this.sums[idx].slotsum = unpacked.slotsum;
          }
        });
      } else {
        this.sums.push(unpacked);
      }
    },
    contains(unpacked) {
      return (
        this.sums.findIndex(element => element.slot === unpacked.slot) !== -1
      );
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
</style>
