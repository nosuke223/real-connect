<template lang="pug">
  v-dialog(v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition")
    v-card
      v-toolbar(dark color="primary")
        v-btn(icon dark @click="close()")
          v-icon mdi-close
        v-toolbar-title エリア絞り込み
      v-stepper(v-model="step" vertical )
        v-stepper-header
          v-stepper-step(:complete="step > 1" step="1") 都道府県を選択してください
        v-stepper-content(step="1")
          div.japan_map
            img(src="@/assets/japan_map.png" alt="日本地図")
            template(v-for="region in regions")
              span.area_btn(
                :class="'area' + String(region.id)"
                :date-area="region.id"
                @click="showPrefectureList(region.id)"
              ) {{region.name}}
            div.area_overlay(v-show="overlay" @click="hidePrefectureList()")
            div.pref_area(v-show="prefArea")
              template(v-for="region in regions")
                div.pref_list(v-show="selectRegion === region.id")
                  template(v-for="prefecture in region.prefectures")
                    div(@click="getArea(prefecture.id)") {{prefecture.name}}
        v-stepper-step(:complete="step > 2" step="2") エリアを選択してください
          v-stepper-content(step="2")
            v-select(
              v-model="municipality"
              @change="filterTargetAreas()"
              :items="municipalityList"
              label="市区町村で絞り込み"
              clearable
            )
            v-select(
              v-model="selectArea"
              @change="hideAreaSearch()"
              item-text="name"
              item-value="id"
              :items="targetAreas"
              label="エリア"
              return-object
            )
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      dialog: false,
      regions: [],
      overlay: false,
      prefArea: false,
      selectRegion: 0,
      selectPrefecture: 0,
      municipalityList: [],
      municipality: null,
      areas: [],
      targetAreas: [],
      selectArea: {},
      step: 1
    };
  },
  created() {
    this.fetchRegions();
  },
  methods: {
    init() {
      this.selectRegion = 0;
      this.selectPrefecture = 0;
      this.municipalityList = [];
      this.municipality = null;
      this.areas = [];
      this.targetAreas = [];
      this.selectArea = {};
      this.step = 1;
    },
    open() {
      this.init();
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async fetchRegions() {
      const request = new ApiRequest("regions", this.$cookie, "api/v1");
      const { response, error } = await request.requestWrapper(
        "get",
        "regions"
      );
      if (!error) {
        this.regions = response.data;
      }
    },
    showPrefectureList(regionId) {
      this.overlay = true;
      this.prefArea = true;
      this.selectRegion = regionId;
    },
    hidePrefectureList() {
      this.overlay = false;
      this.prefArea = false;
    },
    async getArea(prefectureId) {
      this.selectPrefecture = prefectureId;
      this.hidePrefectureList();
      const request = new ApiRequest(
        `areas?prefecture=${prefectureId}`,
        this.$cookie
      );
      const { response, error } = await request.index();
      if (!error) {
        this.areas = response.data;
        if (this.areas.length === 0) {
          alert("この都道府県にはまだエリアが登録されていません");
        } else {
          // 市区町村リストを絞り込む
          const municipalityList = this.areas.filter((area) => {
            return area.municipality
          }).map((area) => {
            return area.municipality
          });
          this.municipalityList = Array.from(new Set(municipalityList)); // Setを使って重複を排除
          this.filterTargetAreas();

          this.step = 2;
        }
      }
    },
    hideAreaSearch() {
      this.$emit("selectedArea", this.selectArea);
      this.$router.push(
        `/bulletin_board?tab=event&area_id=${this.selectArea.id}&area_name=${this.selectArea.name}`
      );
      this.close();
    },
    filterTargetAreas() {
      // エリアリストを絞り込む
      this.targetAreas = this.areas.filter((area) => {
        return (!this.municipality || area.municipality == this.municipality)
      });
    }
  }
};
</script>

<style scoped>
.japan_map {
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;
  display: table;
  background-color: #adf6ff;
}
/* 日本地図画像（スマホ対応用） */
.japan_map img {
  max-width: 100%;
  height: auto;
  border: 0;
  -webkit-backface-visibility: hidden;
}
/* 日本地図ボタン */
.japan_map .area_btn {
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  cursor: pointer;
  border: 3px solid #333333;
  border-radius: 5px;
  background-color: #fff;
  padding: 0.1em auto;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
}

/* ボタン配置（使用する日本地図画像により微調整） */
.japan_map .area_btn.area1 {
  top: 7%;
  right: 1%;
  width: 25%;
}
.japan_map .area_btn.area2 {
  top: 34%;
  right: 7%;
  width: 20%;
}
.japan_map .area_btn.area3 {
  top: 58%;
  right: 8%;
  width: 20%;
}
.japan_map .area_btn.area4 {
  top: 55%;
  right: 29%;
  width: 20%;
}
.japan_map .area_btn.area5 {
  top: 67%;
  left: 44%;
  width: 20%;
}
.japan_map .area_btn.area6 {
  top: 57%;
  left: 25%;
  width: 20%;
}

.japan_map .area_btn.area7 {
  top: 77%;
  left: 25%;
  width: 20%;
}
.japan_map .area_btn.area8 {
  top: 65%;
  left: 0%;
  width: 30%;
}
/* オーバーレイ */
.japan_map .area_overlay {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  background-color: #111;
  opacity: 0.5;
  cursor: pointer;
}

/* エリア毎の都道府県リスト */
.japan_map .pref_list {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  z-index: 3;
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 90%;
  background-color: #fff;
}
.japan_map .pref_list > div {
  box-sizing: border-box;
  width: 50%;
  border: 1px solid #ccc;
  font-weight: bold;
  text-align: center;
  padding: 0.5em;
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  /* スマホユーザー向けにボタン文字サイズを調整 */
  .japan_map .area_btn {
    font-size: 2vw;
  }
}
</style>
