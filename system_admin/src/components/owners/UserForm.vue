<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="作成" cardTitle="店舗管理ユーザー作成" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(:value="email" required :rules="emailRules" label="メールアドレス" @change="updateValue('email', $event)")
        v-text-field(:value="password" type="password" label="パスワード" @change="updateValue('password', $event)" hint="空白なら保存しません")
        v-text-field(:value="nickname" required label="ニックネーム" @change="updateValue('nickname', $event)")
        v-text-field(:value="full_name" required label="フルネーム" @change="updateValue('full_name', $event)")
        v-text-field(:value="telephone" type="tel" required label="電話番号" @change="updateValue('telephone', $event)")
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule, emailFormatRule } from "@/utils/validation";

export default {
  components: {
    CommonForm,
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
    cancel() {
      if (this.$route.params.id) {
        this.$router.push(`/owners/${this.$route.params.id}`);
      } else {
        this.$router.push(`/owners`);
      }
    },
  },
};
</script>
