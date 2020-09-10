<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline 店舗詳細
    v-divider
    div.title
      v-row
        v-col(xs="12" sm="12" md="6")
          v-avatar(size="84" v-if="place.logo_image && place.logo_image.url")
            v-img(:src="place.logo_image.url")
          p 店舗ID: {{ place.id }}
          p 店舗名: {{ place.name }}
          p 郵便番号: {{ place.zipcode }}
          p 住所: {{ displayAddress }}
          p URL: {{ place.url }}
          p オーナー名: {{ displayOwnerName }}
          p エリア名: {{ displayAreaName }}
          p 店舗説明: {{ place.description }}
        v-col(xs="12" sm="12" md="6")
          v-card(max-width="434" class="mx-auto my-2" tile)
            v-img(:src="place.cover_image.url" max-width="100%" v-if="place.cover_image && place.cover_image.url")
        v-col(cols="12")
          v-data-table(:items="items"
            :headers="headers"
            hide-default-footer
            disable-sort
            dense
            class="color-header"
          )
          
</template>

<script>
import ApiRequest from "@/api/base";
import ItemTable from "../utils/ItemTable";
import { formatTime, isHoliday } from "@/utils/format_date";

export default {
  components: {
    ItemTable,
  },
  data() {
    return {
      place: {
        id: this.$route.params.id,
        name: "",
        area_id: 0,
        telephone: 0,
        url: "",
        description: "",
        note: "",
        seat_status: 0,
        sun_start_at: null,
        sun_end_at: null,
        is_sun_holiday: false,
        mon_start_at: null,
        mon_end_at: null,
        is_mon_holiday: false,
        tue_start_at: null,
        tue_end_at: null,
        is_tue_holiday: false,
        wed_start_at: null,
        wed_end_at: null,
        is_wed_holiday: false,
        thu_start_at: null,
        thu_end_at: null,
        is_thu_holiday: false,
        fri_start_at: null,
        fri_end_at: null,
        is_fri_holiday: false,
        sat_start_at: null,
        sat_end_at: null,
        is_sat_holiday: false,
        address1: "",
        address2: "",
        address3: "",
        zipcode: 0,
      },
      items: [],
      headers: [
        { text: "曜日", value: "dayOfWeek" },
        { text: "開店時間", value: "startAt" },
        { text: "閉店時間", value: "endAt" },
        { text: "定休日", value: "isHoliday" },
      ],
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayAddress() {
      const addressArray = [
        this.place.address1,
        this.place.address2,
        this.place.address3,
      ].filter((v) => v);
      return addressArray.join("");
    },
    displayOwnerName() {
      const owner = this.place.owner;
      if (owner && owner.full_name) {
        return owner.full_name;
      } else {
        return '';
      }
    },
    displayAreaName() {
      const area = this.place.area;
      if (area && area.name) {
        return area.name;
      } else {
        return '';
      }
    }
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("places", this.$cookie);
      const { response, error } = await request.show(this.place.id);
      if (!error) {
        const data = response.data;
        this.place = data;
        this.items = [
          {
            dayOfWeek: "日曜日",
            startAt: formatTime(this.place.sun_start_at),
            endAt: formatTime(this.place.sun_end_at),
            isHoliday: isHoliday(this.place.is_sun_holiday),
          },
          {
            dayOfWeek: "月曜日",
            startAt: formatTime(this.place.mon_start_at),
            endAt: formatTime(this.place.mon_end_at),
            isHoliday: isHoliday(this.place.is_mon_holiday),
          },
          {
            dayOfWeek: "火曜日",
            startAt: formatTime(this.place.tue_start_at),
            endAt: formatTime(this.place.tue_end_at),
            isHoliday: isHoliday(this.place.is_tue_holiday),
          },
          {
            dayOfWeek: "水曜日",
            startAt: formatTime(this.place.wed_start_at),
            endAt: formatTime(this.place.wed_end_at),
            isHoliday: isHoliday(this.place.is_wed_holiday),
          },
          {
            dayOfWeek: "木曜日",
            startAt: formatTime(this.place.thu_start_at),
            endAt: formatTime(this.place.thu_end_at),
            isHoliday: isHoliday(this.place.is_thu_holiday),
          },
          {
            dayOfWeek: "金曜日",
            startAt: formatTime(this.place.fri_start_at),
            endAt: formatTime(this.place.fri_end_at),
            isHoliday: isHoliday(this.place.is_fri_holiday),
          },
          {
            dayOfWeek: "土曜日",
            startAt: formatTime(this.place.sat_start_at),
            endAt: formatTime(this.place.sat_end_at),
            isHoliday: isHoliday(this.place.is_sat_holiday),
          },
        ];
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("places", this.$cookie);
      const { error } = await request.destroy(this.place.id);
      if (!error) {
        this.$router.push("/places");
      }
    },
    gotoEdit() {
      this.$router.push(`/places/${this.place.id}/edit`);
    },
  },
};
</script>
