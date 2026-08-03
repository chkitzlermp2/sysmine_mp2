# Removes the members box from the project overview SERVER-SIDE.
#
# Hiding it with CSS (display:none) is not enough: the member names, roles and
# links would still be present in the HTML source and visible via view-source
# or the browser dev tools. Deface removes the `render 'members_box'` call from
# the compiled view, so the partial is never executed and the data never
# reaches the client.
#
# Requires the `deface` gem. Loaded explicitly from lib/redmine_mp2.rb via
# `load` inside a to_prepare block, NOT autoloaded. It deliberately lives under
# lib/ (not app/overrides) so Zeitwerk never tries to treat it as a constant,
# which would abort the Rails 8 boot.
# Target: app/views/projects/show.html.erb, the line
#   <%= render :partial => 'members_box' %>
Deface::Override.new(
  virtual_path: 'projects/show',
  name: 'mp2-remove-members-box',
  remove: 'erb[loud]:contains("members_box")'
)
