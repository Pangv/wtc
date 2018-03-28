<template>
  <div class="form-row align-items-center">
      <div class="form-group col-4">
        <label for="start">Kommen</label>
        <input id="start" type="time" class="form-control" v-model="vonInput">
      </div>
      <div class="form-group col-4">
        <label for="end">Gehen</label>
        <input id="end" type="time" class="form-control" v-model="bisInput">
      </div>
      <div class="form-group col-auto">
        <label for="sum">Summe</label>
        <input id="sum" type="time" class="form-control" disabled="true" style="text-align: right;" v-model="sumOutput">
      </div>
      <div class="col-auto">
        <button type="button" class="btn btn-warning" aria-label="Schließen" @click="removeSelf">X</button>
      </div>
    </div>
</template>s

<script>
import 'jquery';
import 'bootstrap';
import _ from 'underscore';
import * as moment from 'moment';
import 'moment/locale/de';

export default {
  name: "timeslot",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sum: null,
      vonInput: "",
      bisInput: "",
      sumOutput: ""
    };
  },
  computed: {
    von() {
      return moment(this.vonInput, moment.HTML5_FMT.TIME);
    },
    bis() {
      return moment(this.bisInput, moment.HTML5_FMT.TIME);
    }
  },
  watch: {
    von() {
      if (!isNaN(this.bis)) {
        this.sum = moment.duration(this.bis.diff(this.von));
        this.sumOutput = this.sum
          .subtract(1, "hours")
          .format(moment.HTML5_FMT.TIME);
      }
    },
    bis() {
      if (!isNaN(this.von)) {
        this.sum = moment(this.bis.diff(this.von));
        this.sumOutput = this.sum
          .subtract(1, "hours")
          .format(moment.HTML5_FMT.TIME);
      }
    },
    sumOutput() {
      this.sum < 0 ? (this.sum = this.sum * -1) : this.sum;
      this.$emit("summing", {
        slot: this.id,
        slotsum: this.sum
      });
    }
  },
  methods: {
    removeSelf() {
      this.$emit("remove");
    }
  }
};
</script>

<style lang="sass" scoped>

</style>