import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  Toc,
  unstable_getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/p/[...chunks]';
import s from 'pages/docs/pageStyle.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted/cjs';
import { useMemo } from 'react';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import PostContent from 'components/PostContent';

export const unstable_getStaticPaths = async () => {
  return { paths: [] };
};

export const unstable_getStaticProps = async ({ params: { chunk } }) => {
  const { props } = await docPageUnstableGetStaticProps({
    params: { chunks: ['content-management-api', chunk] },
  });

  const cma = await fetchCma();

  return { props: { ...props, cma } };
};

export default function DocPage({ docGroup, titleOverride, page, cma }) {
  const result = useMemo(() => cma && parse(cma), [cma]);

  return (
    <DocsLayout
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            entries={[].concat(
              docGroup.pages.map(page => {
                return {
                  url: `/docs/p/${docGroup.slug}${
                    page.page.slug === 'index' ? '' : `/${page.page.slug}`
                  }`,
                  label: page.titleOverride || page.page.title,
                };
              }),
              result.toc,
            )}
          />
        )
      }
    >
      {page && (
        <>
          <Head>{renderMetaTags(page._seoMetaTags)}</Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{titleOverride || page.title}</div>
              <PostContent content={page.content} style={s} />
            </div>
            <Toc content={page.content} />
          </div>
        </>
      )}
    </DocsLayout>
  );
}