<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="作成" cardTitle="ユーザー作成" @submit="createResource")
      div(slot="fields")
        v-text-field(:value="email" required :rules="emailRules" label="メールアドレス" @change="updateValue('email', $event)")
        v-text-field(:value="password" type="password" required label="パスワード" @change="updateValue('password', $event)" hint="空白なら保存しません")
        v-text-field(:value="nickname" required label="ニックネーム" @change="updateValue('nickname', $event)")
        v-text-field(:value="full_name" required label="フルネーム" @change="updateValue('full_name', $event)")
        v-text-field(:value="telephone" type="tel" required label="電話番号" @change="updateValue('telephone', $event)")
        v-text-field(:value="height" type="number" required label="身長" @change="updateValue('height', $event)" hint="cm")
        v-select(:value="prefecture_id" :items="prefectures" label="都道府県" clearable @change="updateValue('prefecture_id', $event)")
        v-select(:value="area_id" :items="areas" label="地域（エリア)" clearable @change="updateValue('area_id', $event)")
        v-select(:value="gender" :items="genders" label="性別" clearable @change="updateValue('gender', $event)")
        v-select(:value="age" :items="ages" label="年齢" clearable @change="updateValue('age', $event)")
        v-select(:value="blood" :items="bloods" label="血液型" clearable @change="updateValue('blood', $event)")
        v-text-field(:value="fashion" type="text" label="ファッション" @change="updateValue('fashion', $event)")
        v-select(:value="tobacco" :items="tobaccos"  label="タバコ" clearable @change="updateValue('tobacco', $event)")
        v-select(:value="alcohol" :items="alcohols" label="お酒" clearable @change="updateValue('alcohol', $event)")
        v-select(:value="income" :items="incomes" label="収入" clearable @change="updateValue('income', $event)")
        v-select(:value="education" :items="educations" label="最終学歴" clearable @change="updateValue('education', $event)")
        v-text-field(:value="business" type="text" label="職業" @change="updateValue('business', $event)")
        v-text-field(:value="birthplace" type="text" label="出身地" @change="updateValue('birthplace', $event)")
        v-text-field(:value="attracted_type" type="text" label="好みの異性のタイプ" @change="updateValue('attracted_type', $event)")
        v-text-field(:value="hobbies" type="text" label="趣味" @change="updateValue('hobbies', $event)")

</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule, emailFormatRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      ages: [],
      bloods: [],
      genders: [],
      incomes: [],
      educations: [],
      prefectures: [],
      alcohols: [
        { text: "飲まない", value: false },
        { text: "飲む", value: true },
      ],
      tobaccos: [
        { text: "吸わない", value: false },
        { text: "吸う", value: true },
      ],
      areas: [],
    };
  },
  props: {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    nickname: {
      type: String,
      required: false,
    },
    full_name: {
      type: String,
      required: false,
    },
    telephone: {
      type: String,
      required: false,
    },
    height: {
      type: [String, Number],
      required: false,
    },
    area_id: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    blood: {
      type: String,
      required: false,
    },
    income: {
      type: String,
      required: false,
    },
    education: {
      type: String,
      required: false,
    },
    prefecture_id: {
      type: Number,
      required: false,
    },
    business: {
      type: String,
      required: false,
    },
    birthplace: {
      type: String,
      required: false,
    },
    attracted_type: {
      type: String,
      required: false,
    },
    hobbies: {
      type: String,
      required: false,
    },
    fashion: {
      type: String,
      required: false,
    },
    tobacco: {
      type: Boolean,
      required: false,
    },
    alcohol: {
      type: Boolean,
      required: false,
    },
  },
  created() {
    this.fetchSelectionValue();
    this.fetchPrefectures();
    this.fetchAreas();
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
    emailRules() {
      return [(v) => emailFormatRule(v)];
    },
  },
  methods: {
    updateValue(type, event) {
      this.$emit("updateValue", type, event);
    },
    createResource() {
      this.$emit("createResource");
    },
    async fetchSelectionValue() {
      const request = new ApiRequest("users", this.$cookie);
      const { response, error } = await request.requestWrapper(
        "get",
        `users/selections`
      );
      if (!error) {
        const data = response.data;
        this.ages = data.age;
        this.bloods = data.blood;
        this.genders = data.gender;
        this.incomes = data.income;
        this.educations = data.education;
      }
    },
    async fetchPrefectures() {
      const request = new ApiRequest("prefectures", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.prefectures = response.data.map((record) => {
          return { text: record.name, value: record.id };
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
  },
};
</script>
