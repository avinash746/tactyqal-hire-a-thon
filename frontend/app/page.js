import Hero from '@/components/Hero';
import Stories from '@/components/Stories';
import Program from '@/components/Program';
import WhyUs from '@/components/WhyUs';
import Tools from '@/components/Tools';
import Testimonials from '@/components/Testimonials';
import BlogPreview from '@/components/BlogPreview';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Stories />
      <Program />
      <WhyUs />
      <Tools />
      <Testimonials />
      <BlogPreview />
      <Pricing />
      <FAQ />
      <Contact />
    </>
  );
}
