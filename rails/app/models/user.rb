# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  age                    :integer
#  alcohol                :boolean
#  attracted_type         :string
#  avatar_image           :string
#  birthplace             :string
#  blood                  :integer
#  business               :string
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  cover_image            :string
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :string
#  deleted_at             :datetime
#  education              :integer
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  failed_attempts        :integer          default(0), not null
#  fashion                :string
#  gender                 :integer
#  height                 :integer
#  hobbies                :string
#  income                 :integer
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :string
#  locked_at              :datetime
#  nickname               :string
#  prefecture             :integer
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :integer
#  sign_in_count          :integer          default(0), not null
#  tobacco                :boolean
#  unconfirmed_email      :string
#  unlock_token           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  area_id                :integer
#  current_place_id       :integer
#  last_place_id          :integer
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_deleted_at            (deleted_at)
#  index_users_on_email                 (email)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#  unique_index_on_users_email          (email) UNIQUE WHERE (deleted_at IS NULL)
#

class User < ApplicationRecord
  acts_as_paranoid
  mount_uploader :avatar_image, UserAvatarImageUploader
  mount_uploader :cover_image, UserCoverImageUploader
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  # -------------------------------------------------------------------------------
  # Enumerables
  # -------------------------------------------------------------------------------
  enum role: {
    user:  1000, # 一般ユーザー
    owner: 2000, # オーナー
    admin: 3000  # システム管理
  }

  enum age: {
    early_twenty: 1, # 20代前半
    late_twenty: 2, # 20代後半
    thirty:  3, # 30代
    fourty:  4, # 40代
    fifty:  5 # 50代
  }

  enum blood: {
    A: 1, # A型
    B: 2, # B型
    O: 3, # O型
    AB: 4 # AB型
  }

  enum gender: {
    male: 1, # 男性
    female: 2 #女性
  }

  enum income: {
    lower: 1,
    annual300: 2,
    annual500: 3,
    annual1000: 4,
    annual2000: 5,
    annual3000: 6,
    annual5000: 8,
    annual100m: 9,
    annual200m: 10,
    annual300m: 11,
    annual500m: 12,
    higher: 13
  }

  enum education: {
    middle: 1,
    high: 2,
    vocational: 3,
    junior_college: 4,
    university: 5,
    graduate: 6
  }

  enum prefecture: {
    hokkaido: 1,
    aomori: 2,
    iwate: 3,
    miyagi: 4,
    akita: 5,
    yamagata: 6,
    fukushima: 7,
    ibaraki: 8,
    tochigi: 9,
    gunma: 10,
    saitama: 11,
    chiba: 12,
    tokyo: 13,
    kanagawa: 14,
    niigata: 15,
    toyama: 16,
    ishikawa: 17,
    fukui: 18,
    yamanashi: 19,
    nagano: 20,
    gifu: 21,
    shizuoka: 22,
    aichi: 23,
    mie: 24,
    shiga: 25,
    kyoto: 26,
    osaka: 27,
    hyogo: 28,
    nara: 29,
    wakayama: 30,
    tottori: 31,
    shimane: 32,
    okayama: 33,
    hiroshima: 34,
    yamaguchi: 35,
    tokushima: 36,
    kagawa: 37,
    ehime: 38,
    kochi: 39,
    fukuoka: 40,
    saga: 41,
    nagasaki: 42,
    kumamoto: 43,
    oita: 44,
    miyazaki: 45,
    kagoshima: 46,
    okinawa: 47
  }

  # -------------------------------------------------------------------------------
  # Validations
  # -------------------------------------------------------------------------------
  validates :password, confirmation: true,
                       format: { with: /\A[a-z\d]{8,100}+\z/i, message: 'は半角英数字で入力してください' },
                       on: :create
  validates :password, confirmation: true,
                       format: { with: /\A[a-z\d]{8,100}+\z/i, message: 'は半角英数字で入力してください' },
                       on: :update, allow_blank: true
  validates :password_confirmation, presence: true, on: :create
  validates :password_confirmation, presence: true, on: :update, allow_blank: true
  validates :nickname, presence: true, if: :confirmed_user?
  validates :avatar_image, presence: true, if: :confirmed_user?
  validates :fashion, presence: true, if: :confirmed_user?
  validates :area, presence: true, if: :confirmed_user?
  validates :gender, presence: true, if: :confirmed_user?
  validates :blood, presence: true, if: :confirmed_user?
  validates :age, presence: true, if: :confirmed_user?
  validates :height, presence: true, if: :confirmed_user?
  validates :tobacco, inclusion: {in: [true, false]}, if: :confirmed_user?
  validates :alcohol, inclusion: {in: [true, false]}, if: :confirmed_user?

  # -------------------------------------------------------------------------------
  # Attributes
  # -------------------------------------------------------------------------------
  attribute :role, :integer, default: roles[:user]

  # -------------------------------------------------------------------------------
  # Callbacks
  # -------------------------------------------------------------------------------
  before_update do
    # 登録完了時のウェルカムレター（空だったニックネームが設定される）
    send_welcome_letter if nickname_changed? && nickname_was.blank?
  end

  # -------------------------------------------------------------------------------
  # Relations
  # -------------------------------------------------------------------------------
  has_many :event_users
  has_many :place_users
  has_many :events, through: :event_users
  has_many :places, through: :place_users
  has_many :talks
  has_many :own_places, class_name: 'Place', foreign_key: 'owner_id'
  belongs_to :area, optional: true

  #
  # イベントにチェックイン
  #
  def event_checkin(event, code)
    raise ActiveRecord::RecordInvalid unless confirmed_user?
    raise ActiveRecord::RecordInvalid if event.check_in_code != code
    self.event_users.create(event_id: event.id, gender: self.gender)
  end

  #
  # 場所にチェックイン
  #
  def place_checkin(place_id)
    raise ActiveRecord::RecordInvalid unless confirmed_user?

    self.place_users.create(
      place_id: place_id,
      age: self.age
    )

    # 非正規化
    self.update(
      current_place_id: place_id,
      last_place_id: self.current_place_id
    )
  end

  #
  # 新規登録メール
  #
  def send_on_create_confirmation_instructions
    generate_confirmation_token! unless @raw_confirmation_token
    send_devise_notification(:confirmation_on_create_instructions, @raw_confirmation_token, {})
  end

  #
  # 確認メール再送信
  #
  def resend_confirmation_instructions
    raise ActiveRecord::RecordInvalid if confirmed?
    now = Time.zone.now
    raise Exception.new('しばらく時間をおいてからお試しください') if now - self.confirmation_sent_at < 1.minutes
    self.send_confirmation_instructions
    self.update!(confirmation_sent_at: now)
  end

  protected

  def confirmation_required?
    false
  end

  private

  #
  # JWTトークンのjtiを生成しておく
  #
  def generate_jti
    self.jti = SecureRandom.uuid
  end

  #
  # 本登録のメールを送信
  #
  def send_welcome_letter
    send_devise_notification(:welcome_letter)
  end

  #
  # メール認証済みユーザーか
  #
  def confirmed_user?
    self.user? && self.confirmed?
  end
end
