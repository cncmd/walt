/**
 * Get API docs mega-list *
 * This is an example of how to generate a page with documentjs query
 * It will eventually be seversal pages that link to each other (built in gatsby-node)
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import TableOfContents from '../components/toc';
import Interface from '../components/interface';
import Layout from '../components/LayoutBasic';

const selectMarkdown = node => {
  if (node.description == null) {
    return null;
  }
  return node.description.childMarkdownRemark.htmlAst;
};
const normalize = ({ node }) => {
  return {
    name: node.name,
    kind: node.kind,
    examples: node.examples.map((example, i) => ({
      what: String(i),
      html: example.highlighted,
    })),
    parameters: node.params.map(p => {
      return {
        ...p,
        type: (p.type && p.type.name) || 'any',
        description: selectMarkdown(p),
      };
    }),
    returns: node.returns.map(r => ({
      type: r.type.name,
      id: String(r.type.name),
      description: selectMarkdown(r),
    })),
    description: selectMarkdown(node),
    // Title and path for relative ToC links
    title: node.name,
    path: `#${node.name}`,
    isNative: true,
  };
};
// alphabatize by name
const byName = (a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  return 0;
};

class APIReference extends Component {
  state = {
    selected: null,
    apis: this.props.data.allDocumentationJs.edges.map(normalize).sort(byName),
  };

  render() {
    return (
      <Layout title="API">
        <div className="Documentation">
          <TableOfContents pages={this.state.apis} />
          <section className="content">
            {this.state.apis.map(api => (
              <Interface
                key={api.name}
                kind={api.kind}
                name={api.name}
                returns={api.returns}
                parameters={api.parameters}
                examples={api.examples}
                description={api.description}
              />
            ))}
          </section>
        </div>
      </Layout>
    );
  }
}

APIReference.propTypes = {
  data: PropTypes.object.isRequired,
};
export default APIReference;

export const pageQuery = graphql`
  query {
    allDocumentationJs(filter: { name: { ne: "Syntax" } }) {
      edges {
        node {
          examples {
            highlighted
          }
          name
          kind
          returns {
            type {
              type
              name
            }
            description {
              childMarkdownRemark {
                htmlAst
              }
            }
          }
          params {
            name
            type {
              name
            }
            description {
              childMarkdownRemark {
                htmlAst
              }
            }
          }
          description {
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
  }
`;
