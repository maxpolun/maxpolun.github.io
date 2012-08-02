desc "Given a title as an argument, create a new post file"
task :write, [:title, :category] do |t, args|
  filename = "#{Time.now.strftime('%Y-%m-%d')}-#{args.title.gsub(/\s:/, '_').downcase}.markdown"
  path = File.join("_posts", filename)
  if File.exist? path; raise RuntimeError.new("Won't clobber #{path}"); end
  File.open(path, 'w') do |file|
    file.write <<-EOS
---
layout: post
title: #{args.title.gsub(/:/, '&#58;')}
date: #{Time.now.strftime('%Y-%m-%d %k:%M:%S')}
category: #{args.category}
---
EOS
    end
    editor = "C:\\Program Files\\Sublime Text 2\\sublime_text.exe"
    puts "opening #{path} in an editor."
    system "'#{editor}' '#{path}'"
end

