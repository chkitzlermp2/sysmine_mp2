module RedmineMp2
	module Patches
		module IssuesHelperPatch
			def self.included(base)
				base.extend(ClassMethods)
				base.send(:include, InstanceMethods)
			end

			# Class methods
			module ClassMethods
				
			end
		  
			# Instance methods
			module InstanceMethods
				class IssueFieldsRowsMP2
					include ActionView::Helpers::TagHelper

					def initialize
					  @left = []
					  @right = []
					end

					def left(*args)
					  args.any? ? @left << cells(*args) : @left
					end

					def right(*args)
					  args.any? ? @right << cells(*args) : @right
					end

					def size
					  @left.size > @right.size ? @left.size : @right.size
					end

					def to_html
					  content =
					    content_tag('div', @left.reduce(&:+), :class => 'splitcontentleft') +
						content_tag('div',
							content_tag('a', 'Zusätzliche Informationen', :id => 'hideAttributes', :href => '#hideAttributes', :class => 'hideExpanded') +
							content_tag('a', 'Zusätzliche Informationen', :id => 'showAttributes', :href => '#showAttributes', :class => 'showCollapsed') +
							content_tag('div', @right.reduce(&:+), :class => 'detailsCollapsed'),
						:class => 'splitcontentright')

					  content_tag('div', content, :class => 'splitcontent')
					end

					def cells(label, text, options={})
					  options[:class] = [options[:class] || "", 'attribute'].join(' ')
					  content_tag 'div',
						content_tag('div', label + ":", :class => 'label') + content_tag('div', text, :class => 'value'),
						options
					end
				end

				def issue_fields_rows_mp2
				r = IssueFieldsRowsMP2.new
				yield r
				r.to_html
				end
			
				def render_half_width_custom_fields_rows_mp2(issue, rows)
					values = issue.visible_custom_field_values.reject {|value| value.custom_field.full_width_layout?}
					return if values.empty?
					values.each_with_index do |value, i|
                                          if value.custom_field.id == 24 || value.custom_field.id == 44
							css = "cf_#{value.custom_field.id} "
							rows.left custom_field_name_tag(value.custom_field), show_value(value), :class => css
						  else
							css = "cf_#{value.custom_field.id} collapsed"
							rows.right custom_field_name_tag(value.custom_field), show_value(value), :class => css
						  end
					end
				end
			end		
		end
	end
end

unless IssuesHelper.included_modules.include? RedmineMp2::Patches::IssuesHelperPatch
  IssuesHelper.send(:include, RedmineMp2::Patches::IssuesHelperPatch)
end
