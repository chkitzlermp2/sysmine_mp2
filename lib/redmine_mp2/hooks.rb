module RedmineMp2
  # View hooks. These inject mp2 markup into the stock Redmine views
  # WITHOUT replacing any core template, so the plugin survives upgrades.
  class Hooks < Redmine::Hook::ViewListener
    # Rendered INSIDE core's <div class="attributes"> (issues/show),
    # right before the closing tag. We hide the core rows via CSS and
    # show our own two-column, collapsible block instead.
    def view_issues_show_details_bottom(context = {})
      issue = context[:issue]
      return '' unless issue

      context[:controller].send(:render_to_string,
        partial: 'issues/mp2_attributes',
        locals:  { issue: issue })
    end

    # Load mp2 CSS + JS on every page (small, harmless if unused).
    # The customer-mode flag is exposed as a <meta> tag; mp2.js reads it and
    # toggles the body class. Keeping it out of Ruby view logic means the
    # setting can change without touching templates.
    def view_layouts_base_html_head(context = {})
      customer_mode = RedmineMP2Helper.get_setting(:darkmode).to_s == '1'
      tag.meta(name: 'mp2-customer-mode', content: customer_mode.to_s) +
        stylesheet_link_tag('mp2', plugin: 'redmine_mp2') +
        javascript_include_tag('mp2', plugin: 'redmine_mp2')
    end

    # mp2 footer (Impressum / Datenschutz) on every page.
    def view_layouts_base_body_bottom(context = {})
      tag.div(class: 'mp2-footer') do
        raw(
          "&copy; #{Date.today.year} MP2 IT-Solutions GmbH | " \
          "#{link_to('Impressum', 'https://www.mp2.at/impressum')} | " \
          "#{link_to('Datenschutz', 'https://www.mp2.at/datenschutz')}"
        )
      end
    end

    # Injected before page content: mp2 welcome banner (home page).
    # The project phase overview is inserted server-side via Deface
    # (app/overrides/projects/show/insert_phase_overview.deface), so it is not
    # handled here anymore.
    def view_layouts_base_content(context = {})
      controller = context[:controller]
      return '' unless controller

      out = +''

      # Welcome page banner.
      if controller.is_a?(WelcomeController) && controller.action_name == 'index'
        out << tag.div(class: 'mp2-banner') do
          link_to('', 'https://www.mp2.at/', class: 'main_banner_1') +
            link_to('', 'https://www.mp2.at/', class: 'main_banner_2')
        end
      end

      out.html_safe
    end
  end
end
