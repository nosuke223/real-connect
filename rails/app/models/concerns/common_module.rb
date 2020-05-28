module CommonModule
  extend ActiveSupport::Concern
  
  module ClassMethods
    # カラム名のシンボル型の配列を返す
    def column_symbolized_names(reject=[])
      column_names.delete_if {|n| n.in?(reject)}.map(&:to_sym)
    end
  end
end
