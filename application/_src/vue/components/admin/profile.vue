<template lang="pug">
  article#account.l-pane.l-pane--full.is-visible
    header.l-pane__header.p-pane-control.u-mode-bg--ltSM
      .p-pane-control__heading
        span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
        span.p-pane-control__title.u-visible--gtMD 店舗・会場情報
      .p-pane-control__button( data-block='admin-profile' )
        i.glyph.glyph-account
      .p-pane-control__button( data-block='menu' )
        i.glyph ︙
    section.l-pane__body(v-if='ownPlaceFormData')
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          .p-block-content
            .p-account
              .p-account__title
                label.p-avatar(for='logo_image' v-if='ownPlaceFormData.logo_image')
                  img.is_preview(:src='logo_image_preview' v-if='logo_image_preview')
                  img.is_origin(:src='ownPlaceFormData.logo_image' v-else)
                input(type='file' @change='onSelectedLogoImage' id='logo_image')
                .p-username
                  small 店舗・会場情報
                  input( type='text' name='' placeholder='入力してください' v-model='ownPlaceFormData.name' )
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

            section
              h3 カバー画像
              label.p-cover( data-modal='cover-select' )
                input(type='file' name='cover_image' @change='onSelectedCoverImage' id='cover_image')
                img.is_preview(:src='cover_image_preview' v-if='cover_image_preview')
                img.is_origin(:src='ownPlaceFormData.cover_image' v-else-if='ownPlaceFormData.cover_image')
                img.is_default(:src='"/_assets/img/default_svg/default-"+ String(userData.id).slice(-2) +".svg"' v-else)
            section
              h3 会場の種別・店舗業態
              p
                | 例えば、イベント会場であれば、「屋外特設会場」や「〇〇セミナー会場」、店舗であれば「イタリアンバル」や「個室居酒屋」などが良いでしょう。
              .input-field
                input(type='text' name='place_type' autocomplete='off' placeholder='入力してください' v-model='ownPlaceFormData.store_type' )
                i.glyph.glyph-pen
                i.glyph.glyph-check-circle.u-color--primary01

            section
              h3 会場・店舗について（概要、特徴など）
              .input-field
                textarea(name='overview' placeholder='入力してください' v-model='ownPlaceFormData.description')
                i.glyph.glyph-pen
                i.glyph.glyph-check-circle.u-color--primary01

          .p-block-content
            section
              h3 営業時間・開催時間

            div(v-for="weekday of weekdays")
              .c-opentime-field
                .c-opentime-field__label {{ weekdayJPs[weekday] }}
                .c-opentime-field__body
                  .c-opentime-field__select
                    .c-opentime-field__select-group
                      select.c-select-default(v-model="ownPlaceFormData[weekday].start_at_hour")
                        option(value='' disabled) --
                        - for (h = 0; h < 18; h++)
                          - h = ( '00' + h ).slice( -2 )
                          option(value=h) #{h}
                        option(value='18' selected) 18
                        - for (h = 19; h < 24; h++)
                          - h = ( '00' + h ).slice( -2 )
                          option(value=h) #{h}
                      select.c-select-default(v-model="ownPlaceFormData[weekday].start_at_minute")
                        option(value='' disabled) --
                        - for (m = 0; m < 12; m++)
                          - let m_ = m * 5
                          - m_ = ( '00' + m_ ).slice( -2 )
                          option(value=m_) #{m_}
                    i.glyph.glyph-cart-right
                    .c-opentime-field__select-group
                      select.c-select-default(v-model="ownPlaceFormData[weekday].end_at_hour")
                        option(value='' disabled) --
                        - for (h = 0; h < 18; h++)
                          - h = ( '00' + h ).slice( -2 )
                          option(value=h) #{h}
                        option(value='18' selected) 18
                        - for (h = 19; h < 24; h++)
                          - h = ( '00' + h ).slice( -2 )
                          option(value=h) #{h}
                      select.c-select-default(v-model="ownPlaceFormData[weekday].end_at_minute")
                        option(value='' disabled) --
                        - for (m = 0; m < 12; m++)
                          - let m_ = m * 5
                          - m_ = ( '00' + m_ ).slice( -2 )
                          option(value=m_) #{m_}

                  .c-opentime-field__checkbox
                    label.c-checkbox
                      input.c-opentime-close(type='checkbox' v-model=`ownPlaceFormData[weekday].is_holiday`)
                      span.c-checkbox__mirror
                      | 定休日

          .p-block-content
            section
              h3 店舗・会場の基本情報

              section
                h3 エリア
                p 会場が属するエリアを選択してください。
                .input-field
                  label.c-select
                    select.c-select__item(name='area')
                      option(value='' selected disabled) エリアを選択してください
                      option(value='ar001') 福岡市 中央区エリア
                      option(value='ar002') 福岡市 博多区エリア

              section
                h3 所在地
                p ※都道府県名は不要です。

              section
                h3 市区町村 番地
                .input-field
                  input(type='text' name='address1' autocomplete='off' placeholder='入力してください' v-model='ownPlaceFormData.address')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

              section
                h3 建物名、階数、部屋番号など（任意）
                .input-field
                  input(type='text' name='address2' autocomplete='off' placeholder='入力してください' v-model='ownPlaceFormData.building')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

              section
                h3 電話番号
                .input-field
                  input(type='tel' name='tel' autocomplete='off' placeholder='入力してください' v-model='ownPlaceFormData.telephone')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

              section
                h3 公式サイトURL
                .input-field
                  input(type='text' name='site' autocomplete='off' placeholder='入力してください' v-model='ownPlaceFormData.url')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

              section
                h3 備考
                .input-field
                  textarea(name='remarks' placeholder='入力してください' v-model='ownPlaceFormData.note')
                  i.glyph.glyph-pen
                  i.glyph.glyph-check-circle.u-color--primary01

          .p-block-content
            button.u-bg--primary(@click='onClickUpdateButton()') 更新する
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
    this.requestFetchUser();
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
      weekdays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      weekdayJPs: {'sun': '日', 'mon': '月', 'tue': '火', 'wed': '水', 'thu': '木', 'fri': '金', 'sat': '土'},
      logo_image_preview: null,
      cover_image_preview: null,
    }
  },
  methods: {
    /**
     * フォーム用データを設定
     */
    setFormData() {
      this.ownPlaceFormData = _.clone(this.userData.own_places);

      // select用に営業時間のデータを調整
      this.weekdays.forEach(weekday => {
        this.ownPlaceFormData[weekday] = {
          is_holiday:  this.ownPlaceFormData[`is_${weekday}_holiday`],
        };
        ['start_at', 'end_at'].forEach(label => {
          const time = this.ownPlaceFormData[`${weekday}_${label}`];
          const momentObj = moment(time, 'HH:mm');
          const hour = momentObj.format('HH');
          const minute = momentObj.format('mm');
          this.ownPlaceFormData[weekday][`${label}_hour`] = hour;
          this.ownPlaceFormData[weekday][`${label}_minute`] = minute;
        });
      });
    },
    /**
     * 画像をフォームデータに設定
     */
    setImageToData(e, modelKey) {
      const files = e.target.files || e.dataTransfer.files;
      if (files.length) {
        const image = files[0];
        const reader = new FileReader();
        const that = this;
        reader.onload = (e) => {
          this[`${modelKey}_preview`] = e.target.result;
        }
        reader.readAsDataURL(image);
        this.ownPlaceFormData[modelKey] = image;
      }
    },
    /**
     * ロゴ画像選択時
     */
    onSelectedLogoImage(e) {
      this.setImageToData(e, 'logo_image');
    },
    /**
     * カバー画像選択時
     */
    onSelectedCoverImage(e) {
      this.setImageToData(e, 'cover_image');
    },
    /**
     * 更新するボタン押下時
     */
    onClickUpdateButton() {
      const data = _.clone(this.ownPlaceFormData);

      // select用に調整した営業時間データを整型
      this.weekdays.forEach(weekday => {
        const startAt = `${data[weekday]['start_at_hour']}:${data[weekday]['start_at_minute']}`;
        const endAt = `${data[weekday]['end_at_hour']}:${data[weekday]['end_at_minute']}`;
        const isHoliday =  data[weekday]['is_holiday'];

        data[`${weekday}_start_at`] = startAt;
        data[`${weekday}_end_at`] = endAt;
        data[`is_${weekday}_holiday`] = isHoliday;

        delete data[weekday];
      });

      this.requestUpdateOwnPlace(data);
    },
    /**
     * 場所の情報を更新する
     */
    requestUpdateOwnPlace(ownPlaceData) {
      const data = new FormData();
      Object.keys(ownPlaceData).forEach((key, index) => {
        data.append(key, ownPlaceData[key])
      });

      request('PUT', '/owners/places/' + ownPlaceData.id, { data })
      .then((result) => {
        if (result.error) {
          this.handleRequestError(result.error);
        } else {
          this.userData.own_places = result.data;
          alert('更新が完了しました')
        }
      })
    },

    /**
     * ログインユーザーの情報を取得する
     */
    requestFetchUser() {
      request('GET', '/users')
      .then((result) => {
        if (result.error) {
        } else {
          this.user = result.data;
          this.setFormData();
        }
      })
    },
  },
  filters,
}
</script>