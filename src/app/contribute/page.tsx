import { Github, GitPullRequest, MessageSquare, Star, Users, BookOpen, Code, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContributePage() {
  const contributionSteps = [
    {
      icon: <Github className="w-6 h-6" />,
      title: "Fork the Repository",
      description: "Start by forking the DevOps Cheatsheet repository to your GitHub account.",
      link: "https://github.com/NotHarshhaa/devops-cheatsheet/fork",
      linkText: "Fork Now"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Make Your Changes",
      description: "Add new tools, update existing content, or fix issues in your forked repository.",
      link: "https://github.com/NotHarshhaa/devops-cheatsheet/blob/master/CONTRIBUTING.md",
      linkText: "View Guidelines"
    },
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: "Submit a Pull Request",
      description: "Create a pull request with your changes for review by the maintainers.",
      link: "https://github.com/NotHarshhaa/devops-cheatsheet/pulls",
      linkText: "Create PR"
    },
  ];

  const contributionAreas = [
    {
      title: "Add New Tools",
      description: "Share your knowledge about DevOps tools not yet covered in the cheatsheet.",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Improve Documentation",
      description: "Help make our documentation more comprehensive and easier to understand.",
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Fix Issues",
      description: "Help resolve open issues and improve the quality of the cheatsheet.",
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Contribute to DevOps Cheatsheet
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Help us make DevOps knowledge more accessible to everyone. Your contributions make a difference!
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-blue-100">
              <Users className="w-5 h-5" />
              <span>100+ Contributors</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Star className="w-5 h-5" />
              <span>500+ Stars</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <GitPullRequest className="w-5 h-5" />
              <span>200+ PRs Merged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How to Contribute Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Contribute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contributionSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {step.description}
                </p>
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  {step.linkText}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* What You Can Contribute Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What You Can Contribute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contributionAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  {area.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Make Your First Contribution?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you're fixing a typo or adding a new tool guide, every contribution helps make
            DevOps Cheatsheet better for everyone.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/NotHarshhaa/devops-cheatsheet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contribution Guidelines
          </h2>
          <div className="prose max-w-none text-gray-600">
            <ul className="space-y-4 list-disc list-inside">
              <li>Ensure your contribution follows our code of conduct and style guidelines</li>
              <li>Test your changes locally before submitting a pull request</li>
              <li>Include clear commit messages and documentation updates</li>
              <li>Be responsive to feedback and questions about your contribution</li>
              <li>Help review other contributions when possible</li>
            </ul>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <a
              href="https://github.com/NotHarshhaa/devops-cheatsheet/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              Read full guidelines
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 