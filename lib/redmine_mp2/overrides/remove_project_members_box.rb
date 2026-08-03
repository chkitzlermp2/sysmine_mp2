# Removes the members box from the project overview SERVER-SIDE.
#
# Hiding it with CSS (display:none) is not enough: the member names, roles and
# links would still be present in the HTML source and visible via view-source
# or the browser dev tools. Deface removes the `render 'members_box'` call from
# the compiled view, so the partial is never executed and the data never
# reaches the client.
#
# This file lives under lib/ which Redmine adds to the Zeitwerk autoload paths,
# so it MUST define the constant Zeitwerk expects for its path
# (RedmineMp2::Overrides::RemoveProjectMembersBox). We therefore wrap the
# Deface::Override in a module and register it from an .apply method that is
# called in a to_prepare block (see lib/redmine_mp2.rb).
#
# Target: app/views/projects/show.html.erb, the line
#   <%= render :partial => 'members_box' %>
module RedmineMp2
  module Overrides
    module RemoveProjectMembersBox
      def self.apply
        return unless defined?(Deface)

        Deface::Override.new(
          virtual_path: 'projects/show',
          name: 'mp2-remove-members-box',
          remove: 'erb[loud]:contains("members_box")'
        )
      end
    end
  end
end
