# Adds a `state` scope to Issue for filtering by status id.
# Redmine 7 style: define the scope via prepend on a module that is
# included into Issue. Scopes work fine when added through class_eval.
module RedmineMp2
  module Patches
    module IssuePatch
      def self.prepended(base)
        base.class_eval do
          scope :state, lambda { |*args|
            id = args.size > 0 ? args.first : 1
            joins(:status).where("#{IssueStatus.table_name}.id = ?", id)
          }
        end
      end
    end
  end
end

unless Issue.included_modules.include?(RedmineMp2::Patches::IssuePatch)
  Issue.prepend(RedmineMp2::Patches::IssuePatch)
end
