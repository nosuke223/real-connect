# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      t.integer :role

      t.string :nickname
      t.string :avatar_image
      t.string :cover_image

      t.integer :area_id

      t.integer :height
      t.integer :age
      t.integer :blood
      t.integer :gender
      t.integer :income
      t.integer :education
      t.integer :prefecture

      t.boolean :alcohol
      t.boolean :tobacco

      t.string :business
      t.string :birthplace
      t.string :attracted_type
      t.string :hobbies
      t.string :fashion

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      t.string   :unlock_token # Only if unlock strategy is :email or :both
      t.datetime :locked_at

      t.timestamps null: false
      t.datetime :deleted_at
    end

    execute 'CREATE UNIQUE INDEX unique_index_on_users_email ON users(email) WHERE deleted_at IS NULL'
    add_index :users, :email
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
    add_index :users, :deleted_at
  end
end
