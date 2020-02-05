<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: [
    'collectionData',
  ],
  mounted () {
    this.render();
  },
  methods: {
    render() {
      this.renderChart({
        labels: this.collectionData.labels,
        datasets: [
          {
            label: '男性',
            backgroundColor: 'rgba(114,128,255,0.6)',
            data: this.collectionData.data.male,
          },
          {
            label: '女性',
            backgroundColor: 'rgba(221,67,241,0.6)',
            data: this.collectionData.data.female,
          }
        ]
      })
    }
  },
  watch: {
    collectionData: function (next, prev) {
      this.render();
    }
  },
}
</script>