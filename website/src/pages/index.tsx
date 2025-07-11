import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Confetti from 'react-confetti-boom';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p><strong>Exclusive Deal:</strong> First 99 Sales — <span style={{ color: "yellow" }}>Completely Free for Lifetime Use!</span> Use Coupon Code: <code style={{ color: "yellowgreen" }} >L7OQHM9</code></p>
        <div className={styles.buttons}>
          <Confetti mode="boom" particleCount={500} launchSpeed={1.8} effectInterval={6000} colors={['#ff577f', '#ff884b']} />
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started 🚀
          </Link>
          <div style={{ width: 10 }}></div>
          <Link
            className="button button--secondary button--lg"
            to="https://raghavista2.gumroad.com/l/rigve">
            Get it for free
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
