'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import RegisterModal from '@/components/RegisterModal';

const CONTACT_PHONE_TEL = 'tel:+918848271413';
const WHATSAPP_NUMBER = '918848271413';

function isPhoneDevice() {
  return /Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getFeeContactHref(courseTitle: string, usePhoneCall: boolean) {
  if (usePhoneCall) return CONTACT_PHONE_TEL;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi NeXlab! I'd like to know the fee for "${courseTitle}".`
  )}`;
}

const navItems = [
  { label: 'Home', href: '#' },
  { label: 'Courses', href: '#courses' },
  { label: 'Blog', href: '#testimonials' },
  { label: 'About Us', href: '#vision' },
];

const features = [
  {
    title: 'Immersive XR Labs',
    desc: 'Step inside science, history, and space with VR/AR experiences designed for the curriculum.',
    bg: 'bg-brand-purple',
    icon: '🥽',
  },
  {
    title: 'AI-Powered Tutors',
    desc: 'Personalized learning paths that adapt to each student in real-time.',
    bg: 'bg-brand-pink',
    icon: '🤖',
  },
  {
    title: 'Project-Based Learning',
    desc: 'Build, prototype, and create — turning theory into real, tangible outcomes.',
    bg: 'bg-brand-lime',
    icon: '🛠️',
  },
  {
    title: 'AVGC Studios',
    desc: 'Animation, VFX, gaming and comics — taught by industry creators in Kerala.',
    bg: 'bg-brand-orange',
    icon: '🎮',
  },
  {
    title: 'Global Community',
    desc: 'Join learners across India and beyond in live workshops, hackathons and meetups.',
    bg: 'bg-brand-red',
    icon: '🌍',
  },
  {
    title: 'Career Pathways',
    desc: 'Mentorship, internships and certifications that lead to real opportunities.',
    bg: 'bg-brand-purple',
    icon: '🚀',
  },
];

const baseCourses = [
  {
    title: 'Nexseed course (Prekg to +2) (foundation)',
    level: 'Prekg to +2',
    duration: 'Foundation track',
    price: 'Contact For Free',
    color: 'bg-brand-purple',
  },
  {
    title: 'Nexup course (Prekg to +2) (academics)',
    level: 'Prekg to +2',
    duration: 'Academic track',
    price: 'Contact For Free',
    color: 'bg-brand-pink',
  },
  { title: 'Vedic maths 5 to 10 (Non-NeXseed students)', level: 'Grades 5 to 10', duration: 'Regular batch', price: 'Contact For Free', color: 'bg-brand-lime' },
  { title: 'Speak lab course', level: 'All levels', duration: 'Regular batch', price: 'Contact For Free', color: 'bg-brand-orange' },
  { title: 'Vacation courses', level: 'All levels', duration: 'Seasonal batch', price: 'Contact For Free', color: 'bg-brand-red' },
  { title: 'Madrasa classes', level: 'All levels', duration: 'Regular batch', price: 'Contact For Free', color: 'bg-brand-purple' },
];

const additionalCourses = [
  {
    title: 'Arabic reading and writing',
    level: 'All levels',
    duration: 'Regular batch',
    price: 'Contact For Free',
    color: 'bg-brand-lime',
  },
];

const testimonials = [
  {
    name: 'Aarav S.',
    role: 'Student, Grade 8',
    quote: 'The VR science lab made me actually love physics. I built a working circuit in 3D!',
    color: 'bg-brand-lime',
  },
  {
    name: 'Meera K.',
    role: 'Parent',
    quote: "My daughter looks forward to every class. NeXlab makes learning feel like discovery.",
    color: 'bg-brand-purple',
  },
  {
    name: 'Rohan P.',
    role: 'Student, Grade 10',
    quote: 'I designed my first game in 6 weeks. The mentors here are absolutely brilliant.',
    color: 'bg-brand-orange',
  },
];

export default function HomePage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [usePhoneCall, setUsePhoneCall] = useState(false);

  useEffect(() => {
    setUsePhoneCall(isPhoneDevice());
  }, []);

  const courses = showAllCourses ? [...baseCourses, ...additionalCourses] : baseCourses;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-hidden">
      {/* Header */}
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-14">
        <Image
          src="/images/nexlab-logo.png"
          alt="NeXlab"
          width={1080}
          height={1920}
          className="h-9 w-auto sm:h-12 lg:h-14"
          priority
        />

        <nav className="hidden items-center gap-8 lg:flex xl:gap-12">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-base font-medium text-foreground transition-colors hover:text-brand-purple"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setRegisterOpen(true)}
          className="rounded-xl bg-brand-pink px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_0_-2px_hsl(340_85%_40%)] transition-transform hover:-translate-y-0.5 sm:rounded-2xl sm:px-7 sm:py-4 sm:text-base sm:shadow-[0_8px_0_-2px_hsl(340_85%_40%)]"
        >
          Register Now
        </button>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:px-14 lg:pt-16">
        {/* Left — headline & CTAs */}
        <div className="relative">
          {/* Decorative stars */}
          <Image
            src="/images/star-1.svg"
            alt=""
            width={100}
            height={100}
            aria-hidden="true"
            className="absolute -left-1 top-8 h-5 w-5 select-none sm:-left-2 sm:top-12 sm:h-7 sm:w-7 lg:-left-4 lg:top-14 lg:h-9 lg:w-9"
          />

          <h1 className="font-display text-[34px] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[44px] md:text-[52px] lg:text-[64px]">
            <span className="block">
              India&rsquo;s First{' '}
              <span className="relative inline-block align-baseline">
                <span className="absolute inset-0 -z-0 rounded-[14px] border-2 border-foreground bg-brand-purple translate-y-1 shadow-[7px_5px_0_#000000] sm:shadow-[10px_7px_0_#000000]" />
                <span className="relative z-10 px-3 italic text-white sm:px-4">Immersive</span>
              </span>
            </span>

            <span className="mt-3 block">
              <span className="relative inline-block align-baseline">
                <span className="absolute inset-0 -z-0 rounded-[14px] border-2 border-foreground bg-brand-pink translate-y-1 shadow-[7px_5px_0_#000000] sm:shadow-[10px_7px_0_#000000]" />
                <span className="relative z-10 px-3 italic text-white sm:px-4">Learning</span>
              </span>{' '}
              <span className="relative inline-block translate-y-[5px]">
                Platform
                <Image
                  src="/images/star-2.svg"
                  alt=""
                  width={100}
                  height={100}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -top-2 h-5 w-5 -translate-x-[18px] -translate-y-[-8px] select-none sm:-right-2 sm:-top-3 sm:h-7 sm:w-7 lg:-right-9 lg:-top-4 lg:h-9 lg:w-9"
                />
              </span>
            </span>
          </h1>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4 sm:mt-[86px] sm:gap-[26px]">
            <a
              href={`https://wa.me/918848271413?text=${encodeURIComponent("Hi NeXlab! I'd like to know more about your courses.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="box-border inline-flex h-[54px] cursor-pointer items-center justify-center gap-[10px] rounded-[10px] border border-[#000000] bg-[#7462FE] px-6 py-4 text-[14px] font-black leading-[100%] tracking-[0.02em] text-[#FFFFFF] no-underline shadow-[7px_5px_0_#000000] transition duration-150 hover:translate-y-1 hover:shadow-[5px_3px_0_#000000] active:translate-y-[2px] active:shadow-[3px_2px_0_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3e2dd5] focus-visible:ring-offset-2 sm:h-[65px] sm:px-[30px] sm:py-[20px] sm:text-[16px] sm:shadow-[10px_7px_0_#000000]"
            >
              Let&apos;s Talk
            </a>
            <a
              href="#courses"
              className="box-border inline-flex h-[54px] cursor-pointer items-center justify-center gap-[10px] whitespace-nowrap rounded-[10px] border border-[#000000] bg-[#7462FE] px-6 py-4 text-[14px] font-black leading-[100%] tracking-[0.02em] text-[#FFFFFF] no-underline shadow-[7px_5px_0_#000000] transition duration-150 hover:translate-y-1 hover:shadow-[5px_3px_0_#000000] active:translate-y-[2px] active:shadow-[3px_2px_0_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3e2dd5] focus-visible:ring-offset-2 sm:h-[65px] sm:px-[30px] sm:py-[20px] sm:text-[16px] sm:shadow-[10px_5px_0_#000000]"
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* Right — VR kid illustration */}
        <div className="relative flex items-center justify-center">
          <Image
            src="/images/vr-kid.png"
            alt="Child wearing VR headset surrounded by floating learning blocks and a rocket"
            width={640}
            height={640}
            className="w-full max-w-[420px] select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.12)] sm:max-w-[520px] lg:max-w-[640px]"
            priority
          />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-14">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block rounded-full border-2 border-foreground bg-brand-lime px-6 py-2 text-sm font-bold text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            Why NeXlab
          </span>
          <h2 className="mt-6 max-w-[900px] font-sans text-[26px] font-extrabold leading-[1.2] text-foreground sm:text-[32px] lg:text-[48px]">
            Learning that feels like{' '}
            <span className="relative inline-block align-baseline">
              <span className="absolute inset-0 -z-0 rounded-[12px] border-2 border-foreground bg-brand-pink translate-y-1" />
              <span className="relative z-10 px-3 italic text-white">play</span>
            </span>
          </h2>
          <p className="mt-5 max-w-[680px] text-base text-foreground/70 lg:text-lg">
            We blend immersive XR, AI tutors, and hands-on projects to help students learn faster, deeper, and with more
            curiosity.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[24px] border-2 border-foreground bg-white p-7 shadow-[8px_8px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-1"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-foreground ${f.bg} text-2xl shadow-[4px_4px_0_hsl(var(--foreground))]`}
              >
                {f.icon}
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Vision */}
      <section id="vision" className="scroll-mt-24 px-4 pb-16 sm:pb-20 lg:px-10">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-brand-red px-5 py-14 sm:rounded-[40px] sm:px-6 sm:py-20 lg:px-16 lg:py-28">
          {/* Decorative purple star top-right */}
          <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-6 -top-6 h-32 w-32 lg:h-44 lg:w-44">
            <path
              d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z"
              fill="hsl(var(--brand-purple))"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
          </svg>

          {/* Decorative lime splats bottom corners */}
          <svg aria-hidden viewBox="0 0 100 100" className="absolute -bottom-4 -left-4 h-20 w-20 lg:h-28 lg:w-28">
            <path
              d="M50 5 L60 25 L82 18 L75 40 L95 50 L75 60 L82 82 L60 75 L50 95 L40 75 L18 82 L25 60 L5 50 L25 40 L18 18 L40 25 Z"
              fill="hsl(var(--brand-lime))"
            />
          </svg>
          <svg aria-hidden viewBox="0 0 100 100" className="absolute -bottom-4 -right-4 h-20 w-20 lg:h-28 lg:w-28">
            <path
              d="M50 5 L60 25 L82 18 L75 40 L95 50 L75 60 L82 82 L60 75 L50 95 L40 75 L18 82 L25 60 L5 50 L25 40 L18 18 L40 25 Z"
              fill="hsl(var(--brand-lime))"
            />
          </svg>

          {/* Our Vision pill */}
          <div className="flex justify-center">
            <span className="inline-block rounded-full bg-white px-7 py-2.5 text-base font-bold text-brand-pink shadow-sm">
              Our Vision
            </span>
          </div>

          {/* Headline */}
          <h2 className="mx-auto mt-10 max-w-[1100px] text-center font-sans text-[20px] font-bold leading-[1.6] text-white sm:mt-12 sm:text-[26px] sm:leading-[1.55] lg:text-[40px] lg:leading-[1.5]">
            NeXlab Edu Hub aims to become a leading{' '}
            <span className="relative inline-block align-baseline">
              <span className="absolute inset-0 -z-0 rounded-[10px] border-2 border-foreground bg-brand-purple translate-y-1" />
              <span className="relative z-10 px-3 text-white">Immersive learning</span>
            </span>{' '}
            platform in India, positioning Kerala as a hub for{' '}
            <span className="relative inline-block align-baseline -rotate-3">
              <span className="absolute inset-0 -z-0 rounded-[10px] border-2 border-foreground bg-brand-lime translate-y-1" />
              <span className="relative z-10 px-3 text-foreground">XR-enabled</span>
            </span>{' '}
            education and AVGC{' '}
            <span className="relative inline-block align-baseline">
              <span className="absolute inset-0 -z-0 rounded-[10px] border-2 border-foreground bg-brand-purple translate-y-1" />
              <span className="relative z-10 px-3 text-white">innovation</span>
            </span>{' '}
            and expanding globally in the future.
          </h2>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-14">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-block rounded-full border-2 border-foreground bg-brand-orange px-6 py-2 text-sm font-bold text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
              Explore Courses
            </span>
            <h2 className="mt-5 max-w-[640px] font-sans text-[26px] font-extrabold leading-[1.15] text-foreground sm:text-[32px] lg:text-[44px]">
              Future-ready{' '}
              <span className="relative inline-block align-baseline">
                <span className="absolute inset-0 -z-0 rounded-[12px] border-2 border-foreground bg-brand-purple translate-y-1" />
                <span className="relative z-10 px-3 italic text-white">programs</span>
              </span>{' '}
              for curious minds
            </h2>
          </div>
          {!showAllCourses && (
            <button
              type="button"
              onClick={() => setShowAllCourses(true)}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-foreground bg-white px-6 text-sm font-extrabold text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5"
            >
              View all courses →
            </button>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.title}
              className="overflow-hidden rounded-[24px] border-2 border-foreground bg-white shadow-[8px_8px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-1"
            >
              <div className={`flex h-40 items-center justify-center border-b-2 border-foreground ${c.color}`}>
                <span className="text-5xl">📚</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-foreground/60">
                  <span>{c.level}</span>
                  <span>•</span>
                  <span>{c.duration}</span>
                </div>
                <h3 className="mt-2 text-xl font-extrabold text-foreground">{c.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={getFeeContactHref(c.title, usePhoneCall)}
                    {...(!usePhoneCall && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="text-lg font-extrabold text-brand-pink transition-opacity hover:opacity-80"
                  >
                    {c.price}
                  </a>
                  <a
                    href={`https://wa.me/918848271413?text=${encodeURIComponent(`Hi NeXlab! I'm interested to join this course: "${c.title}". Please reply me ASAP.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-[8px] border-2 border-foreground bg-brand-purple px-4 text-sm font-extrabold text-white shadow-[4px_4px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5"
                  >
                    Enroll
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-14">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block rounded-full border-2 border-foreground bg-brand-pink px-6 py-2 text-sm font-bold text-white shadow-[4px_4px_0_hsl(var(--foreground))]">
            Loved by Learners
          </span>
          <h2 className="mt-6 max-w-[800px] font-sans text-[26px] font-extrabold leading-[1.2] text-foreground sm:text-[32px] lg:text-[44px]">
            What students &amp; parents say
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-[24px] border-2 border-foreground bg-white p-7 shadow-[8px_8px_0_hsl(var(--foreground))]"
            >
              <div className="text-4xl leading-none text-brand-purple">&ldquo;</div>
              <p className="mt-2 text-base leading-relaxed text-foreground/80">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground ${t.color} text-base font-extrabold text-foreground`}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground/60">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:pb-20 lg:px-10">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border-2 border-foreground bg-brand-purple px-5 py-14 text-center shadow-[8px_8px_0_hsl(var(--foreground))] sm:rounded-[40px] sm:px-6 sm:py-20 sm:shadow-[12px_12px_0_hsl(var(--foreground))] lg:px-16 lg:py-24">
          <h2 className="mx-auto max-w-[820px] font-sans text-[24px] font-extrabold leading-[1.2] text-white sm:text-[30px] lg:text-[44px]">
            Ready to step into the{' '}
            <span className="relative inline-block align-baseline">
              <span className="absolute inset-0 -z-0 rounded-[12px] border-2 border-foreground bg-brand-lime translate-y-1" />
              <span className="relative z-10 px-3 italic text-foreground">future</span>
            </span>{' '}
            of learning?
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-base text-white/85 lg:text-lg">
            Join thousands of students reimagining education with NeXlab Edu Hub.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="inline-flex h-[60px] items-center justify-center rounded-[10px] border-2 border-foreground bg-brand-pink px-8 text-base font-black text-white shadow-[8px_8px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-1"
            >
              Register Now
            </button>
            <a
              href={`https://wa.me/918848271413?text=${encodeURIComponent("Hi NeXlab! I'd like to know more about your courses.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[60px] items-center justify-center rounded-[10px] border-2 border-foreground bg-white px-8 text-base font-black text-foreground shadow-[8px_8px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-1"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-14">
        <div className="rounded-[24px] border-2 border-foreground bg-foreground px-6 py-10 text-background sm:rounded-[32px] sm:px-8 sm:py-12 lg:px-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Image
                src="/images/nexlab-logo.png"
                alt="NeXlab"
                width={1080}
                height={1920}
                className="h-12 w-auto brightness-0 invert"
              />
              <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-background/70">
                India&apos;s first immersive learning platform — empowering the next generation through XR, AI, and
                AVGC.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-background">Explore</h4>
              <ul className="mt-4 space-y-2 text-sm text-background/70">
                <li>
                  <a href="#" className="hover:text-brand-lime">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#vision" className="hover:text-brand-lime">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-brand-lime">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-background">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-background/70">
                <li>nexlabeduhub@gmail.com</li>
                <li>Kerala, India</li>
                <li className="flex gap-3 pt-2">
                  <a
                    href="https://www.instagram.com/nexlab_eduhub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/30 hover:bg-brand-pink hover:text-white"
                  >
                    IG
                  </a>
                  <a
                    href="https://www.linkedin.com/company/nexlabedu/posts/?feedView=all"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/30 hover:bg-brand-purple hover:text-white"
                  >
                    in
                  </a>
                  <a
                    href="https://youtube.com/@nexlabeduhub?si=sgUIAFzoE_xiva4z"
                    aria-label="YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/30 hover:bg-brand-red hover:text-white"
                  >
                    YT
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-background/15 pt-6 text-xs text-background/60 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} NeXlab Edu Hub. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-background">
                {/* Privacy */}
              </a>
              <a href="#" className="hover:text-background">
                {/* Terms */}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}
