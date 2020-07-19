<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-select(v-model="formProps.owner_id" :items="owners" :rules="nameRules" label="オーナーユーザー" clearable)
        v-text-field(v-model="formProps.name" label="店舗の名前")
        v-text-field(v-model="formProps.description" label="店舗説明・概要、特徴など")
        v-text-field(v-model="formProps.note" label="備考")
        v-text-field(v-model="formProps.telephone" label="電話番号")
        v-select(v-model="formProps.area_id" :items="areas" :rules="nameRules" label="エリア" clearable)
        v-text-field(type="postal-code" v-model="formProps.zipcode" label="〒郵便番号" :rules="zipCodeRules" )
        v-select(v-model="formProps.address1" :items="prefectures" :rules="nameRules" label="所在地（都道府県）" clearable)
        v-text-field(v-model="formProps.address2" label="市区町村および番地")
        v-text-field(v-model="formProps.address3" label="建物名、階数、部屋番号など")
        v-text-field(v-model="formProps.url" label="URL")
        v-text-field(v-model="formProps.store_type" label="店舗の種類")
        TimePicker(v-model="formProps.sun_start_at" label="日曜開店時刻")
        TimePicker(v-model="formProps.sun_end_at" label="日曜閉店時刻")  
        v-select(v-model="formProps.is_sun_holiday" :items="commomSelection" label="日曜定休日" clearable)
        TimePicker(v-model="formProps.mon_start_at" label="月曜開店時刻")
        TimePicker(v-model="formProps.mon_end_at" label="月曜閉店時刻")  
        v-select(v-model="formProps.is_mon_holiday" :items="commomSelection" label="月曜定休日" clearable)
        TimePicker(v-model="formProps.tue_start_at" label="火曜開店時刻")
        TimePicker(v-model="formProps.tue_end_at" label="火曜閉店時刻")  
        v-select(v-model="formProps.is_tue_holiday" :items="commomSelection" label="火曜定休日" clearable)
        TimePicker(v-model="formProps.wed_start_at" label="水曜開店時刻")
        TimePicker(v-model="formProps.wed_end_at" label="水曜閉店時刻")  
        v-select(v-model="formProps.is_wed_holiday" :items="commomSelection" label="水曜定休日" clearable)
        TimePicker(v-model="formProps.thu_start_at" label="木曜開店時刻")
        TimePicker(v-model="formProps.thu_end_at" label="木曜閉店時刻")  
        v-select(v-model="formProps.is_thu_holiday" :items="commomSelection" label="木曜定休日" clearable)
        TimePicker(v-model="formProps.fri_start_at" label="金曜開店時刻")
        TimePicker(v-model="formProps.fri_end_at" label="金曜閉店時刻")  
        v-select(v-model="formProps.is_fri_holiday" :items="commomSelection" label="金曜定休日" clearable)
        TimePicker(v-model="formProps.sat_start_at" label="土曜開店時刻")
        TimePicker(v-model="formProps.sat_end_at" label="土曜閉店時刻")  
        v-select(v-model="formProps.is_sat_holiday" :items="commomSelection" label="土曜定休日" clearable)

        
</template>

<script>
import CommonForm from "../utils/CommonForm";
import TimePicker from "../utils/TimePicker";
import { notNullRule, zipCodeRule } from "@/utils/validation";
import { formatTime } from "@/utils/format_date";
import ApiRequest from "@/api/base";

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
    formTitle: {
      type: String,
      required: true,
    },
    btnTitle: {
      type: String,
      required: true,
    },
  },
  components: {
    CommonForm,
    TimePicker,
  },
  data() {
    return {
      owners: [],
      areas: [],
      prefectures: [],
      formProps: {
        name: "",
        owner_id: 0,
        area_id: 0,
        zipcode: "",
        description: "",
        note: "",
        store_type: "",
        address1: "",
        address2: "",
        address3: "",
        telephone: "",
        url: "",
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
      },
      commomSelection: [
        { text: "いいえ", value: false },
        { text: "はい", value: true },
      ],
      menu: false,
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
    zipCodeRules() {
      return [(v) => zipCodeRule(v)];
    },
  },
  created() {
    this.fetchOwners();
    this.fetchPrefectures();
    this.fetchAreas();
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      if (this.id) {
        const request = new ApiRequest("places", this.$cookie);
        const { response, error } = await request.show(this.id);
        if (!error) {
          const data = response.data;
          this.formProps.name = data.name;
          this.formProps.owner_id = data.owner_id;
          this.formProps.area_id = data.area_id;
          this.formProps.zipcode = data.zipcode;
          this.formProps.description = data.description;
          this.formProps.note = data.note;
          this.formProps.store_type = data.store_type;
          this.formProps.address1 = data.address1;
          this.formProps.address2 = data.address2;
          this.formProps.address3 = data.address3;
          this.formProps.telephone = data.telephone;
          this.formProps.url = data.url;
          this.formProps.sun_start_at = formatTime(data.sun_start_at);
          this.formProps.sun_end_at = formatTime(data.sun_end_at);
          this.formProps.is_sun_holiday = data.is_sun_holiday;
          this.formProps.mon_start_at = formatTime(data.mon_start_at);
          this.formProps.mon_end_at = formatTime(data.mon_end_at);
          this.formProps.is_mon_holiday = data.is_mon_holiday;
          this.formProps.tue_start_at = formatTime(data.tue_start_at);
          this.formProps.tue_end_at = formatTime(data.tue_end_at);
          this.formProps.is_tue_holiday = data.is_tue_holiday;
          this.formProps.wed_start_at = formatTime(data.wed_start_at);
          this.formProps.wed_end_at = formatTime(data.wed_end_at);
          this.formProps.is_wed_holiday = data.is_wed_holiday;
          this.formProps.thu_start_at = formatTime(data.thu_start_at);
          this.formProps.thu_end_at = formatTime(data.thu_end_at);
          this.formProps.is_thu_holiday = data.is_thu_holiday;
          this.formProps.fri_start_at = formatTime(data.fri_start_at);
          this.formProps.fri_end_at = formatTime(data.fri_end_at);
          this.formProps.is_fri_holiday = data.is_fri_holiday;
          this.formProps.sat_start_at = formatTime(data.sat_start_at);
          this.formProps.sat_end_at = formatTime(data.sat_end_at);
          this.formProps.is_sat_holiday = data.is_sat_holiday;
        }
      }
    },
    createResource() {
      this.$emit("createResource", this.formProps);
    },
    cancel() {
      if (this.$route.params.id) {
        this.$router.push(`/places/${this.$route.params.id}`);
      } else {
        this.$router.push(`/places`);
      }
    },
    async fetchOwners() {
      const request = new ApiRequest("users?role=owner", this.$cookie);
      const { response, error } = await request.index({
        role: "user",
      });
      if (!error) {
        this.owners = response.data.map((record) => {
          return { text: record.email, value: record.id };
        });
      }
    },
    async fetchAreas() {
      const request = new ApiRequest("areas", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.areas = response.data.map((record) => {
          return { text: record.name, value: record.id };
        });
      }
    },
    async fetchPrefectures() {
      const request = new ApiRequest("prefectures", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.prefectures = response.data.map((record) => {
          return { text: record.name, value: record.name };
        });
      }
    },
  },
};
</script>
