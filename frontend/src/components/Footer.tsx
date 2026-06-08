"use client";

import { products } from "@/data/products";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-[1920px] w-full gap-8 px-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-lg font-bold text-transparent">
            Smoodh
          </p>
          <p className="mt-2 text-sm text-gray-400">by Parlé Agro</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Premium flavoured milk & lassi. Smooth sips, bold flavors — crafted
            for every moment.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {products.map((p) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="transition-colors hover:text-pink-400"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(p.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Support
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#" className="transition-colors hover:text-pink-400">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-pink-400">
                Store Locator
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-pink-400">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-pink-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Newsletter
          </h3>
          <p className="mt-4 text-sm text-gray-400">
            Get drops, deals & smooth sips news.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-500"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Parlé Agro. Smoodh is a registered brand.
        All rights reserved.
      </div>
    </footer>
  );
}
