<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(
          v-model="formProps.name"
          label="店舗名"
          :rules="notNullRules"
          prepend-icon="mdi-store"
        )
        v-text-field(
          v-model="formProps.telephone"
          label="電話番号"
          :rules="notNullRules"
          prepend-icon="mdi-card-account-phone"
        )
        v-text-field(
          v-model="formProps.application_email"
          label="申請メールアドレス"
          :rules="emailRules"
          prepend-icon="mdi-email"
        )
        v-text-field(
          v-model="formProps.application_comment"
          label="申請コメント"
          :rules="notNullRules"
          prepend-icon="mdi-comment"
        )
        v-text-field(
          v-model="formProps.zipcode"
          label="〒郵便番号"
          :rules="zipCodeRules"
          @change="fetchAddress"
          prepend-icon="mdi-map"
        )
        v-select(
          v-model="formProps.address1"
          :items="prefectures"
          :rules="notNullSelectionRules"
          label="所在地（都道府県）" 
          disabled
          @change="fetchAreas"
          return-object
        )
        v-text-field(
          v-model="formProps.address2"
          label="市区町村"
          disabled
          :rules="notNullRules"
        )
        v-text-field(
          v-model="formProps.address3"
          label="番地以降"
          prepend-icon="mdi-office-building-marker"
        )
        v-select(
          v-model="formProps.area_id"
          :items="areas"
          :rules="notNullRules"
          label="エリア"
          clearable
          prepend-icon="mdi-map-marker"
          no-data-text="選択中の都道府県に有効エリアがありません"
        )
        v-file-input(
          ref="logo_image"
          accept="image/*"
          label="店舗イメージ画像"
          @change="onImageChange"
        )
        v-img.mb-1(:src="imgUrl", alt="店舗イメージ画像" v-show="imgUrl" max-width="300")
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule, emailFormatRule, zipCodeRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  props: {
    id: {
      type: String,
      required: false
    },
    formTitle: {
      type: String,
      required: true
    },
    btnTitle: {
      type: String,
      required: true
    }
  },
  components: {
    CommonForm
  },
  data() {
    return {
      owners: [],
      areas: [],
      prefectures: [],
      formProps: {
        name: "",
        telephone: "",
        application_email: "",
        application_comment: "",
        area_id: 0,
        zipcode: "",
        address1: {
          text: "",
          value: 0
        },
        address2: "",
        address3: ""
      },
      commomSelection: [
        { text: "いいえ", value: false },
        { text: "はい", value: true }
      ],
      menu: false,
      imgUrl: ""
    };
  },
  computed: {
    notNullRules() {
      return [v => notNullRule(v)];
    },
    notNullSelectionRules() {
      return [v => notNullRule(v.value)];
    },
    zipCodeRules() {
      return [v => notNullRule(v), v => zipCodeRule(v)];
    },
    emailRules() {
      return [v => notNullRule(v), v => emailFormatRule(v)];
    }
  },
  created() {
    this.fetchPrefectures();
    this.fetchAreas();
  },
  methods: {
    async createResource() {
      const image = await this.getBase64(this.$refs.logo_image.lazyValue);
      let props = {};
      Object.assign(props, this.formProps);
      props.logo_image = image;
      this.$emit("createResource", props);
    },
    cancel() {
      if (confirm("入力をキャンセルします。よろしいですか?")) {
        const initVal = {
          name: "",
          telephone: "",
          application_email: "",
          area_id: 0,
          address1: {
            text: "",
            value: 0
          },
          address2: "",
          address3: ""
        };
        this.formProps = initVal;
      }
    },
    async fetchAreas() {
      let uri = "";
      if (this.formProps.address1.value) {
        uri = `areas?prefecture=${this.formProps.address1.value}`;
      } else {
        uri = `areas`;
      }
      const request = new ApiRequest(uri, this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.areas = response.data.map(record => {
          return { text: record.name, value: record.id };
        });
      }
    },
    async fetchPrefectures() {
      const request = new ApiRequest("prefectures", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.prefectures = response.data.map(record => {
          return { text: record.name, value: record.id };
        });
      }
    },
    async fetchAddress() {
      if (this.formProps.zipcode.length === 0 || zipCodeRule(this.formProps.zipcode) !== true) return;
      const request = new ApiRequest();
      const { response, error } = await request.getAddress(
        this.formProps.zipcode
      );
      if (!error) {
        const result = response.data.results[0];
        this.formProps.address1 = {
          text: result.address1,
          value: Number(result.prefcode)
        }
        this.formProps.address2 = result.address2;
        this.formProps.address3 = result.address3;
        // 取得した県でエリアを取得し直す
        await this.fetchAreas();
      } else {
        alert(error);
      }
    },
    onImageChange(e) {
      if (e) {
        this.imgUrl = URL.createObjectURL(e);
      } else {
        this.imgUrl = "";
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }
};
</script>
