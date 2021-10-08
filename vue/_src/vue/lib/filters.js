import moment from 'moment'

export default {
  roundFloat(number) {
    return number.toFixed(1)
  },
  format_date_label(time) {
    return moment(time).format('YYYY/MM/DD')
  },
  year(time) {
    return moment(time).format('YYYY')
  },
  month(time) {
    return moment(time).format('MM')
  },
  date(time) {
    return moment(time).format('DD')
  },
  day(time) {
    return moment(time).format('dddd')
  },
  time(time) {
    return moment(time).format('HH:mm')
  },
  hours(time) {
    return moment(time).format('HH')
  },
  minutes(time) {
    return moment(time).format('mm')
  },
  format_datetime(datetime) {
    return moment(datetime).format('YYYY/MM/DD HH:mm')
  },

  format_age(age) {
    const num = (str) => {
      switch (true) {
        case str.includes("twenty"):
          return "20"
        case str.includes("thirty"):
          return "30"
        case str.includes("fourty"):
          return "40"
        case str.includes("fifty"):
          return "50"
        default:
          return ""
      }
    }

    const gen = (str) => {
      switch (true) {
        case str.includes("early"):
          return "前半"
        case str.includes("mid"):
          return "中頃"
        case str.includes("late"):
          return "後半"
        default:
          return ""
      }
    }

    return num(age) + "代" + gen(age)
  },
  format_blood(blood) {
    if (blood == "UN") {
      return "不明"
    } else {
      return blood + "型"
    }
  },
  format_gender(gender) {
    if (gender=="male") {
      return "MEN"
    } else if (gender=="female") {
      return "WOMEN"
    } else {
      return gender
    }
  },
  format_education(val) {
    if (val=="") {
      return ""
    } else if (val=="middle") {
      return "中学校卒"
    } else if (val=="high") {
      return "高等学校卒"
    } else if (val=="vocational") {
      return "専門学校卒"
    } else if (val=="junior_college") {
      return "短期大学卒"
    } else if (val=="university") {
      return "大学卒"
    } else if (val=="graduate") {
      return "大学院卒"
    } else {
      return val
    }
  },
  format_income(val) {
    if (val=="lower") {
      return "200万円以下"
    } else if (val=="annual300") {
      return "200〜300万円"
    } else if (val=="annual500") {
      return "300〜500万円"
    } else if (val=="annual1000") {
      return "500〜1,000万円"
    } else if (val=="annual2000") {
      return "1,000〜2,000万円"
    } else if (val=="annual3000") {
      return "2,000〜3,000万円"
    } else if (val=="annual5000") {
      return "3,000〜5,000万円"
    } else if (val=="annual100m") {
      return "5,000万 〜1億円"
    } else if (val=="annual200m") {
      return "1〜2億円"
    } else if (val=="annual300m") {
      return "2〜3億円"
    } else if (val=="annual500m") {
      return "3〜5億円"
    } else if (val=="higher") {
      return "5億円以上"
    } else {
      return val
    }
  },
  marked(str) {
    return marked(str)
  },
}
