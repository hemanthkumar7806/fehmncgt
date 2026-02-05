import { Mail } from 'lucide-react';
import type { NewsletterData } from '@/types/cms';

export default function NewsletterSection({ data }: { data?: NewsletterData | null }) {
  if (data?.showSection === false) return null;

  const title = data?.title ?? 'Stay Informed';
  const description = data?.description ?? "Get the latest updates on fibroid care and women's health";
  const placeholder = data?.emailPlaceholder ?? 'Enter your email';
  const buttonText = data?.buttonText ?? 'Subscribe';

  return (
    <section className="py-16 bg-white">
      <div className="px-12 sm:px-16 lg:px-24">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" placeholder={placeholder} className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <button type="submit" className="bg-secondary text-white px-8 py-4 rounded hover:bg-opacity-90 transition font-medium">
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}
