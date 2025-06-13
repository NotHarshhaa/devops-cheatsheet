"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Github,
  Globe,
  FileText,
  BookOpen,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  Star,
  Code,
  Server,
  Activity,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.5 },
    },
  };

  const stats = [
    { label: "GitHub Stars", value: "3.5K+" },
    { label: "Resources", value: "900+" },
    { label: "Projects", value: "50+" },
    { label: "Happy Users", value: "10K+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-blue-400/10 dark:bg-blue-400/10 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-60 h-60 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/2 w-32 h-32 rounded-full bg-cyan-400/10 dark:bg-cyan-400/10 blur-3xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-75"></div>
              <motion.img
                src="https://avatars.githubusercontent.com/NotHarshhaa"
                alt="Harshhaa"
                className="relative w-36 h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              />
            </div>

            <motion.h1
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4"
              variants={fadeInUp}
            >
              Hey there! 👋 I'm Harshhaa
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              A passionate DevOps Engineer on a mission to automate everything
              and scale cloud infrastructures efficiently.
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all"
                >
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-12"
              variants={fadeInUp}
            >
              {[
                { id: "about", label: "About Me" },
                { id: "expertise", label: "Expertise" },
                { id: "resources", label: "Resources" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* About Me Tab */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700 h-full"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Server className="w-6 h-6 text-blue-500" />
                  My Journey
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    I'm a seasoned DevOps Engineer passionate about building
                    efficient, scalable systems. My journey began with a
                    curiosity about how things work behind the scenes in
                    software development.
                  </p>
                  <p>
                    Today, I specialize in cloud infrastructure, automation, and
                    helping teams deliver software faster and more reliably
                    through DevOps practices.
                  </p>
                  <p>
                    I believe in sharing knowledge and creating resources that
                    help others grow in their DevOps journey. That's why I've
                    built this DevOps Cheatsheet Hub!
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-purple-500" />
                    Connect With Me
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Globe className="w-5 h-5" />,
                        title: "Portfolio",
                        url: "https://notharshhaa.site/",
                      },
                      {
                        icon: <FileText className="w-5 h-5" />,
                        title: "Resume",
                        url: "https://cv.notharshhaa.site/",
                      },
                      {
                        icon: <BookOpen className="w-5 h-5" />,
                        title: "Blog",
                        url: "https://blog.notharshhaa.site/",
                      },
                      {
                        icon: <LinkIcon className="w-5 h-5" />,
                        title: "Links",
                        url: "https://link.notharshhaa.site/",
                      },
                    ].map((link) => (
                      <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                      >
                        <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          {link.icon}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {link.title}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Follow me on social media
                    </h3>
                    <div className="flex gap-4">
                      {[
                        {
                          icon: <Github className="w-5 h-5" />,
                          url: "https://github.com/NotHarshhaa",
                          color: "hover:bg-gray-200 dark:hover:bg-gray-700",
                        },
                        {
                          icon: <Twitter className="w-5 h-5" />,
                          url: "https://twitter.com/NotHarshhaa",
                          color: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                        },
                        {
                          icon: <Linkedin className="w-5 h-5" />,
                          url: "https://linkedin.com/in/harshhaa-vardhan-reddy",
                          color: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                        },
                      ].map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition-colors`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Expertise Tab */}
        {activeTab === "expertise" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Core Expertise
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 shadow-sm">
                      <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Cloud & DevOps Architecture
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Architecting scalable, secure, and high-performance
                        infrastructures using AWS, Azure, Kubernetes, Terraform,
                        and more.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 shadow-sm">
                      <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Automation & CI/CD
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Building robust automation pipelines, Infrastructure as
                        Code (IaC), and making deployments seamless with
                        Jenkins, GitHub Actions, and GitLab CI.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 shadow-sm">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Content Creation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Creating educational content, writing technical blogs,
                        and building projects to help others learn DevOps
                        concepts and tools.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-md p-8 border border-blue-100 dark:border-blue-800/30"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Skills & Technologies
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      category: "Cloud Platforms",
                      skills: ["AWS", "Azure", "GCP", "Digital Ocean"],
                      color: "blue",
                    },
                    {
                      category: "Containers & Orchestration",
                      skills: ["Docker", "Kubernetes", "Helm", "Podman"],
                      color: "green",
                    },
                    {
                      category: "Infrastructure as Code",
                      skills: [
                        "Terraform",
                        "Ansible",
                        "CloudFormation",
                        "Pulumi",
                      ],
                      color: "purple",
                    },
                    {
                      category: "CI/CD & Monitoring",
                      skills: [
                        "Jenkins",
                        "GitHub Actions",
                        "Prometheus",
                        "Grafana",
                      ],
                      color: "orange",
                    },
                  ].map((skillSet, index) => (
                    <div key={index}>
                      <h3
                        className={`font-medium text-${skillSet.color}-700 dark:text-${skillSet.color}-400 mb-3`}
                      >
                        {skillSet.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillSet.skills.map((skill, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 bg-${skillSet.color}-100 dark:bg-${skillSet.color}-900/30 text-${skillSet.color}-700 dark:text-${skillSet.color}-400 rounded-full text-sm font-medium`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                DevOps Learning Ecosystem
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                I've created an ecosystem for DevOps enthusiasts, job-seekers,
                and practitioners — designed to make learning practical and
                accessible:
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "💻 Real-Time Projects Hub",
                    url: "https://projects.prodevopsguytech.com",
                    desc: "Work on real-world DevOps/Cloud projects",
                  },
                  {
                    title: "📚 Ultimate Docs Portal",
                    url: "https://docs.prodevopsguytech.com",
                    desc: "900+ curated learning materials",
                  },
                  {
                    title: "📦 Repositories Central",
                    url: "https://repos.prodevopsguytech.com",
                    desc: "Scripts, infra, prep content, and more",
                  },
                  {
                    title: "🧭 Jobs Portal",
                    url: "https://jobs.prodevopsguytech.com",
                    desc: "Find your next opportunity in DevOps or Cloud",
                  },
                  {
                    title: "📰 DevOps Blog",
                    url: "https://blog.prodevopsguytech.com",
                    desc: "Learn from deep dives and practical guides",
                  },
                  {
                    title: "☁️ Cloud Blog",
                    url: "https://cloud.prodevopsguytech.com",
                    desc: "Cloud-focused tutorials and insights",
                  },
                ].map((resource, index) => (
                  <motion.a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all group"
                    variants={scaleIn}
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {resource.desc}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl shadow-md p-8 text-white"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">
                    DevOps Tools Setup/Installations
                  </h2>
                  <p className="text-blue-100">
                    Step-by-step guides for setting up all the popular DevOps
                    tools
                  </p>
                </div>
                <a
                  href="https://devopsguides.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors group"
                >
                  <span>Check it out</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Testimonials/Quote Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6">
              "DevOps is not a goal, but a never-ending process of continual
              improvement."
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">— Jez Humble</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
