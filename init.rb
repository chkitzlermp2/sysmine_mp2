require 'redmine'
require File.expand_path('../lib/redmine_mp2', __FILE__)

Redmine::Plugin.register :redmine_mp2 do
  name 'Redmine MP2 Plugin'
  author 'Wolfgang Dichler'
  description 'Changes for MP2 Dev Team'
  version '2.0.0'
  url 'http://www.mp2.at'
  author_url 'http://www.mp2.at'

  # required redmine version
  requires_redmine version_or_higher: '6.0.0'
    
  # add setting
  default_settings = {
    darkmode: 0
  }
  
  settings(default: default_settings, partial: 'settings/mp2settings')
end

class RedmineMP2Helper
	
	class << self

		def plugin
		  Redmine::Plugin.find(:redmine_mp2)
		end
		
		# Get plugin setting value or it's default value in a safe way.
		# If the setting key is not found, returns nil.
		# If the plugin has not been registered yet, returns nil.
		def get_setting(name)
		  begin
			if plugin
			  if Setting["plugin_#{plugin.id}"]
				Setting["plugin_#{plugin.id}"][name]
			  else
				if plugin.settings[:default].has_key?(name)
				  plugin.settings[:default][name]
				end
			  end
			end
		  rescue
			
			# We don't care about exceptions which can actually occur ie. when running
			# migrations and settings table has not yet been created.
			nil
		  end
		end
	end
end