<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: [
    'collectionData',
  ],
  mounted () {
    this.renderChart({
      labels: ['20代前半', '20代後半', '30代', '40代', '50代以上'],
      datasets: [
        {
          backgroundColor: [
            "#00E5B9",
            "#01D3C4",
            "#02C0CF",
            "#02ADDA",
            "#039BE5",
          ],
          borderWidth: 0,
          data: this.collectionData.data.age_data
        }
      ],
      options: {
        legend: {
          position: 'right',
        }
      }
    })
  }
}
</script>