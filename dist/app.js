//@ts-check
import 'jquery';
import 'bootstrap';
import _ from 'underscore';
import Vue from 'vue';
import * as moment from 'moment';
import 'moment/locale/de';

// Create all Components
var timeslot = Vue.component("timeslot", {
  template: "#timeslot",
  props: {
    id: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      sum: null,
      vonInput: "",
      bisInput: "",
      sumOutput: ""
    };
  },

  computed: {
    von: function von() {
      return moment(this.vonInput, moment.HTML5_FMT.TIME);
    },
    bis: function bis() {
      return moment(this.bisInput, moment.HTML5_FMT.TIME);
    }
  },
  watch: {
    von: function von() {
      if (!isNaN(this.bis)) {
        this.sum = moment(this.bis.diff(this.von));
        this.sumOutput = this.sum.subtract(1, "hours").format(moment.HTML5_FMT.TIME);
      }
    },
    bis: function bis() {
      if (!isNaN(this.von)) {
        this.sum = moment(this.bis.diff(this.von));
        this.sumOutput = this.sum.subtract(1, "hours").format(moment.HTML5_FMT.TIME);
      }
    },
    sumOutput: function sumOutput() {
      this.sum < 0 ? this.sum = this.sum * -1 : this.sum;
      this.$emit("summing", {
        slot: this.id,
        slotsum: this.sum
      });
    }
  },
  methods: {
    removeSelf: function removeSelf() {
      this.$emit("remove");
    }
  }
});

Vue.config.devtools = true;

// Create the vue instance at last
new Vue({
  el: "#app",
  data: function data() {
    return {
      sums: [],
      sum: 0,
      pause: 0,
      overtime: 0,
      timeslots: []
    };
  },

  computed: {
    sumOutput: function sumOutput() {
      if (this.sums.length > 0) {
        var mom = this.sums.reduce(function (acc, value) {
          typeof value.slotsum === 'string' ? value.slotsum = moment(value.slotsum) : console.log(value.slotsum);
          return acc + value.slotsum;
        });
        console.log(mom);
        return moment(mom).add(1, "hours").format(moment.HTML5_FMT.TIME);
      }
    }
  },
  methods: {
    addRow: function addRow() {
      this.timeslots.push(moment());
    },
    removeRow: function removeRow(row) {
      this.timeslots.splice(this.timeslots.indexOf(row), 1);
      this.sums.splice(this.sums.findIndex(function (element) {
        return element.slot === row.slot;
      }), 1);
    },
    getTotalSum: function getTotalSum(payload) {
      var _this = this;

      var unpacked = payload;
      if (this.contains(unpacked)) {
        this.sums.map(function (item) {
          if (_.isEqual(unpacked.slot, item.slot)) {
            var idx = _this.sums.findIndex(function (element) {
              return element.slot === unpacked.slot;
            });
            _this.sums[idx].slotsum = unpacked.slotsum;
          }
        });
      } else {
        this.sums.push(unpacked);
      }
    },
    contains: function contains(unpacked) {
      return this.sums.findIndex(function (element) {
        return element.slot === unpacked.slot;
      }) !== -1;
    }
  }
});