<template>
  <div class="form-row align-items-center timeslot">
      <div class="form-group col-4 col-sm-3 order-2 order-sm-1">
        <label for="start">Kommen</label>
        <input id="start" type="time" class="form-control form-control-sm" v-model="vonInput">
      </div>
      <div class="form-group col-4 col-sm-3 order-3 order-sm-2">
        <label for="end">Gehen</label>
        <input id="end" type="time" class="form-control form-control-sm" v-model="bisInput">
      </div>
      <div class="form-group col-4 col-sm-3 order-4 order-sm-3">
        <label for="sum">Summe</label>
        <input id="sum" type="time" class="form-control form-control-sm" disabled="true" v-model="sumOutput">
      </div>
      <div class="col-12 col-sm order-1 order-sm-4">
        <button id="close" type="button" class="close" data-dismiss="modal" aria-label="Close" @click="removeSelf">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
</template>

<script>
import "jquery";
import "bootstrap";
import _ from "underscore";

export default {
  name: "Timeslot",
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
      return this.$moment(this.vonInput, this.$moment.HTML5_FMT.TIME);
    },
    bis() {
      return this.$moment(this.bisInput, this.$moment.HTML5_FMT.TIME);
    }
  },
  watch: {
    von() {
      if (!isNaN(this.bis)) {
        this.sum = this.$moment(this.bis.diff(this.von));
        let copy = this.$moment(this.sum);
        this.sumOutput = copy
          .subtract(1, "h")
          .format(this.$moment.HTML5_FMT.TIME);
      }
    },
    bis() {
      if (!isNaN(this.von)) {
        this.sum = this.$moment(this.bis.diff(this.von));
        let copy = this.$moment(this.sum);
        this.sumOutput = copy
          .subtract(1, "h")
          .format(this.$moment.HTML5_FMT.TIME);
      }
    },
    sumOutput() {
      this.sum < 0 ? (this.sum = this.sum * -1) : this.sum;
      this.$emit("summing", {
        id: this.id,
        slotsum: this.sum.valueOf()
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

<style lang="scss" scoped>
.timeslot {
  margin: 0.5rem;
  padding: 0.5rem;
  border: 2px solid white;

  #close {
    color: black;
    margin-left: 1rem;
    margin-top: 0.6rem;
  }
}
</style>