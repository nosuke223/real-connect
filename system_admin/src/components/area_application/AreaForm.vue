<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(
          v-model="formProps.name"
          label="エリア名"
          :rules="notNullRules"
          prepend-icon="mdi-store"
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
          return-object
        )
        v-text-field(
          v-model="formProps.address2"
          label="市区町村"
          disabled
          :rules="notNullRules"
        )
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
      prefectures: [],
      formProps: {
        name: "",
        application_email: "",
        application_comment: "",
        zipcode: "",
        address1: {
          text: "",
          value: 0
        },
        address2: ""
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
  },
  methods: {
    async createResource() {
      let props = {};
      props.name = this.formProps.name;
      props.application_email = this.formProps.application_email;
      props.application_comment = this.formProps.application_comment;
      props.zipcode = this.formProps.zipcode;
      props.prefecture_id = this.formProps.address1.value;
      this.$emit("createResource", props);
    },
    cancel() {
      if (confirm("入力をキャンセルします。よろしいですか?")) {
        const initVal = {
          name: "",
          application_email: "",
          address1: {
            text: "",
            value: 0
          },
          address2: ""
        };
        this.formProps = initVal;
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
      } else {
        alert(error);
      }
    },
  }
};
</script>
