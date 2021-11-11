/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { jsToCss } = require('../../dist/lib/es5/jsToCss');

describe('jsToCss', () => {
  const _module = {
    something: {
      backgroundColor: '#fff',
      fontSize: 12,
      padding: 16,
    },
  };

  test('basic', () => {
    const input = {
      name: 'index.css',
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css: `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });

  test('override', () => {
    const input = {
      overrides: {
        something: 'p',
      },
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: undefined,
      css: `p {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });

  test('prepend', () => { 
    const _module = {
      test: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
    };

    const input = {
      prepend: '.test',
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: undefined,
      css: `.test {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });

  test('prepend + overrides', () => {  
    const input = {
      prepend: '.test',
      overrides: {
        something: '.test-something-else',
      },
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: undefined,
      css: `.test-something-else {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });
  
  test('version', () => {
    const input = {
      version: '1.2.3',
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: undefined,
      css: `.v1-2-3-something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });

  test('version + prepend', () => {  
    const input = {
      prepend: '.test',
      version: '1.2.3',
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: undefined,
      css: `.test-v1-2-3-something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`});
  });

  test('multiple files', () => {
    const input = {
      name: 'index.css',
      module: _module,
    };

    expect(jsToCss([input, { ...input, name: 'another-file.css' }])).toStrictEqual([{
      name: 'index.css',
      css: `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`},
{
  name: 'another-file.css',
  css: `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`},
]);
  });

  test('combinators', () => {
    const _module = {
      something: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
      combinators: {
        '& + &': {
          marginLeft: 8,
        },
        '&:first-child': {
          marginLeft: 0,
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
    };

    const css = `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}

.combinators + .combinators {
  margin-left: 8px;
}

.combinators:first-child {
  margin-left: 0;
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });

  test('combinators with override', () => {
    const _module = {
      something: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
      combinators: {
        '& + &': {
          marginLeft: 8,
        },
        '&:first-child': {
          marginLeft: 0,
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
      combinators: {
        combinators: '.test',
      },
    };

    const css = `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}

.test + .test {
  margin-left: 8px;
}

.test:first-child {
  margin-left: 0;
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });

  test('override containing a combinator', () => {
    const _module = {
      something: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
      combinators: {
        '& + &': {
          marginLeft: 8,
        },
        '&:first-child': {
          marginLeft: 0,
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
      overrides: {
        combinators: '.override',
      },
      combinators: {
        combinators: '.test',
      },
    };

    const css = `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}

.test + .test {
  margin-left: 8px;
}

.test:first-child {
  margin-left: 0;
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });
  
  test('nested styles', () => {
    const _module = {
      information: {
        backgroundColor: 'green',
        fontSize: 12,
        padding: 16,
        'button:hover': {
          '--button-hover-text-color': '#fff',
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
    };

    const css = `.information {
  background-color: green;
  font-size: 12px;
  padding: 16px;
}

.information button:hover {
  --button-hover-text-color: #fff;
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });

  test('media query', () => {
    const _module = {
      information: {
        backgroundColor: 'green',
        fontSize: 12,
        padding: 16,
        '@media only screen and (max-width: 699px)': {
          backgroundColor: '#777',
          boxShadow: '0 5px 5px rgb(0,0,0.2)',
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
    };

    const css = `.information {
  background-color: green;
  font-size: 12px;
  padding: 16px;
}

@media only screen and (max-width: 699px) {
  .information {
    background-color: #777;
    box-shadow: 0 5px 5px rgb(0,0,0.2);
  }
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });

  test('pseudo elements', () => {
    const _module = {
      information: {
        backgroundColor: 'green',
        fontSize: 12,
        padding: 16,
        ':before': {
          content: '""',
        },
      },
    };
  
    const input = {
      name: 'index.css',
      module: _module,
    };

    const css = `.information {
  background-color: green;
  font-size: 12px;
  padding: 16px;
}

.information:before {
  content: "";
}`;

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css,
    });
  });
  
  test('ignore', () => {
    const _module = {
      something: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
      somethingElse: {
        backgroundColor: '#fff',
        fontSize: 12,
        padding: 16,
      },
    };
  
    const input = {
      name: 'index.css',
      ignore: ['somethingElse'],
      module: _module,
    };

    const css = `.something {
  background-color: #fff;
  font-size: 12px;
  padding: 16px;
}`;

    expect(jsToCss(input)).toStrictEqual({ name: 'index.css', css });
  });
  
  test('undefined key', () => {
    const _module = {
      something: {
        backgroundColor: '#fff',
        fontSize: undefined,
        padding: 16,
      },
    };

    const input = {
      name: 'index.css',
      module: _module,
    };

    expect(jsToCss(input)).toStrictEqual({
      name: 'index.css',
      css: `.something {
  background-color: #fff;
  padding: 16px;
}`});
  });
});