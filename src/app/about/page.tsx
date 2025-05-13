import Link from 'next/link';
import { Github, Globe, FileText, BookOpen, Link as LinkIcon, Twitter, Linkedin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src="https://avatars.githubusercontent.com/NotHarshhaa"
              alt="Harshhaa"
              className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hey there! 👋 I'm Harshhaa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A passionate DevOps Engineer on a mission to automate everything and scale cloud infrastructures efficiently.
          </p>
        </div>

        {/* Expertise Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-blue-600 dark:text-blue-400">🔹</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Cloud & DevOps Enthusiast</h3>
                <p className="text-gray-600 dark:text-gray-400">Architecting scalable, secure, and high-performance infrastructures using AWS, Azure, Kubernetes, Terraform, and more.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <span className="text-green-600 dark:text-green-400">🔹</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Automation Lover</h3>
                <p className="text-gray-600 dark:text-gray-400">Scripting, CI/CD pipelines, Infrastructure as Code (IaC), and making deployments seamless.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-purple-600 dark:text-purple-400">🔹</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Content Creator</h3>
                <p className="text-gray-600 dark:text-gray-400">I write blogs, create projects, and share everything I learn to help others grow in DevOps!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: <Globe className="w-5 h-5" />, title: 'Portfolio', url: 'https://notharshhaa.site/' },
            { icon: <FileText className="w-5 h-5" />, title: 'Resume', url: 'https://cv.notharshhaa.site/' },
            { icon: <BookOpen className="w-5 h-5" />, title: 'Blog', url: 'https://blog.notharshhaa.site/' },
            { icon: <LinkIcon className="w-5 h-5" />, title: 'Links', url: 'https://link.notharshhaa.site/' },
          ].map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-800 hover:shadow-sm transition-all"
            >
              <div className="text-blue-600 dark:text-blue-400">{link.icon}</div>
              <span className="font-medium text-gray-900 dark:text-white">{link.title}</span>
            </a>
          ))}
        </div>

        {/* Resources Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🌐 Empowering DevOps & Cloud Learners — One Resource at a Time
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            I've created an ecosystem for DevOps enthusiasts, job-seekers, and practitioners — designed to make learning practical and accessible:
          </p>
          <div className="space-y-4">
            {[
              { title: '💻 Real-Time Projects Hub', url: 'https://projects.prodevopsguytech.com', desc: 'Work on real-world DevOps/Cloud projects' },
              { title: '📚 Ultimate Docs Portal', url: 'https://docs.prodevopsguytech.com', desc: '900+ curated learning materials' },
              { title: '📦 Repositories Central', url: 'https://repos.prodevopsguytech.com', desc: 'Scripts, infra, prep content, and more' },
              { title: '🧭 Jobs Portal', url: 'https://jobs.prodevopsguytech.com', desc: 'Find your next opportunity in DevOps or Cloud' },
              { title: '📰 DevOps Blog', url: 'https://blog.prodevopsguytech.com', desc: 'Learn from deep dives and practical guides' },
              { title: '☁️ Cloud Blog', url: 'https://cloud.prodevopsguytech.com', desc: 'Cloud-focused tutorials and insights' },
              { title: '🛠️ DevOps Tools Setup/Installations', url: 'https://devopsguides.site', desc: 'Setup/Installations for DevOps Tools' }
            ].map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{resource.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{resource.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {[
            { icon: <Github className="w-6 h-6" />, url: 'https://github.com/NotHarshhaa' },
            { icon: <Twitter className="w-6 h-6" />, url: 'https://twitter.com/NotHarshhaa' },
            { icon: <Linkedin className="w-6 h-6" />, url: 'https://linkedin.com/in/harshhaa-vardhan-reddy' },
          ].map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
} 