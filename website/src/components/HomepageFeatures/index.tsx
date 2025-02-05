import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Diagram Visualization',
    Svg: require('@site/static/img/Diagram_Visualization.svg').default,
    description: (
      <>
        Generate Nassi-Shneiderman diagrams from your function/method code, with more diagram types coming soon
      </>
    ),
  },
  {
    title: 'Multiple Language Support',
    Svg: require('@site/static/img/Multiple_Language_Support.svg').default,
    description: (
      <>
        Currently supports C and Java, with more languages planned for the future
      </>
    ),
  },
  {
    title: 'IDE Integration',
    Svg: require('@site/static/img/IDE_Integration.svg').default,
    description: (
      <>
        Integration with VS Code through our extension, making visualization just a click away
      </>
    ),
  },
  {
    title: 'Extensible Architecture',
    Svg: require('@site/static/img/Extensible_Architecture.svg').default,
    description: (
      <>
        Built with extensibility in mind to support more programming languages and diagram types
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
