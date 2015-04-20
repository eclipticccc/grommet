// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Section = require('grommet/components/Section');
var Menu = require('grommet/components/Menu');
var TBD = require('grommet/components/TBD');
var GrommetDocument = require('grommet/components/Document');
var HelloWorld = require('./HelloWorld');
var Tutorial = require('./Tutorial');
var GetStarted = require('./GetStarted');
var Architecture = require('./Architecture');
//var ChartDoc = require('./components/ChartDoc');
var DialogDoc = require('./components/DialogDoc');
var DocumentDoc = require('./components/DocumentDoc');
var DonutDoc = require('./components/DonutDoc');
var FooterDoc = require('./components/FooterDoc');
var FormDoc = require('./components/FormDoc');
var HeaderDoc = require('./components/HeaderDoc');
var LoginFormDoc = require('./components/LoginFormDoc');
var MenuDoc = require('./components/MenuDoc');
var MeterDoc = require('./components/MeterDoc');
var SearchDoc = require('./components/SearchDoc');
var TableDoc = require('./components/TableDoc');
var TilesDoc = require('./components/TilesDoc');
var AppDoc = require('./components/AppDoc');
var TitleDoc = require('./components/TitleDoc');
var SectionDoc = require('./components/SectionDoc');
var PanelDoc = require('./components/PanelDoc');

//hjjs configuration
require("!style!css!highlight.js/styles/github.css");
var hljs = require('highlight.js/lib/highlight');
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

var CONTENTS = [
  {label: 'Guides',
    contents: [
      {route: 'doc_helloworld', label: 'Hello World', component: HelloWorld, default: true},
      {route: 'doc_tutorial', label: 'Tutorial', component: Tutorial},
      {route: 'doc_getstarted', label: 'Get Started', component: GetStarted}
    ]
  },
  {label: 'Patterns',
    contents: [
      {route: 'doc_dashboard', label: 'Dashboard', component: TBD},
      {route: 'doc_index', label: 'Index', component: TBD},
      {route: 'doc_login', label: 'Login', component: TBD},
      {route: 'doc_navigation', label: 'Navigation', component: TBD},
      {route: 'doc_searching', label: 'Searching', component: TBD},
      {route: 'doc_session', label: 'Session', component: TBD}
    ]
  },
  {label: 'Components',
    contents: [
      {route: 'doc_app', label: 'App', component: AppDoc},
      {route: 'doc_header', label: 'Header', component: HeaderDoc},
      {route: 'doc_footer', label: 'Footer', component: FooterDoc},
      {route: 'doc_title', label: 'Title', component: TitleDoc},
      {route: 'doc_section', label: 'Section', component: SectionDoc},
      {route: 'doc_panel', label: 'Panel', component: PanelDoc},
      {route: 'doc_chart', label: 'Chart', component: TBD},
      {route: 'doc_dialog', label: 'Dialog', component: DialogDoc},
      {route: 'doc_document', label: 'Document', component: DocumentDoc},
      {route: 'doc_donut', label: 'Donut', component: DonutDoc},
      {route: 'doc_form', label: 'Form', component: FormDoc},
      {route: 'doc_login-form', label: 'LoginForm', component: LoginFormDoc},
      {route: 'doc_menu', label: 'Menu', component: MenuDoc},
      {route: 'doc_meter', label: 'Meter', component: MeterDoc},
      {route: 'doc_search', label: 'Search', component: SearchDoc},
      {route: 'doc_table', label: 'Table', component: TableDoc},
      {route: 'doc_tiles', label: 'Tiles', component: TilesDoc}
    ]
  },
  {label: 'Reference',
    contents: [
      {route: 'doc_architecture', label: 'Architecture', component: Architecture}
    ]
  }
];

function createPageLinks(contents, level) {
  var result = [];
  contents.forEach(function (page) {
    if (page.hasOwnProperty('route')) {
      result.push(<Link key={page.label} to={page.route}>{page.label}</Link>);
    } else {
      if (2 === level) {
        result.push(<h3 key={page.label}>{page.label}</h3>);
      } else if (3 === level) {
        result.push(<h4 key={page.label}>{page.label}</h4>);
      } else {
        result.push(<h5 key={page.label}>{page.label}</h5>);
      }
    }
    if (page.hasOwnProperty('contents')) {
      result = result.concat(createPageLinks(page.contents, level + 1));
    }
  });
  return result;
}

var Documentation = React.createClass({

  componentDidMount: function () {
    this.highlightCode();
  },

  componentDidUpdate: function () {
    this.highlightCode();
  },

  highlightCode: function () {
    var domNode = this.getDOMNode();
    var nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i++) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },

  render: function() {
    var pages = createPageLinks(CONTENTS, 2);
    return (
      <Section direction="right">
        <Menu direction="down">{pages}</Menu>
        <GrommetDocument>
          <RouteHandler />
        </GrommetDocument>
      </Section>
    );
  }
});

function createContentRoutes(contents) {
  var result = [];
  contents.forEach(function (content) {
    if (content.default) {
      result.push(
        <DefaultRoute key={content.label} name={content.route}
          handler={content.component} />
      );
    } else {
      result.push(
        <Route key={content.label} name={content.route}
          path={content.label.toLowerCase().replace(/ /g,"-")}
          handler={content.component} />
      );
    }
    if (content.hasOwnProperty('contents')) {
      result = result.concat(createContentRoutes(content.contents));
    }
  });
  return result;
}

Documentation.routes = function () {
  var routes = createContentRoutes(CONTENTS);
  return (
    <Route name="documentation" path="documentation" handler={Documentation}>
      {routes}
    </Route>
  );
};

module.exports = Documentation;
