<template lang="pug">
  article#account.l-pane.l-pane--full.is-visible
    header.l-pane__header.p-pane-control.u-mode-bg--ltSM
      .p-pane-control__heading
        span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
        span.p-pane-control__title.u-visible--gtMD 登録情報の変更
      .p-pane-control__button( data-block='admin-profile' )
        i.glyph.glyph-account
      .p-pane-control__button( data-block='menu' )
        i.glyph ︙
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          .p-block-content.p-block-content--full
            section
              h3 会員情報の確認・変更・削除
              section
                h4 Eメールアドレス
                p 現在のEメールアドレス（プロフィールやトーク相手には公開されません）
                p.mail-preview {{ userData.email }}
                p
                  | Eメールアドレスを変更する場合は下記の入力欄に新しいEメールアドレスを入力し、「確認メールを送信する」ボタンを押下してください。
                  br
                  | 入力したEメールアドレスに確認メールが送信されます。
                  br
                  | 確認メールに記載のメール認証ボタンを押して、Eメールアドレスの変更を完了させてください。
                  br
                  | （メール認証が完了するまでは、変更前のEメールアドレスがログイン用のEメールアドレスとなります。）
                .input-field
                  input(type='email' name='email' autocomplete='off' placeholder='新しいEメールアドレスを入力' v-model='newEmail')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01
                button.u-bg--primary(@click='onClickChangeEmail()') 確認メールを送信する

              section
                h4 パスワード
                p
                  | 現在のパスワードはセキュリティの都合上、確認できません。
                  br
                  | パスワードを変更する場合は下記の「新しいパスワードを入力」と「新しいパスワードを再度入力」の欄に新しいパスワードを入力し、「パスワードを変更する」ボタンを押下してください。
                  br
                  | なお、パスワードは半角英数字と記号を織り交ぜた、特定の意味を持たない8文字以上の文字列にて登録してください。
                .input-field
                  input(type='password' name='password' autocomplete='off' placeholder='新しいパスワードを入力' v-model='newPassword')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01
                p 上記で入力した新しいパスワードと同じパスワードを再度入力してください。
                .input-field
                  input(type='password' name='password_confirmation' autocomplete='off' placeholder='新しいパスワードを再度入力' v-model='newPasswordConfirmation')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01
                button.u-bg--primary(@click='onClickChangePassword()') パスワードを変更する
              //- section
                h4 ログイン情報
                p ご自身による操作でない場合は、アカウントが不正に使用されているおそれがあります。
                .p-activity
                  .p-activity__device
                    i.glyph.glyph-desktop
                    | Mac
                  .p-activity__detail
                    .p-activity__browser ブラウザ : Chrome
                    .p-activity__time 日時 : 8月5日 13:05
                    .p-activity__place 場所 : 日本、福岡県付近
                .p-activity
                  .p-activity__device
                    i.glyph.glyph-mobile-alt
                    | Samsung Galaxy S6 Edge
                  .p-activity__detail
                    .p-activity__browser ブラウザ : Chrome
                    .p-activity__time 日時 : 8月3日 21:12
                    .p-activity__place 場所 : 日本、福岡県付近
                p これらのアクティビティに心当たりがありますか？
                button.u-bg--primary この端末以外をログアウト
              //- section
                h4 退会手続き
                p 退会についての留意事項をよくお読みになった上で、「退会手続きへ進む」ボタンを押下してください。
                ul
                  li ユーザー間でのトラブルや、皆様が安心して利用できる環境への取り組みのため、退会手続きを行ってもアカウントに使用していたデータは弊社サーバー上に一定期間保存されます。
                  li 第三者のなりすまし防止対策の一環として、一度退会してしまったアカウントを復旧することはできません。
                  li 退会したユーザーへはトークメッセージは送信されませんが、閲覧制限時間内であればトーク相手からは閲覧のみ可能となります。また、退会を行ったユーザーのプロフィールは閲覧できません。
                  li 退会を行った後でも、トーク相手から閲覧環境にキャッシュされたプロフィールのデータが閲覧できる時間的なずれが生じる場合があります。
                  li 退会手続きを行ったユーザー本人からであっても、退会後のユーザーの情報を開示することはできません。ただし、法律又は法律に基づく命令に別段の定めがある場合は、この限りではありません。
                button.u-bg--primary(@click='openModal("deleteAccount")') 退会手続きへ進む
              section
                h4 ログアウト
                button.u-bg--error(@click='onClickLogout()') ログアウト
</template>

<script>
import { request } from '../../lib/request.js'
import filters from '../../lib/filters.js'
import _ from 'lodash'
import moment from 'moment'

export default {
  props: [
    'userData',
    'handleRequestError',
  ],
  mounted() {
  },
  data() {
    return {
      /**
       * モデル用データ
       */
      ownPlaceFormData: null,

      /**
       * 描画用データ
       */
      newEmail: null,
      newPassword: null,
      newPasswordConfirmation: null,
    }
  },
  methods: {
    /**
     * メールアドレス変更ボタン押下時
     */
    onClickChangeEmail() {
      const data = {
        email: this.newEmail,
      };
      this.requestUpdateUser(data, '入力したEメールアドレスに確認メールが送信されます。');
    },
    /**
     * パスワード変更ボタン押下時
     */
    onClickChangePassword() {
      const data = {
        password: this.newPassword,
        password_confirmation: this.newPasswordConfirmation,
      };
      this.requestUpdateUser(data, 'パスワードを更新しました。');
    },
    /**
     * ログアウトボタン押下時
     */
    onClickLogout() {
      this.requestLogoutUser();
    },

    /**
     * ユーザー情報更新
     */
    requestUpdateUser(data, alertMessage) {
      request('PUT', '/users', { data })
        .then(result => {
          if (result.error) {
            this.handleRequestError(result.error);
          } else {
            alert(alertMessage);
          }
        })
    },
    /**
     * ログアウトを実行する
     */
    requestLogoutUser() {
      const result = confirm('ログアウトしますか？');
      if (result) {
        request('DELETE', '/sessions')
        .then(() => {
          this.setCurrentUserData(null);
        })
      }
    },
  },
  filters,
}
</script>